import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { join } from 'path';

import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateService {
  compile(templatePath: string, context: any): string {
    const source = readFileSync(join(__dirname, '../../../../', templatePath), {
      encoding: 'utf-8',
    });
    return Handlebars.compile(source)(context);
  }
}
