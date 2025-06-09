import { Module } from '@nestjs/common';
import { RecommendCommand } from './commands/recommend.command';

@Module({
  providers: [RecommendCommand],
})
export class CliModule {} 