import {
  Transporter,
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer';

import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Env } from '@enums/env.enum';
import { Mail } from '@interfaces/mail.interface';

import { TemplateService } from './template.service';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly templateService: TemplateService,
  ) {}

  async send(mail: Mail, to: string): Promise<void> {
    // Don't send emails in test environment
    if (this.configService.get('NODE_ENV') === Env.Test) {
      return Promise.resolve();
    }

    try {
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
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  private async createTransport(): Promise<Transporter> {
    try {
      if (this.configService.get('NODE_ENV') === Env.Development) {
        const testAccount = await createTestAccount();
        return createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
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
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
