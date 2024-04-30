import { Request, Response } from 'express';

import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  private readonly httpsPort = this.configService.get('HTTPS_PORT');

  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    if (!req.secure) {
      res.redirect(
        HttpStatus.PERMANENT_REDIRECT,
        'https://' + req.hostname + ':' + this.httpsPort + req.originalUrl,
      );
    } else {
      next();
    }
  }
}
