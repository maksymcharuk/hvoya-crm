import { Role } from '@enums/role.enum';
import { MailTemplate } from '@interfaces/mail-template.interface';
import { Mail } from '@interfaces/mail.interface';

export class AdminInvitationMail implements Mail {
  constructor(private role: Role, private url: string) {}

  build(): MailTemplate {
    return {
      templatePath: 'resources/mail/admin-invitation.mail.html',
      subject: 'Запрошення на адміністрування сайту',
      context: {
        role: this.role,
        url: this.url,
      },
    } as MailTemplate;
  }
}
