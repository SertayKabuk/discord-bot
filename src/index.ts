import "./env.js";
import { HttpServer } from "./http-server.js";
import discordClient from "./discord-client-helper.js";
import ollama from "./ollama-helper.js";
import dbHelper from "./db-helper.js";
import vectorStoreHelper from "./vector-store-helper.js";
import openai from "./openai-helper.js";
import graphQLHelper from "./graphql-helper.js";

async function main() {
    await vectorStoreHelper.init();
    graphQLHelper.init(process.env.TARKOV_GRAPHQL_CLIENT);
    await dbHelper.init(); 
    ollama.init(process.env.OLLAMA_MODEL, process.env.OLLAMA_URL);
    await discordClient.init();
    openai.init(process.env.OPEN_ROUTER_URL, process.env.OPEN_ROUTER_API_KEY);

    const server = new HttpServer(process.env.API_PORT);
    server.CreateServer();
    await discordClient.connect(process.env.TOKEN);
}

main();