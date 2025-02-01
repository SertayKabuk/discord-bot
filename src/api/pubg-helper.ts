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

export async function getPlayerDetail(nickname: string): Promise<PubgPlayerResponse> {
  // Replace <YOUR_API_TOKEN> with your actual PUBG API token or source it from an environment variable.
  const token = process.env.PUBG_API_TOKEN;
  const url = `https://api.pubg.com/shards/steam/players?filter[playerNames]=${encodeURIComponent(nickname)}`;
  
  const response = await fetch(url, {
    headers: {
      "accept": "application/vnd.api+json",
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return await response.json();
}

export async function getMatchDetail(matchId: string): Promise<PubgMatchResponse> {
  // Replace <YOUR_API_TOKEN> with your actual PUBG API token or source it from an environment variable.
  const url = `https://api.pubg.com/shards/steam/matches/${encodeURIComponent(matchId)}`;
  
  const response = await fetch(url, {
    headers: {
      "accept": "application/vnd.api+json",
    }
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return await response.json();
}