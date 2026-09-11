import { AskRequestProvider, type AskRequest } from '@smarttj/core/ai';
import { Injectable } from '@nestjs/common';

import { GeminiProvider } from '../../providers/gemini.provider.js';
import { OpenAIProvider } from '../../providers/openai.provider.js';
import { GroqProvider } from '../../providers/groq.provider.js';

@Injectable()
export class AskService {
  constructor(
    private readonly geminiProvider: GeminiProvider,
    private readonly openaiProvider: OpenAIProvider,
    private readonly groqProvider: GroqProvider,
  ) {}

  async ask(dto: AskRequest) {
    switch (dto.provider) {
      case AskRequestProvider.OPENAI:
        const openAIResult = await this.openaiProvider.ask(dto);
        return { data: openAIResult };

      case AskRequestProvider.GEMINI:
        const geminiResult = await this.geminiProvider.ask(dto);

        return { data: geminiResult };

      case AskRequestProvider.GROQ:
        const groqResult = await this.groqProvider.ask(dto);
        return { data: groqResult };

      default:
        const data = await this.geminiProvider.ask(dto);

        return { data };
    }
  }
}
