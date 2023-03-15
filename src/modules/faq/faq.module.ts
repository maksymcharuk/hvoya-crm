import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FaqEntity } from '@entities/faq.entity';

import { CaslModule } from '../casl/casl.module';
import { FaqController } from './faq.controller';
import { FaqService } from './services/faq.service';

@Module({
  imports: [TypeOrmModule.forFeature([FaqEntity]), CaslModule],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}
