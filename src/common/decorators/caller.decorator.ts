import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CallerService = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.internalCaller;
  },
);
