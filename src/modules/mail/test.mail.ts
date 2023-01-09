import { UserEntity } from '@entities/user.entity';
import { MailTemplate } from '@interfaces/mail-template.interface';
import { Mail } from '@interfaces/mail.interface';

export class TestMail implements Mail {
  constructor(private user: UserEntity | null) {}

  build(): MailTemplate {
    return {
      templatePath: 'resources/mail/test.mail.html',
      subject: 'Test email',
      context: {
        user: this.user,
      },
    } as MailTemplate;
  }
}
