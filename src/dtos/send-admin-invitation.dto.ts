import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

import { Role } from '@enums/role.enum';

export class SendAdminInvitationDto {
  @IsNotEmpty({
    message: 'Необхідно вказати роль (адміністратор чи головний адміністратор)',
  })
  @IsEnum(Role, {
    message: 'Неправильна роль. Може бути адмін або супер-адмін',
  })
  role: Role;

  @IsNotEmpty({ message: 'Необхідно вказати електронну пошту' })
  @IsEmail(undefined, { message: 'Неправильний формат електронної пошти' })
  email: string;
}
