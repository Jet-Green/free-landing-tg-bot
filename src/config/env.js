import dotenv from "dotenv";

if (!globalThis.config) {
  dotenv.config();

  const required = ["VERCEL_TOKEN", "TG_BOT_TOKEN", "GROQ_TOKEN"];

  for (const key of required) {
    if (!process.env[key]) {
      console.error(`[env] Missing required environment variable: ${key}`);
      process.exit(1);
    }
  }

  globalThis.config = {
    vercelApiToken: process.env.VERCEL_TOKEN,
    tgBotToken: process.env.TG_BOT_TOKEN,
    groqAIToken: process.env.GROQ_TOKEN,
  };
}

export const config = globalThis.config;
