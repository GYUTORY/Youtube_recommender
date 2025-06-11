import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CommandTestFactory } from 'nestjs-command';
import { AppModule } from '../src/app.module';
import { YouTubeService } from '../src/youtube/youtube.service';
import { YouTubeAPIException } from '../src/youtube/exceptions/youtube-api.exception';

describe('RecommendCommand (e2e)', () => {
  let app: INestApplication;
  let youtubeService: YouTubeService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    youtubeService = moduleFixture.get<YouTubeService>(YouTubeService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should recommend music for a specific year', async () => {
    // Mock YouTubeService
    jest.spyOn(youtubeService, 'searchByYear').mockResolvedValue({
      title: 'Test Music',
      channelTitle: 'Test Artist',
      publishedAt: '2000',
      url: 'https://youtube.com/watch?v=test123',
    });

    const commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [AppModule],
    });

    const output = await commandInstance.run(['recommend', '--year', '2000']);

    expect(output).toContain('🎵 추천 음악 🎵');
    expect(output).toContain('Test Music');
    expect(output).toContain('Test Artist');
    expect(output).toContain('2000');
    expect(output).toContain('https://youtube.com/watch?v=test123');
  });

  it('should handle API quota exceeded error', async () => {
    // Mock YouTubeService to throw quota exceeded error
    jest.spyOn(youtubeService, 'searchByYear').mockRejectedValue(
      new YouTubeAPIException('YouTube API 할당량이 초과되었습니다.', 'QUOTA_EXCEEDED')
    );

    const commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [AppModule],
    });

    const output = await commandInstance.run(['recommend', '--year', '2000']);

    expect(output).toContain('❌ YouTube API 할당량이 초과되었습니다.');
    expect(output).toContain('잠시 후 다시 시도해주세요.');
  });

  it('should handle no results error', async () => {
    // Mock YouTubeService to throw no results error
    jest.spyOn(youtubeService, 'searchByYear').mockRejectedValue(
      new YouTubeAPIException('검색 결과가 없습니다.', 'NO_RESULTS')
    );

    const commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [AppModule],
    });

    const output = await commandInstance.run(['recommend', '--year', '2000']);

    expect(output).toContain('❌ 검색 결과가 없습니다.');
    expect(output).toContain('다른 연도를 선택해주세요.');
  });

  it('should handle invalid API key error', async () => {
    // Mock YouTubeService to throw invalid API key error
    jest.spyOn(youtubeService, 'searchByYear').mockRejectedValue(
      new YouTubeAPIException('YouTube API 키가 유효하지 않습니다.', 'API_KEY_INVALID')
    );

    const commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [AppModule],
    });

    const output = await commandInstance.run(['recommend', '--year', '2000']);

    expect(output).toContain('❌ YouTube API 키가 유효하지 않습니다.');
    expect(output).toContain('.env 파일의 YOUTUBE_API_KEY를 확인해주세요.');
  });
}); 