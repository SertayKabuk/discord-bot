import { Ollama } from "@langchain/ollama";

class OllamaHelper {
    llm!: Ollama;

    init() {
        this.llm = new Ollama({
            model: "llama3.1:8b",
            temperature: 0,
            maxRetries: 2,
            baseUrl: process.env.OLLAMA_URL
        });
    }
}

const ollama = new OllamaHelper();

export default ollama;