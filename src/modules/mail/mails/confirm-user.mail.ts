import { UserEntity } from '@entities/user.entity';
import { MailTemplate } from '@interfaces/mail-template.interface';
import { Mail } from '@interfaces/mail.interface';

export class ConfirmUserMail implements Mail {
  constructor(private user: UserEntity | null, private url: string) { }

  build(): MailTemplate {
    return {
      templatePath: 'resources/mail/confirm-user.mail.html',
      subject: `Confirm user ${this.user?.email}`,
      context: {
        user: this.user,
        url: this.url,
      },
    } as MailTemplate;
  }
}
