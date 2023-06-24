import { Role } from '@shared/enums/role.enum';

export interface SendAdminInvitationDTO {
  email: string;
  role: Role;
}
