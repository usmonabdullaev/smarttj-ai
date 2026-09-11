import { ConfigService } from '@nestjs/config';
import { AskRequest } from '@smarttj/core/ai';
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import 'dotenv/config';

import { LoggerService } from '../logger/logger.service.js';

@Injectable()
export class OpenAIProvider {
  private readonly client: OpenAI;
  private readonly logger = new LoggerService(OpenAIProvider.name);

  constructor(private readonly config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.get('OPENAI_API_KEY'),
    });
  }

  async ask(dto: AskRequest) {
    const model =
      dto.model || this.config.get('OPENAI_DEFAULT_MODEL') || 'gpt-5.1';

    try {
      const result = await this.client.responses.create({
        model,
        instructions: dto.context,
        input: dto.prompt,
        temperature: dto.temperature ?? 0.3,
      });

      const text = result.output_text;

      return text;
    } catch (error) {
      this.logger.error('OpenAI request failed', {
        error,
        model,
        purpose: dto.purpose,
      });

      throw error;
    }
  }
}
