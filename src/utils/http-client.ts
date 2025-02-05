export class HttpClient {
  async Get<T>(url: string, headers?: HeadersInit): Promise<T | undefined> {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
      if (response.ok) {
        const data = (await response.json()) as T;
        return data;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const httpClient = new HttpClient();
