import { Ollama } from "@langchain/ollama";

class OllamaHelper {
    llm!: Ollama;

    init(model:string, url: string) {
        this.llm = new Ollama({
            model: model,
            temperature: 0,
            maxRetries: 2,
            baseUrl: url
        });
    }
}

const ollama = new OllamaHelper();

export default ollama;