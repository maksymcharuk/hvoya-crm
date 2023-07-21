import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CaslModule } from '@modules/casl/casl.module';
import { OneCClientModule } from '@modules/integrations/one-c/one-c-client/one-c-client.module';

import { ProductsTransferController } from './products-transfer.controller';
import { ProductsCreationService } from './services/products-creation/products-creation.service';
import { PromProductsNormalizationServiceXls } from './services/prom-products-transfer/prom-products-normalization-xls/prom-products-normalization-xls.service';
import { PromProductsNormalizationServiceXml } from './services/prom-products-transfer/prom-products-normalization-xml/prom-products-normalization-xml.service';
import { PromProductsTransferService } from './services/prom-products-transfer/prom-products-transfer.service';

@Module({
  imports: [HttpModule, CaslModule, OneCClientModule],
  controllers: [ProductsTransferController],
  providers: [
    PromProductsTransferService,
    PromProductsNormalizationServiceXml,
    PromProductsNormalizationServiceXls,
    ProductsCreationService,
  ],
})
export class ProductsTransferModule {}
