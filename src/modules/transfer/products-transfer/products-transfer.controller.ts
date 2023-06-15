import { firstValueFrom } from 'rxjs';
import * as xml2js from 'xml2js';

import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { Action } from '@enums/action.enum';

import { AppAbility } from '../../../modules/casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '../../../modules/casl/check-policies.decorator';
import { PoliciesGuard } from '../../../modules/casl/policies.guard';
import { OneCSyncService } from '../../integrations/one-c/services/one-c-sync/one-c-sync.service';
import { ImportProductsDto } from './dtos/import-products.dto';
import { ProductsImportSource } from './enums/product-import-source.enum';
import { PromProductsTransferService } from './services/prom-products-transfer/prom-products-transfer.service';

@Controller('products-transfer')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ProductsTransferController {
  constructor(
    private readonly httpService: HttpService,
    private readonly promProductsTransferService: PromProductsTransferService,
    private readonly oneCSyncService: OneCSyncService,
  ) {}

  @Post('import')
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can(Action.Create, ProductBaseEntity) &&
      ability.can(Action.Update, ProductBaseEntity) &&
      ability.can(Action.Create, ProductVariantEntity) &&
      ability.can(Action.Update, ProductVariantEntity),
  )
  @UseInterceptors(FileInterceptor('file'))
  async import(
    @Body() { source, link }: ImportProductsDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '(xml)$' })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (!link && !file) {
      throw new HttpException(
        'Необхідно надати файл або посилання',
        HttpStatus.BAD_REQUEST,
      );
    }

    let xml: string = '';

    if (link) {
      try {
        xml = (await firstValueFrom(this.httpService.get(link))).data;
      } catch (error) {
        throw new HttpException(
          'Не вдалося отримати файл за посиланням',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (file) {
      xml = file.buffer.toString();
    }

    const parser = new xml2js.Parser();
    let result: any;

    try {
      result = await parser.parseStringPromise(xml);
    } catch (error) {
      throw new HttpException(
        'Не вдалося опрацювати XML дані',
        HttpStatus.BAD_REQUEST,
      );
    }

    let response;
    switch (source) {
      case ProductsImportSource.Prom:
        response = await this.promProductsTransferService.import(result);
        await this.oneCSyncService.syncProducts();
        return response;
      default:
        throw new HttpException(
          'Джерело імпорту має бути коректним "Prom" і тд.',
          HttpStatus.BAD_REQUEST,
        );
    }
  }
}
