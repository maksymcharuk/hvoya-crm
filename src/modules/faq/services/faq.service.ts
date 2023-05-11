import { Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateFaqDto } from '@dtos/create-faq.dto';
import { UpdateFaqBatchDto } from '@dtos/update-faq-batch.dto';
import { UpdateFaqDto } from '@dtos/update-faq.dto';
import { FaqEntity } from '@entities/faq.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { hasDuplicates } from '@utils/has-duplicates.util';
import { mergeArraysByProperty } from '@utils/merge-arrays-by-property.util';

import { CaslAbilityFactory } from '../../../modules/casl/casl-ability/casl-ability.factory';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(FaqEntity)
    private readonly faqRepository: Repository<FaqEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async findById(id: string, userId: string): Promise<FaqEntity> {
    const faq = await this.faqRepository.findOneBy({ id });
    const user = await this.userRepository.findOneByOrFail({
      id: userId,
    });
    const ability = this.caslAbilityFactory.createForUser(user);

    if (!faq || ability.cannot(Action.Read, faq)) {
      throw new NotFoundException(
        'Запис запитання/відповідь з даним ID не знайдено',
      );
    }

    return faq;
  }

  async getAll(userId: string): Promise<FaqEntity[]> {
    const faqList = await this.faqRepository.find({
      order: { order: 'ASC' },
    });
    const user = await this.userRepository.findOneByOrFail({
      id: userId,
    });
    const ability = this.caslAbilityFactory.createForUser(user);

    return faqList.filter((faq) => ability.can(Action.Read, faq));
  }

  async create(faq: CreateFaqDto): Promise<FaqEntity> {
    await this.validateFaq(faq);
    return this.faqRepository.save(faq);
  }

  async update(
    id: string,
    faq: UpdateFaqDto,
    userId: string,
  ): Promise<FaqEntity> {
    const updatedFaq = { id, ...faq };
    await this.validateFaqBatch([updatedFaq]);
    await this.faqRepository.save(updatedFaq);
    return this.findById(id, userId);
  }

  async updateBatch(faqList: UpdateFaqBatchDto[]): Promise<FaqEntity[]> {
    await this.validateFaqBatch(faqList);
    return this.faqRepository.save(faqList);
  }

  async delete(id: string, userId: string): Promise<FaqEntity> {
    const faq = await this.findById(id, userId);

    return this.faqRepository.remove(faq);
  }

  private async validateFaq(faq: CreateFaqDto | UpdateFaqDto): Promise<void> {
    const allFaq = await this.faqRepository.find();
    if (faq.order && hasDuplicates([...allFaq, faq], 'order')) {
      throw new BadRequestException(
        'Порядковий номер запитання/відповідь повинен бути унікальним',
      );
    }
  }

  private async validateFaqBatch(faqList: UpdateFaqBatchDto[]): Promise<void> {
    const allFaq = await this.faqRepository.find();
    const mergedFaq = mergeArraysByProperty(allFaq, faqList, 'id');
    if (
      faqList.some((faq) => !!faq.order) &&
      hasDuplicates(mergedFaq, 'order')
    ) {
      throw new BadRequestException(
        'Порядковий номер запитання/відповідь повинен бути унікальним',
      );
    }
  }
}
