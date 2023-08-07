import { JwtAuthGuard } from '@modules/auth/jwt-auth/jwt-auth.guard';
import { PoliciesGuard } from '@modules/casl/policies.guard';

import { Controller, UseGuards } from '@nestjs/common';

@Controller('return-request')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ReturnRequestController {

  constructor() { }
}
