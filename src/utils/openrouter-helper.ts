import { httpClient } from "./http-client.js";

export interface Model {
  id: string;
  name: string;
  created: number;
  description: string;
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type: string;
  };
  pricing: {
    prompt: string;
    completion: string;
    image: string;
    request: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens: number;
    is_moderated: boolean;
  };
  per_request_limits: any;
}

export interface ApiResponse {
  data: Model[];
}

export async function fetchFilteredLLMModels(name: string): Promise<Model[]> {
  const response = await httpClient.Get<ApiResponse>(
    process.env.OPEN_ROUTER_URL + "/models"
  );

  const filteredData = response?.data.filter(
    (model) =>
      model.pricing.prompt === "0" &&
      model.name.includes(name) &&
      (model.architecture.modality === "text->text" || model.architecture.modality === "text+image->text")
  );

  return filteredData || [];
}
