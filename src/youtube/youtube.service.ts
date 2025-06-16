import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { YouTubeAPIException } from './exceptions/youtube-api.exception';

@Injectable()
export class YouTubeService {
  private readonly youtube;
  private readonly searchQueryTemplate: string;
  private readonly maxResults: number;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
    if (!apiKey) {
      throw new Error('YouTube API 키가 설정되지 않았습니다.');
    }

    this.youtube = google.youtube({
      version: 'v3',
      auth: apiKey,
    });

    this.searchQueryTemplate = this.configService.get<string>('YOUTUBE_SEARCH_QUERY_TEMPLATE') || '{year}년대 인기곡';
    this.maxResults = this.configService.get<number>('YOUTUBE_API_MAX_RESULTS') || 10;
  }

  async searchByYear(year: number) {
    try {
      const query = this.buildSearchQuery(year);
      const response = await this.youtube.search.list({
        part: ['snippet'],
        q: query,
        type: ['video'],
        maxResults: this.maxResults,
        videoCategoryId: '10', // 음악 카테고리
        order: 'viewCount', // 조회수 순
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new YouTubeAPIException('검색 결과가 없습니다.', 'NO_RESULTS');
      }

      return response.data.items.map(item => ({
        videoId: item.id?.videoId,
        title: item.snippet?.title,
        channelTitle: item.snippet?.channelTitle,
        publishedAt: item.snippet?.publishedAt,
      }));
    } catch (error) {
      if (error instanceof YouTubeAPIException) {
        throw error;
      }
      throw new YouTubeAPIException(`YouTube API 호출 중 오류가 발생했습니다: ${error.message}`, 'UNKNOWN_ERROR');
    }
  }

  private buildSearchQuery(year: number): string {
    return this.searchQueryTemplate.replace('{year}', year.toString());
  }
} 