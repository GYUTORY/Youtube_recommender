export class YouTubeAPIException extends Error {
  constructor(
    message: string,
    public readonly code: 'QUOTA_EXCEEDED' | 'API_KEY_INVALID' | 'NO_RESULTS' | 'UNKNOWN_ERROR'
  ) {
    super(message);
    this.name = 'YouTubeAPIException';
  }
} 