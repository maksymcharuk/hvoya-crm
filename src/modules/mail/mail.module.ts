import { Module } from '@nestjs/common';

import { MailService } from './services/mail.service';
import { TemplateService } from './services/template.service';

@Module({
  providers: [TemplateService, MailService],
  exports: [MailService],
})
export class MailModule {}
