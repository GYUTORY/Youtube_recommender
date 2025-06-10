import { Command, CommandRunner } from 'nest-commander';
import { YoutubeService } from '../../youtube/youtube.service';
import inquirer from 'inquirer';

const YEAR_CHOICES = [
  { name: '1990년대', value: 1990 },
  { name: '2000년대', value: 2000 },
  { name: '2010년대', value: 2010 },
  { name: '2020년대', value: 2020 },
];

@Command({
  name: 'recommend',
  description: '음악 추천 결과를 콘솔에 출력합니다.',
})
export class RecommendCommand extends CommandRunner {
  constructor(private readonly youtubeService: YoutubeService) {
    super();
  }

  async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    let year = options?.year || 2000;
    const interactive = options?.interactive;

    if (interactive) {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'year',
          message: '추천받고 싶은 연도대를 선택하세요!',
          choices: YEAR_CHOICES,
        },
      ]);
      year = answer.year;
    }

    try {
      const music = await this.youtubeService.getRandomMusicByYear(year);
      const now = new Date();
      console.log(`\n🎵 ${year}년대 추억의 음악 🎵\n`);
      console.log(`제목: ${music.title}`);
      console.log(`아티스트: ${music.channelTitle}`);
      console.log(`발매년도: ${music.publishedAt ? music.publishedAt.slice(0, 4) : '정보 없음'}`);
      console.log(`URL: https://youtube.com/watch?v=${music.videoId}\n`);
      console.log(`실행 시간: ${now.toISOString().replace('T', ' ').slice(0, 19)}`);
    } catch (error) {
      if (error.message.includes('API 키')) {
        console.error('\n[환경 변수 오류] YouTube API 키가 누락되었습니다. .env 파일을 확인하세요.');
      } else if (error.message.includes('quotaExceeded')) {
        console.error('\n[API 할당량 초과] YouTube API 할당량이 초과되었습니다. 잠시 후 다시 시도해 주세요.');
      } else if (error.message.includes('찾을 수 없습니다')) {
        console.error(`\n[검색 결과 없음] ${year}년대의 음악을 찾을 수 없습니다.`);
      } else {
        console.error(`\n[에러] 음악 추천에 실패했습니다: ${error.message}`);
      }
    }
  }
} 