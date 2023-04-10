import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ProductsTransferController } from './products-transfer.controller';
import { ProductsCreationService } from './services/products-creation/products-creation.service';
import { PromProductsNormalizationService } from './services/prom-products-transfer/prom-products-normalization/prom-products-normalization.service';
import { PromProductsTransferService } from './services/prom-products-transfer/prom-products-transfer.service';

@Module({
  imports: [HttpModule],
  controllers: [ProductsTransferController],
  providers: [
    PromProductsTransferService,
    PromProductsNormalizationService,
    ProductsCreationService,
  ],
})
export class ProductsTransferModule {}
