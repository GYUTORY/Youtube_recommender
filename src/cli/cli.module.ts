import { Module } from '@nestjs/common';
import { RecommendCommand } from './commands/recommend.command';
import { YouTubeModule } from '../youtube/youtube.module';

@Module({
  imports: [YouTubeModule],
  providers: [RecommendCommand],
})
export class CliModule {} 