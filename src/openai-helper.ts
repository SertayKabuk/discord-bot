import OpenAI from "openai";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

class OpenAIHelper {
  private static instance: OpenAIHelper;
  private client: OpenAI | null = null;
  private google_client: OpenAI | null = null;

  static getInstance(): OpenAIHelper {
    if (!OpenAIHelper.instance) {
      OpenAIHelper.instance = new OpenAIHelper();
    }
    // Don't update model if instance exists
    return OpenAIHelper.instance;
  }

  init(
    url: string,
    apiKey: string,
    google_api_url: string,
    google_api_key: string
  ): void {
    if (!this.client) {
      this.client = new OpenAI({
        baseURL: url,
        apiKey: apiKey,
      });
    }

    if (!this.google_client) {
      this.google_client = new OpenAI({
        baseURL: google_api_url,
        apiKey: google_api_key,
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
        stream: true,
      });

      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
          yield chunk.choices[0].delta.content;
        }
      }
    } catch (error) {
      console.error("Error during chat completion:", error);
      return this.stream_google(messages);
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
      return await this.chat_google(messages);
    }
  }
  private async *stream_google(messages: Message[]): AsyncGenerator<string> {
    if (!this.google_client) {
      throw new Error("Google OpenAI client not initialized. Call init() first");
    }

    try {
      const stream = await this.google_client.chat.completions.create({
        model: process.env.GOOGLE_LLM_MODEL,
        messages: messages,
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

  private async chat_google(messages: Message[]): Promise<string | null> {
    if (!this.google_client) {
      throw new Error("Google OpenAI client not initialized. Call init() first");
    }

    try {
      const stream = await this.google_client.chat.completions.create({
        model: process.env.GOOGLE_LLM_MODEL,
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
