import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { YouTubeAPIException } from './exceptions/youtube-api.exception';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class YouTubeService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async searchByYear(year: number) {
    try {
      const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
      if (!apiKey) {
        throw new YouTubeAPIException(
          'YouTube API 키가 설정되지 않았습니다.',
          'API_KEY_INVALID'
        );
      }

      const query = this.createSearchQuery(year);
      const response = await firstValueFrom(
        this.httpService.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: apiKey,
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: 50,
            videoCategoryId: '10', // Music category
          },
        })
      );

      if (!response.data.items || response.data.items.length === 0) {
        throw new YouTubeAPIException(
          `${year}년대의 음악을 찾을 수 없습니다.`,
          'NO_RESULTS'
        );
      }

      const randomVideo = this.getRandomVideo(response.data.items);
      return this.transformVideoData(randomVideo);
    } catch (error) {
      if (error instanceof YouTubeAPIException) {
        throw error;
      }

      if (error.response?.status === 403) {
        throw new YouTubeAPIException(
          'YouTube API 할당량이 초과되었습니다.',
          'QUOTA_EXCEEDED'
        );
      }

      throw new YouTubeAPIException(
        'YouTube API 호출 중 오류가 발생했습니다.',
        'UNKNOWN_ERROR'
      );
    }
  }

  private createSearchQuery(year: number): string {
    const template = this.configService.get<string>('YOUTUBE_SEARCH_QUERY_TEMPLATE');
    return template.replace('{year}', year.toString());
  }

  private getRandomVideo(items: any[]): any {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }

  private transformVideoData(video: any) {
    return {
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt.slice(0, 4),
      url: `https://youtube.com/watch?v=${video.id.videoId}`,
    };
  }
} 