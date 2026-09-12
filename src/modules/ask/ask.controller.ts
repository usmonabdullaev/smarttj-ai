import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import type { AskRequest } from '@smarttj/core/ai';

import { InternalAuthGuard } from '../../common/guards/internal-auth.guard.js';
import { AskService } from './ask.service.js';

@Controller('ask')
@UseGuards(InternalAuthGuard)
export class AskController {
  constructor(private readonly service: AskService) {}

  @Post()
  async ask(@Body() dto: AskRequest) {
    return await this.service.ask(dto);
  }
}
