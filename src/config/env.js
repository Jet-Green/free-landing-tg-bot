import dotenv from 'dotenv';

if (!globalThis.config) {
  dotenv.config();

  const required = ['LOVABLE_API_KEY', 'LOVABLE_API_URL'];

  for (const key of required) {
    if (!process.env[key]) {
      console.error(`[env] Missing required environment variable: ${key}`);
      process.exit(1);
    }
  }

  globalThis.config = {
    lovableApiKey: process.env.LOVABLE_API_KEY,
    lovableApiUrl: process.env.LOVABLE_API_URL,
  };
}

export const config = globalThis.config;