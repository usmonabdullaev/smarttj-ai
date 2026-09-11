import { ConfigService } from '@nestjs/config';
import { AskRequest } from '@smarttj/core/ai';
import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

import { LoggerService } from '../logger/logger.service.js';

@Injectable()
export class GeminiProvider {
  private readonly client: GoogleGenAI;
  private readonly logger = new LoggerService(GeminiProvider.name);

  constructor(private readonly config: ConfigService) {
    this.client = new GoogleGenAI({
      apiKey: this.config.get('GEMINI_API_KEY'),
    });
  }

  async ask(dto: AskRequest) {
    const model =
      dto.model ||
      this.config.get('GEMINI_DEFAULT_MODEL') ||
      'gemini-3-flash-preview';

    try {
      const result = await this.client.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [{ text: dto.prompt }],
          },
        ],
        config: {
          temperature: dto.temperature ?? 0.3,
          systemInstruction: dto.context,
        },
      });

      const text =
        result.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ??
        '';

      return text;
    } catch (error) {
      this.logger.error('Gemini request failed', {
        error,
        model,
        purpose: dto.purpose,
      });

      throw error;
    }
  }
}
