import { ChatOllama } from "@langchain/ollama";
class OllamaHelper {
    private static instance: OllamaHelper;
    llm!: ChatOllama;

    private constructor() {}

    static getInstance(): OllamaHelper {
        if (!OllamaHelper.instance) {
            OllamaHelper.instance = new OllamaHelper();
        }
        return OllamaHelper.instance;
    }

    init(model: string, url: string) {
        this.llm = new ChatOllama({
            model: model,
            temperature: 0,
            maxRetries: 2,
            baseUrl: url
        });
    }
}

const ollama = OllamaHelper.getInstance();

export default ollama;