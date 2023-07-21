import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductPackageSizeDto } from '@dtos/create-product-package-size.dto copy';
import { ProductPackageSizeEntity } from '@entities/product-package-size.entity';

@Injectable()
export class ProductPackageSizesService {
  constructor(
    @InjectRepository(ProductPackageSizeEntity)
    private productPackageSizeRepository: Repository<ProductPackageSizeEntity>,
  ) {}

  getAllPackageSizes(): Promise<ProductPackageSizeEntity[]> {
    return this.productPackageSizeRepository.find();
  }

  getPackageSizeById(id: string): Promise<ProductPackageSizeEntity> {
    return this.productPackageSizeRepository.findOneOrFail({ where: { id } });
  }

  createPackageSize(
    createSizeDto: CreateProductPackageSizeDto,
  ): Promise<ProductPackageSizeEntity> {
    return this.productPackageSizeRepository.save(createSizeDto);
  }

  updatePackageSize(
    id: string,
    updateSizeDto: Partial<CreateProductPackageSizeDto>,
  ): Promise<ProductPackageSizeEntity> {
    return this.productPackageSizeRepository.save({ id, ...updateSizeDto });
  }
}
