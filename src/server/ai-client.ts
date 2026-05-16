import OpenAI from "openai";
import { env } from "@/server/env";

let _client: OpenAI | null = null;
let _model: string | null = null;

function resolveClient(): { client: OpenAI; model: string } {
  if (_client && _model) return { client: _client, model: _model };

  if (env.AI_PROVIDER === "deepseek") {
    if (!env.DEEPSEEK_API_KEY) {
      throw new Error(
        "DEEPSEEK_API_KEY is required when AI_PROVIDER is deepseek",
      );
    }
    _client = new OpenAI({
      apiKey: env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });
    _model = env.DEEPSEEK_MODEL;
  } else {
    if (!env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY is required when AI_PROVIDER is openai",
      );
    }
    _client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    _model = env.OPENAI_MODEL;
  }

  return { client: _client, model: _model };
}

export { resolveClient };
