import { MailTemplate } from './mail-template.interface';

export interface Mail {
  build(): MailTemplate;
}
