import "./env.js";
import { HttpServer } from "./httpServer.js";
import discordClient from "./discord_client_helper.js";
import ollama from "./ollama_helper.js";
import dbHelper from "./db_helper.js";
import graphQLHelper from "./graphQL_helper.js";
import vectorStoreHelper from "./vector_store_helper.js";
import openai from "./openai_helper.js";

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