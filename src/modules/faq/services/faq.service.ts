import { Repository } from 'typeorm';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateFaqDto } from '@dtos/create-faq.dto';
import { UpdateFaqDto } from '@dtos/update-faq.dto';
import { FaqEntity } from '@entities/faq.entity';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(FaqEntity)
    private faqRepository: Repository<FaqEntity>,
  ) {}

  async findById(id: number): Promise<FaqEntity> {
    const faq = await this.faqRepository.findOneBy({ id });

    if (!faq) {
      throw new HttpException(
        'Запис питання/відповідь з даним ID не знайдено',
        404,
      );
    }

    return faq;
  }

  getAll(): Promise<FaqEntity[]> {
    return this.faqRepository.find();
  }

  create(faq: CreateFaqDto): Promise<FaqEntity> {
    return this.faqRepository.save(faq);
  }

  update(id: number, faq: UpdateFaqDto): Promise<FaqEntity> {
    return this.faqRepository.save({ id, ...faq });
  }

  async delete(id: number): Promise<FaqEntity> {
    const faq = await this.findById(id);

    return this.faqRepository.remove(faq);
  }
}
