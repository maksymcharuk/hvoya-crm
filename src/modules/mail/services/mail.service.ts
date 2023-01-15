import { Injectable } from '@nestjs/common';
import {
  createTransport,
  Transporter,
  createTestAccount,
  getTestMessageUrl,
} from 'nodemailer';

import { TemplateService } from './template.service';
import { ConfigService } from '@nestjs/config';
import { Mail } from '@interfaces/mail.interface';
import { Env } from '@enums/env.enum';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly templateService: TemplateService,
  ) {}

  async createTransport(): Promise<Transporter> {
    if (
      [Env.Development, Env.Test].includes(
        this.configService.get('NODE_ENV') || Env.Development,
      )
    ) {
      const testAccount = await createTestAccount();
      return createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
    } else {
      return createTransport({
        host: this.configService.get('MAIL_HOST'),
        port: this.configService.get('MAIL_PORT'),
        auth: {
          user: this.configService.get('MAIL_USERNAME'),
          pass: this.configService.get('MAIL_PASSWORD'),
        },
        tls: {
          ciphers: 'SSLv3',
        },
      });
    }
  }

  async send(mail: Mail, to: string): Promise<void> {
    const transporter = await this.createTransport();

    const mailTemplate = mail.build();
    const content = this.templateService.compile(
      mailTemplate.templatePath,
      mailTemplate.context,
    );
    const info = await transporter.sendMail({
      from: this.configService.get('MAIL_FROM') || '"Hvoya" <crm@hvoya.com>',
      to,
      subject: mailTemplate.subject,
      html: content,
    });

    if (this.configService.get('NODE_ENV') === Env.Development) {
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', getTestMessageUrl(info));
    }
  }
}
