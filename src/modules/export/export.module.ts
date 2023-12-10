import { Module } from '@nestjs/common';

import { ExportService } from './services/export.service';

@Module({
  providers: [ExportService],
  exports: [ExportService],
})
export class ExportModule {}
