import { BadRequestException, Injectable } from '@nestjs/common';

import { ImportDataType } from '@enums/import-data-type.enum';

import { PromProductsXlsRaw } from '../../interfaces/prom-products-xls-raw.interface';
import { PromProductsXml } from '../../interfaces/prom-products-xml.interface';
import { ProductsCreationService } from '../products-creation/products-creation.service';
import { PromProductsNormalizationServiceXls } from './prom-products-normalization-xls/prom-products-normalization-xls.service';
import { PromProductsNormalizationServiceXml } from './prom-products-normalization-xml/prom-products-normalization-xml.service';

@Injectable()
export class PromProductsTransferService {
  constructor(
    private readonly promProductsNormalizationServiceXml: PromProductsNormalizationServiceXml,
    private readonly promProductsNormalizationServiceXls: PromProductsNormalizationServiceXls,
    private readonly productsCreationService: ProductsCreationService,
  ) {}
  async import(
    data: PromProductsXml | PromProductsXlsRaw,
    dataFormat: ImportDataType,
  ) {
    let normalizedData;
    switch (dataFormat) {
      case ImportDataType.XML:
        normalizedData = this.promProductsNormalizationServiceXml.normalize(
          data as PromProductsXml,
        );
        break;
      case ImportDataType.XLS:
        normalizedData = this.promProductsNormalizationServiceXls.normalize(
          data as PromProductsXlsRaw,
        );
        break;
      default:
        throw new BadRequestException(
          'Данний формат данних не підтримується. Лише XML та XLS',
        );
    }
    return this.productsCreationService.upsertProducts(normalizedData);
  }
}
