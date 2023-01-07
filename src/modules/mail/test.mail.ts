import { MailTemplate } from '@interfaces/mail-template.interface';
import { Mail } from '@interfaces/mail.interface';

export class TestMail implements Mail {
  build(): MailTemplate {
    return {
      templatePath: 'resources/mail/test.mail.html',
      subject: 'Test email',
      context: {
        title: 'Test',
      },
    } as MailTemplate;
  }
}
