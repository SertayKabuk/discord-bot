import "./env.js";
import { HttpServer } from "./http-server.js";
import ollama from "./utils/ollama-helper.js";
import dbHelper from "./db/db-helper.js";
import vectorStoreHelper from "./utils/vector-store-helper.js";
import openai from "./utils/openai-helper.js";
import graphQLHelper from "./utils/graphql-helper.js";
import discordClient from "./utils/discord-client-helper.js";

async function main() {
    await vectorStoreHelper.init();
    graphQLHelper.init(process.env.TARKOV_GRAPHQL_CLIENT);
    await dbHelper.init(); 
    ollama.init(process.env.OLLAMA_MODEL, process.env.OLLAMA_URL);
    await discordClient.init();
    openai.init(process.env.OPEN_ROUTER_URL, process.env.OPEN_ROUTER_API_KEY, process.env.GOOGLE_API_URL, process.env.GOOGLE_API_KEY);

    const server = new HttpServer(process.env.API_PORT);
    server.CreateServer();
    await discordClient.connect(process.env.TOKEN);
}

main();