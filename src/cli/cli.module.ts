import { Module } from '@nestjs/common';
import { RecommendCommand } from './commands/recommend.command';
import { YoutubeModule } from '../youtube/youtube.module';

@Module({
  imports: [YoutubeModule],
  providers: [RecommendCommand],
})
export class CliModule {} 