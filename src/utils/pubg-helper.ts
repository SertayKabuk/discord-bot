import { MongoCollectionNames } from "../constants/mongo-collection-names.js";
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

// Asset type definition
export interface AssetAttributes {
  name: string;
  description: string;
  createdAt: string;
  URL: string;
}

export interface Asset {
  type: 'asset';
  id: string;
  attributes: AssetAttributes;
}

// Participant type definition
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

export interface Participant {
  type: 'participant';
  id: string;
  attributes: {
    stats: ParticipantStats;
    actor: string;
    shardId: string;
  };
}

// Roster type definition
export interface RosterStats {
  rank: number;
  teamId: number;
}

export interface RosterParticipant {
  type: 'participant';
  id: string;
}

export interface Roster {
  type: 'roster';
  id: string;
  attributes: {
    stats: RosterStats;
    won: string;
    shardId: string;
  };
  relationships: {
    team: {
      data: null;
    };
    participants: {
      data: RosterParticipant[];
    };
  };
}

export type IncludedType = Asset | Participant | Roster;

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
  included: IncludedType[];
  links: { self: string };
  meta: Record<string, any>;
}

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
      mongoHelper.insertOne(MongoCollectionNames.PLAYER_COLLECTION, result.data[0].id, result);
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
  const cached = await mongoHelper.findOne(MongoCollectionNames.MATCH_COLLECTION, { id: matchId });
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
      mongoHelper.insertOne(MongoCollectionNames.MATCH_COLLECTION, result.data.id, result);
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
      (element): element is Participant => 
        element.type === 'participant' && 
        (element as Participant).attributes.stats.playerId === playerId
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

      const mapName = matchResponse.data.attributes.mapName || "N/A";
      const createdAt = matchResponse.data.attributes.createdAt || "N/A";

      matchSummaries.push(
        `• ${createdAt}, Kills ${
          stats.kills
        }, Damage ${stats.damageDealt.toFixed(0)}, Survived ${
          stats.timeSurvived
        }s, Assists ${stats.assists}, Map ${mapName}, Place ${stats.winPlace}`
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
