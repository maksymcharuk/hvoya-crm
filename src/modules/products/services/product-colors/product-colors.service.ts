import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductColorDto } from '@dtos/create-product-color.dto';
import { ProductColorEntity } from '@entities/product-color.entity';

@Injectable()
export class ProductColorsService {
  constructor(
    @InjectRepository(ProductColorEntity)
    private productColorRepository: Repository<ProductColorEntity>,
  ) {}

  getAllColors(): Promise<ProductColorEntity[]> {
    return this.productColorRepository.find();
  }

  getColorById(id: string): Promise<ProductColorEntity> {
    return this.productColorRepository.findOneOrFail({ where: { id } });
  }

  createColor(
    createColorDto: CreateProductColorDto,
  ): Promise<ProductColorEntity> {
    return this.productColorRepository.save(createColorDto);
  }

  updateColor(
    id: string,
    updateColorDto: Partial<CreateProductColorDto>,
  ): Promise<ProductColorEntity> {
    return this.productColorRepository.save({ id, ...updateColorDto });
  }
}
