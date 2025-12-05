import "./env.js";
import { APIServer } from "./api/api-server.js";
import openai from "./utils/openai-helper.js";
import graphQLHelper from "./utils/graphql-helper.js";
import discordClient from "./utils/discord-client-helper.js";

async function main() {
    graphQLHelper.init(process.env.TARKOV_GRAPHQL_CLIENT);
    openai.init(process.env.OPEN_ROUTER_URL, process.env.OPEN_ROUTER_API_KEY, process.env.GOOGLE_API_URL, process.env.GOOGLE_API_KEY);

    await discordClient.init();
    await discordClient.connect(process.env.TOKEN);

    const server = new APIServer(process.env.API_PORT);
    server.CreateServer();
}

main();