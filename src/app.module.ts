import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AskModule } from './modules/ask/ask.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    AskModule,
  ],
})
export class AppModule {}
