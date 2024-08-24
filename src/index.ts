import "./env";
import { HttpServer } from "./httpServer";
import discordClient from "./discord_client_helper";
import ollama from "./ollama_helper";
import dbHelper from "./db_helper";
import graphQLHelper from "./graphQL_helper";

async function main() {

    graphQLHelper.init();
    await dbHelper.init(); 
    ollama.init();
    await discordClient.init();

    const server = new HttpServer(process.env.API_PORT);
    server.CreateServer();
    await discordClient.connect();
}

main();