import OpenAI from "openai";

declare var process: { env: Record<string, string | undefined> };

const openaiClientSingleton = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

type OpenAIClientSingleton = ReturnType<typeof openaiClientSingleton>;

const globalForOpenAI = globalThis as unknown as {
  openai: OpenAIClientSingleton | undefined;
};

export const openai = globalForOpenAI.openai ?? openaiClientSingleton();

if (process.env.NODE_ENV !== "production") globalForOpenAI.openai = openai;
