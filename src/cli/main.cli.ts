import { CommandFactory } from 'nest-commander';
import { CliModule } from './cli.module';

async function bootstrap() {
  await CommandFactory.run(CliModule, { 
    // 옵션이 필요하다면 여기에 추가
  });
}

bootstrap(); 