import { HttpException, Injectable } from '@nestjs/common';
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
    try {
      if (
        [Env.Development, Env.Test].includes(
          this.configService.get('NODE_ENV') || Env.Development,
        )
      ) {
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

  async send(mail: Mail, to: string): Promise<void> {
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

      if (
        [Env.Development, Env.Test].includes(
          this.configService.get('NODE_ENV') || Env.Development,
        )
      ) {
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', getTestMessageUrl(info));
      }
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
