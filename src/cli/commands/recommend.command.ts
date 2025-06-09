import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'recommend',
  description: '음악 추천 결과를 콘솔에 출력합니다.',
})
export class RecommendCommand extends CommandRunner {
  async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    // TODO: 추천 로직 연동
    console.log('추천 결과:');
    console.log('- 음악1');
    console.log('- 음악2');
    console.log('- 음악3');
  }
} 