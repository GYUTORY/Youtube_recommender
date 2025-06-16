import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { YouTubeService } from '../../youtube/youtube.service';
import * as inquirer from 'inquirer';
import { YouTubeAPIException } from '../../youtube/exceptions/youtube-api.exception';

@Command({
  name: 'recommend',
  description: '특정 연도대의 인기 음악을 추천합니다.',
  arguments: '<year>',
})
export class RecommendCommand extends CommandRunner {
  constructor(private readonly youtubeService: YouTubeService) {
    super();
  }

  async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    let year: number;

    if (options?.interactive) {
      const { year: selectedYear } = await (inquirer as any).prompt([
        {
          type: 'input',
          name: 'year',
          message: '추천받을 연도를 입력하세요 (예: 2000):',
          validate: (input: string) => {
            const year = parseInt(input);
            if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
              return '유효한 연도를 입력해주세요 (1900년 이후)';
            }
            return true;
          },
        },
      ]);
      year = parseInt(selectedYear);
    } else {
      year = parseInt(passedParams[0]);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        console.error('유효한 연도를 입력해주세요 (1900년 이후)');
        return;
      }
    }

    try {
      const recommendations = await this.youtubeService.searchByYear(year);
      console.log(`\n🎵 ${year}년대 추억의 음악 🎵\n`);
      
      recommendations.forEach((video, index) => {
        console.log(`${index + 1}. ${video.title}`);
        console.log(`   아티스트: ${video.channelTitle}`);
        console.log(`   URL: https://youtube.com/watch?v=${video.videoId}\n`);
      });

      console.log(`실행 시간: ${new Date().toLocaleString()}\n`);
    } catch (error) {
      console.error('음악 추천을 가져오는 중 오류가 발생했습니다:', error.message);
    }
  }

  private handleError(error: any) {
    if (error instanceof YouTubeAPIException) {
      switch (error.code) {
        case 'QUOTA_EXCEEDED':
          console.error('\n❌ YouTube API 할당량이 초과되었습니다.');
          console.error('잠시 후 다시 시도해주세요.\n');
          break;
        case 'API_KEY_INVALID':
          console.error('\n❌ YouTube API 키가 유효하지 않습니다.');
          console.error('.env 파일의 YOUTUBE_API_KEY를 확인해주세요.\n');
          break;
        case 'NO_RESULTS':
          console.error('\n❌ 검색 결과가 없습니다.');
          console.error('다른 연도를 선택해주세요.\n');
          break;
        default:
          console.error('\n❌ YouTube API 오류가 발생했습니다.');
          console.error(error.message + '\n');
      }
    } else {
      console.error('\n❌ 오류가 발생했습니다:');
      console.error(error.message + '\n');
    }
  }
} 