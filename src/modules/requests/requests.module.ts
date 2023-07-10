import { Module } from '@nestjs/common';

import { ReturnRequestsModule } from './return-requests/return-requests.module';

@Module({
  imports: [
    ReturnRequestsModule,
  ],
})
export class RequestsModule { }