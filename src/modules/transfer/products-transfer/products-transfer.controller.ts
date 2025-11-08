import { firstValueFrom } from 'rxjs';
import * as xlsx from 'xlsx';
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

import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { Action } from '@enums/action.enum';
import { ImportDataType } from '@enums/import-data-type.enum';

import { JwtAuthGuard } from '@modules/auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '@modules/casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '@modules/casl/check-policies.decorator';
import { PoliciesGuard } from '@modules/casl/policies.guard';

// import { OneCSyncService } from '@modules/integrations/one-c/one-c-client/services/one-c-sync/one-c-sync.service';
import { ImportProductsDto } from './dtos/import-products.dto';
import { ProductsImportSource } from './enums/product-import-source.enum';
import { PromProductsTransferService } from './services/prom-products-transfer/prom-products-transfer.service';

@Controller('products-transfer')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class ProductsTransferController {
  constructor(
    private readonly httpService: HttpService,
    private readonly promProductsTransferService: PromProductsTransferService,
  ) // private readonly oneCSyncService: OneCSyncService,
  {}

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
        validators: [
          new FileTypeValidator({
            fileType:
              '(xml|xls|xlsx|application/vnd.ms-excel|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)$',
          }),
        ],
        fileIsRequired: false,
        exceptionFactory: () => {
          throw new HttpException(
            'Не вдалося опрацювати файл. Формат файлу має бути коректним "xml", "xls" або "xlsx"',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        },
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

    let buffer: Buffer;

    if (link) {
      try {
        buffer = (
          await firstValueFrom(
            this.httpService.get(link, {
              responseType: 'arraybuffer', // Set the responseType to 'arraybuffer' to get the response as a buffer
            }),
          )
        ).data;
      } catch (error) {
        throw new HttpException(
          'Не вдалося отримати файл за посиланням',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (file) {
      buffer = file.buffer;
    }

    let result: any;
    let type: ImportDataType;

    try {
      const workbook = xlsx.read(buffer!, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0]!;
      const worksheet = workbook.Sheets[firstSheetName]!;
      result = xlsx.utils.sheet_to_json(worksheet, { raw: true });
      type = ImportDataType.XLS;
    } catch (error) {}

    try {
      const parser = new xml2js.Parser();
      result = await parser.parseStringPromise(buffer!.toString());
      type = ImportDataType.XML;
    } catch (error) {}

    if (!result) {
      throw new HttpException(
        'Не вдалося опрацювати файл',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let response;
    switch (source) {
      case ProductsImportSource.Prom:
        response = await this.promProductsTransferService.import(result, type!);
        // await this.oneCSyncService.syncProducts();
        return response;
      default:
        throw new HttpException(
          'Джерело імпорту має бути коректним "Prom" і тд.',
          HttpStatus.BAD_REQUEST,
        );
    }
  }
}
