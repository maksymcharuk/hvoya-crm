import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductSizeDto } from '@dtos/create-product-size.dto';
import { ProductSizeEntity } from '@entities/product-size.entity';

@Injectable()
export class ProductSizesService {
  constructor(
    @InjectRepository(ProductSizeEntity)
    private productSizeRepository: Repository<ProductSizeEntity>,
  ) {}

  getAllSizes(): Promise<ProductSizeEntity[]> {
    return this.productSizeRepository.find();
  }

  getSizeById(id: number): Promise<ProductSizeEntity> {
    return this.productSizeRepository.findOneOrFail({ where: { id } });
  }

  createSize(createSizeDto: CreateProductSizeDto): Promise<ProductSizeEntity> {
    return this.productSizeRepository.save(createSizeDto);
  }

  updateSize(
    id: number,
    updateSizeDto: Partial<CreateProductSizeDto>,
  ): Promise<ProductSizeEntity> {
    return this.productSizeRepository.save({ id, ...updateSizeDto });
  }
}
