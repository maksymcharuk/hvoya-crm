import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { join } from 'path';

import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateService {
  constructor() {
    Handlebars.registerHelper('layout', function (options) {
      const layoutTemplate = Handlebars.compile(
        readFileSync(
          join(
            __dirname,
            '../../../../resources/mail/layout/main-layout.mail.html',
          ),
          'utf8',
        ),
      );
      return layoutTemplate({ ...this, body: options.fn(this) });
    });
  }

  compile(templatePath: string, context: any): string {
    const source = readFileSync(join(__dirname, '../../../../', templatePath), {
      encoding: 'utf-8',
    });
    return Handlebars.compile(source)(context);
  }
}
