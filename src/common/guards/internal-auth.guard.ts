import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

export interface InternalJwtPayload {
  iss: string; // Имя сервиса-отправителя (например, 'smarttj-backend')
  aud: string; // Имя сервиса-получателя (текущий сервис)
  exp: number;
  iat: number;
}

@Injectable()
export class InternalAuthGuard implements CanActivate {
  private readonly secret: string;
  private readonly currentServiceName: string;

  constructor(private readonly configService: ConfigService) {
    this.secret = this.configService.getOrThrow<string>(
      'INTERNAL_SERVICE_SECRET',
    );
    this.currentServiceName =
      this.configService.getOrThrow<string>('SERVICE_NAME');
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-internal-token'];

    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Отсутствует заголовок x-internal-token');
    }

    try {
      // 1. Проверяем подпись, алгоритм и срок жизни (exp)
      const decoded = jwt.verify(token, this.secret, {
        algorithms: ['HS256'],
      }) as InternalJwtPayload;

      // 2. Проверяем, что запрос предназначался именно ЭТОМУ сервису
      if (decoded.aud !== this.currentServiceName) {
        throw new ForbiddenException(
          `Неверный получатель: токен выписан для ${decoded.aud}, а не для ${this.currentServiceName}`,
        );
      }

      // Сохраняем полезные данные в request
      request.internalCaller = decoded.iss;
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      throw new UnauthorizedException(
        'Невалидный или просроченный internal токен',
      );
    }
  }
}
