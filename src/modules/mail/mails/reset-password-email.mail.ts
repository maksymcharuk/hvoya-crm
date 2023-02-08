import { UserEntity } from '@entities/user.entity';
import { MailTemplate } from '@interfaces/mail-template.interface';
import { Mail } from '@interfaces/mail.interface';

export class ResetPasswordEmailMail implements Mail {
  constructor(private user: UserEntity | null, private url: string) {}

  build(): MailTemplate {
    return {
      templatePath: 'resources/mail/reset-password-email.mail.html',
      subject: 'Reset password email mail',
      context: {
        user: this.user,
        url: this.url,
      },
    } as MailTemplate;
  }
}
