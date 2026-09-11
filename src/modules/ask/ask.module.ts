import { Module } from '@nestjs/common';

import { GeminiProvider } from '../../providers/gemini.provider.js';
import { OpenAIProvider } from '../../providers/openai.provider.js';
import { GroqProvider } from '../../providers/groq.provider.js';
import { AskController } from './ask.controller.js';
import { AskService } from './ask.service.js';

@Module({
  controllers: [AskController],
  providers: [AskService, GeminiProvider, OpenAIProvider, GroqProvider],
})
export class AskModule {}
