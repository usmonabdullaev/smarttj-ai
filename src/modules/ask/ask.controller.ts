import { Body, Controller, Post } from '@nestjs/common';
import type { AskRequest } from '@smarttj/core/ai';

import { AskService } from './ask.service.js';

@Controller('ask')
export class AskController {
  constructor(private readonly service: AskService) {}

  @Post()
  async ask(@Body() dto: AskRequest) {
    return await this.service.ask(dto);
  }
}
