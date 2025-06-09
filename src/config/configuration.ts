import { registerAs } from '@nestjs/config';

export interface YoutubeConfig {
  apiKey: string;
}

export interface AppConfig {
  youtube: YoutubeConfig;
}

const validateConfig = (config: AppConfig) => {
  const requiredEnvVars = {
    'YOUTUBE_API_KEY': config.youtube.apiKey,
  };

  const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`,
    );
  }
};

export default registerAs('app', (): AppConfig => {
  const config: AppConfig = {
    youtube: {
      apiKey: process.env.YOUTUBE_API_KEY,
    },
  };

  validateConfig(config);
  return config;
}); 