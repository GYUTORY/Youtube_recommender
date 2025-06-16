import { registerAs } from '@nestjs/config';

export interface YoutubeConfig {
  apiKey: string;
  searchQueryTemplate: string;
  maxResults: number;
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

export default () => ({
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || '',
    searchQueryTemplate: process.env.YOUTUBE_SEARCH_QUERY_TEMPLATE || '{year}년대 인기곡',
    maxResults: parseInt(process.env.YOUTUBE_API_MAX_RESULTS || '10', 10),
  },
}); 