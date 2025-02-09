import mongoHelper from "../db/mongo-helper.js";
import { httpClient } from "./http-client.js";

// Define response model interfaces
interface Match {
  type: string;
  id: string;
}

interface PlayerAttributes {
  banType: string;
  clanId: string;
  name: string;
  stats: any;
  titleId: string;
  shardId: string;
  patchVersion: string;
}

interface PlayerRelationships {
  assets: { data: any[] };
  matches: { data: Match[] };
}

interface Player {
  type: string;
  id: string;
  attributes: PlayerAttributes;
  relationships: PlayerRelationships;
  links: { schema: string; self: string };
}

export interface PubgPlayerResponse {
  data: Player[];
  links: { self: string };
  meta: Record<string, any>;
}

// New interface for match details response (minimal typing)
export interface PubgMatchResponse {
  data: {
    type: string;
    id: string;
    attributes: {
      matchType: string;
      duration: number;
      stats: any;
      gameMode: string;
      titleId: string;
      shardId: string;
      tags: any;
      mapName: string;
      createdAt: string;
      isCustomMatch: boolean;
      seasonState: string;
    };
    relationships: {
      rosters: { data: { type: string; id: string }[] };
      assets: { data: { type: string; id: string }[] };
    };
    links: { self: string; schema: string };
  };
  included: ParticipantIncluded[];
  links: { self: string };
  meta: Record<string, any>;
}

// New interface for detailed participant stats
export interface ParticipantStats {
  DBNOs: number;
  assists: number;
  boosts: number;
  damageDealt: number;
  deathType: string;
  headshotKills: number;
  heals: number;
  killPlace: number;
  killStreaks: number;
  kills: number;
  longestKill: number;
  name: string;
  playerId: string;
  revives: number;
  rideDistance: number;
  roadKills: number;
  swimDistance: number;
  teamKills: number;
  timeSurvived: number;
  vehicleDestroys: number;
  walkDistance: number;
  weaponsAcquired: number;
  winPlace: number;
}

// New interface for participant included objects in match response
export interface ParticipantIncluded {
  type: string;
  id: string;
  attributes: {
    stats: ParticipantStats;
    actor: string;
    shardId: string;
    // ...other possible fields...
  };
}

const playerCollection = "players";
const matchCollection = "matches";

export async function getPlayerDetail(
  nickname: string
): Promise<PubgPlayerResponse> {
  const token = process.env.PUBG_API_TOKEN;
  const url = `https://api.pubg.com/shards/steam/players?filter[playerNames]=${encodeURIComponent(
    nickname
  )}`;

  const result = await httpClient.Get<PubgPlayerResponse>(url, {
    accept: "application/vnd.api+json",
    Authorization: `Bearer ${token}`,
  });
  if (!result) {
    throw new Error("API error: Failed to fetch player details.");
  }

  try {
    if (result.data && result.data.length > 0) {
      // Passing the id from result.data[0].id as parameter.
      mongoHelper.insertOne(playerCollection, result.data[0].id, result);
    }
  } catch (e) {
    console.error("Error inserting player data", e);
  }

  return result;
}

export async function getMatchDetail(
  matchId: string
): Promise<PubgMatchResponse> {
  // Check if match details already exist in MongoDB
  const cached = await mongoHelper.findOne(matchCollection, { id: matchId });
  if (cached) {
    return cached;
  }

  const url = `https://api.pubg.com/shards/steam/matches/${encodeURIComponent(
    matchId
  )}`;

  const result = await httpClient.Get<PubgMatchResponse>(url, {
    accept: "application/vnd.api+json",
  });
  if (!result) {
    throw new Error("API error: Failed to fetch match details.");
  }

  try {
    if (result.data) {
      // Passing the id from result.data.id as parameter.
      mongoHelper.insertOne(matchCollection, result.data.id, result);
    }
  } catch (e) {
    console.error("Error inserting match data", e);
  }

  return result;
}

export function summarizeMatchDetails(
  playerId: string,
  matchDataList: PubgMatchResponse[]
) {
  // Aggregate stats and collect match summaries
  let totalKills = 0,
    totalDamage = 0,
    totalSurvived = 0,
    totalAssists = 0,
    totalHeadshotKills = 0,
    totalDBNOs = 0,
    totalWalkDistance = 0,
    totalRideDistance = 0,
    totalRevives = 0,
    totalWinPlace = 0;

  let countMatches = 0;
  const matchSummaries: string[] = [];

  for (const matchResponse of matchDataList) {
    const participant = matchResponse.included.find(
      (element: any) => element.attributes?.stats?.playerId === playerId
    );
    if (participant) {
      const stats = participant.attributes.stats;
      totalKills += stats.kills;
      totalDamage += stats.damageDealt;
      totalSurvived += stats.timeSurvived;
      totalAssists += stats.assists;
      totalHeadshotKills += stats.headshotKills;
      totalDBNOs += stats.DBNOs;
      totalWalkDistance += stats.walkDistance;
      totalRideDistance += stats.rideDistance;
      totalRevives += stats.revives;
      totalWinPlace += stats.winPlace;
      countMatches++;

      // Retrieve additional match details
      const gameMode = matchResponse.data.attributes.gameMode || "N/A";
      const mapName = matchResponse.data.attributes.mapName || "N/A";
      const createdAt = matchResponse.data.attributes.createdAt || "N/A";

      matchSummaries.push(
        `• ${createdAt}, Kills ${
          stats.kills
        }, Damage ${stats.damageDealt.toFixed(0)}, Survived ${
          stats.timeSurvived
        }s, Game Mode ${gameMode}, Map ${mapName}, Place ${stats.winPlace}`
      );
    }
  }

  let avgStats = "N/A";
  if (countMatches > 0) {
    avgStats = `• Kills: ${(totalKills / countMatches).toFixed(1)}
 • Damage: ${(totalDamage / countMatches).toFixed(1)}
 • Survived: ${(totalSurvived / countMatches).toFixed(1)}s
 • Assists: ${(totalAssists / countMatches).toFixed(1)}
 • Headshot Kills: ${(totalHeadshotKills / countMatches).toFixed(1)}
 • DBNOs: ${(totalDBNOs / countMatches).toFixed(1)}
 • Walk Distance: ${(totalWalkDistance / countMatches).toFixed(1)}
 • Ride Distance: ${(totalRideDistance / countMatches).toFixed(1)}
 • Revives: ${(totalRevives / countMatches).toFixed(1)}
 • WinPlace: ${(totalWinPlace / countMatches).toFixed(1)}`;
  }

  return { avgStats, matchSummaries };
}
