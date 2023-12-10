import { NextFunction, Request, Response } from 'express';

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode, statusMessage } = response;
      const contentLength = response.get('content-length');

      if (statusCode >= 400) {
        this.logger.error({
          message: `${method} ${url} ${statusCode} (${statusMessage}) ${contentLength} - ${userAgent} ${ip}`,
        });
      } else {
        this.logger.log({
          message: `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        });
      }
    });

    next();
  }
}
