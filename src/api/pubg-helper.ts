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