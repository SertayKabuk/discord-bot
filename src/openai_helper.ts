import OpenAI from "openai";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

class OpenAIHelper {
  private static instance: OpenAIHelper;
  private client: OpenAI | null = null;

  static getInstance(): OpenAIHelper {
    if (!OpenAIHelper.instance) {
      OpenAIHelper.instance = new OpenAIHelper();
    }
    // Don't update model if instance exists
    return OpenAIHelper.instance;
  }

  init(url: string, apiKey: string): void {
    if (!this.client) {
      this.client = new OpenAI({
        baseURL: url,
        apiKey: apiKey,
      });
    }
  }

  async *stream(messages: Message[], model: string): AsyncGenerator<string> {
    if (!this.client) {
      throw new Error("OpenAI client not initialized. Call init() first");
    }

    try {
      const stream = await this.client.chat.completions.create({
        model: model,
        messages: messages,
        store: true,
        stream: true,
      });

      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
          yield chunk.choices[0].delta.content;
        }
      }
    } catch (error) {
      console.error("Error during chat completion:", error);
      throw error;
    }
  }

  async chat(messages: Message[], model: string): Promise<string | null> {
    if (!this.client) {
      throw new Error("OpenAI client not initialized. Call init() first");
    }

    try {
      const stream = await this.client.chat.completions.create({
        model: model,
        messages: messages,
      });

      return stream.choices[0].message.content;
    } catch (error) {
      console.error("Error during chat completion:", error);
      throw error;
    }
  }
}

const openai = OpenAIHelper.getInstance();
export default openai;
