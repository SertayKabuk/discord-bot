import axios from 'axios';

export class HttpClient {
	async Get<T>(url: string) : Promise<T | null>{
			try {
				const { data, status } = await axios.get<T>(url);

				if(status == 200)
					return data;
			}
			catch (error) {
				console.error(error);
			}

			return null;
	}
};

export const httpClient = new HttpClient();