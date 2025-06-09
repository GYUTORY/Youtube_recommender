import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AppConfig } from '../config/configuration';

@Injectable()
export class YoutubeService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(private configService: ConfigService<AppConfig>) {
    const youtubeConfig = this.configService.get('app.youtube');
    this.apiKey = youtubeConfig.apiKey;
  }

  /**
   * 특정 연도의 음악을 YouTube에서 검색합니다.
   * @param year 검색할 연도
   * @returns 검색된 음악 목록
   */
  async searchMusicByYear(year: number): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          q: `music hits ${year}`,
          type: 'video',
          maxResults: 10,
          videoCategoryId: '10', // 음악 카테고리
          order: 'relevance',
          key: this.apiKey,
        },
      });

      const videos = response.data.items;
      
      // 비디오 상세 정보를 가져오기 위한 ID 목록
      const videoIds = videos.map(video => video.id.videoId).join(',');
      
      // 비디오 상세 정보 조회
      const videoDetails = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet,statistics',
          id: videoIds,
          key: this.apiKey,
        },
      });

      // 검색 결과와 상세 정보를 결합
      return videoDetails.data.items.map(video => ({
        videoId: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnailUrl: video.snippet.thumbnails.high.url,
        publishedAt: video.snippet.publishedAt,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        channelTitle: video.snippet.channelTitle,
      }));
    } catch (error) {
      if (error.response) {
        throw new Error(`YouTube API 오류: ${error.response.data.error.message}`);
      }
      throw new Error(`YouTube API 검색 중 오류 발생: ${error.message}`);
    }
  }

  /**
   * 특정 연도의 음악 중 랜덤으로 하나를 추천합니다.
   * @param year 검색할 연도
   * @returns 랜덤으로 선택된 음악 정보
   */
  async getRandomMusicByYear(year: number): Promise<any> {
    const musicList = await this.searchMusicByYear(year);
    
    if (!musicList || musicList.length === 0) {
      throw new Error(`${year}년도의 음악을 찾을 수 없습니다.`);
    }

    // 랜덤 인덱스 생성
    const randomIndex = Math.floor(Math.random() * musicList.length);
    return musicList[randomIndex];
  }
} 