import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { YouTubeService } from '../../youtube/youtube.service';
import * as inquirer from 'inquirer';
import { YouTubeAPIException } from '../../youtube/exceptions/youtube-api.exception';

@Injectable()
export class RecommendCommand {
  constructor(private readonly youtubeService: YouTubeService) {}

  @Command({
    command: 'recommend',
    describe: '특정 연도대의 인기 음악을 추천합니다',
    options: [
      {
        flags: '-y, --year <year>',
        description: '추천할 연도 (예: 2000)',
      },
      {
        flags: '-i, --interactive',
        description: '인터랙티브 모드로 실행',
      },
    ],
  })
  async recommend(options: { year?: number; interactive?: boolean }) {
    try {
      const year = options.interactive
        ? await this.selectYear()
        : options.year;

      if (!year) {
        throw new Error('연도를 입력해주세요.');
      }

      const recommendation = await this.youtubeService.searchByYear(year);
      this.displayRecommendation(recommendation);
    } catch (error) {
      this.handleError(error);
    }
  }

  private async selectYear(): Promise<number> {
    const yearRanges = [
      { name: '90년대', value: 1990 },
      { name: '2000년대', value: 2000 },
      { name: '2010년대', value: 2010 },
      { name: '2020년대', value: 2020 },
    ];

    const { year } = await inquirer.prompt([
      {
        type: 'list',
        name: 'year',
        message: '어떤 연도대의 음악을 추천받으시겠습니까?',
        choices: yearRanges,
      },
    ]);

    return year;
  }

  private displayRecommendation(recommendation: any) {
    console.log('\n🎵 추천 음악 🎵\n');
    console.log(`제목: ${recommendation.title}`);
    console.log(`아티스트: ${recommendation.channelTitle}`);
    console.log(`발매년도: ${recommendation.publishedAt}`);
    console.log(`URL: ${recommendation.url}\n`);
    console.log(`실행 시간: ${new Date().toLocaleString()}\n`);
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