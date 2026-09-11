import { ConfigService } from '@nestjs/config';
import { AskRequest } from '@smarttj/core/ai';
import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import 'dotenv/config';

import { LoggerService } from '../logger/logger.service.js';

@Injectable()
export class GroqProvider {
  private readonly client: Groq;
  private readonly logger = new LoggerService(GroqProvider.name);

  constructor(private readonly config: ConfigService) {
    this.client = new Groq({
      apiKey: this.config.get('GROQ_API_KEY'),
    });
  }

  async ask(dto: AskRequest) {
    const model =
      dto.model || this.config.get('GROQ_DEFAULT_MODEL') || 'groq/compound';

    try {
      const result = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: dto.context || '',
          },
          {
            role: 'user',
            content: dto.prompt,
          },
        ],
        temperature: dto.temperature ?? 0.3,
      });

      const text = result.choices[0]?.message?.content || '';

      return text;
    } catch (error) {
      this.logger.error('Groq request failed', {
        error,
        model,
        purpose: dto.purpose,
      });

      throw error;
    }
  }
}
