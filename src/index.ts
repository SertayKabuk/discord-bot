import "./env";
import { HttpServer } from "./httpServer";
import discordClient from "./discord_client_helper";
import ollama from "./ollama_helper";
import dbHelper from "./db_helper";
import graphQLHelper from "./graphQL_helper";
import vectorStoreHelper from "./vector_store_helper";

async function main() {
    await vectorStoreHelper.init();
    graphQLHelper.init(process.env.TARKOV_GRAPHQL_CLIENT);
    await dbHelper.init(); 
    ollama.init(process.env.OLLAMA_MODEL, process.env.OLLAMA_URL);
    await discordClient.init();

    const server = new HttpServer(process.env.API_PORT);
    server.CreateServer();
    await discordClient.connect(process.env.TOKEN);
}

main();