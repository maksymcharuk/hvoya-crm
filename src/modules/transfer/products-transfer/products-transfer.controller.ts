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
} from '@nestjs/common';

import { ImportProductsDto } from './dtos/import-products.dto';
import { ProductsImportSource } from './enums/product-import-source.enum';
import { PromProductsTransferService } from './services/prom-products-transfer/prom-products-transfer.service';

@Controller('products-transfer')
export class ProductsTransferController {
  constructor(
    private readonly httpService: HttpService,
    private readonly promProductsTransferService: PromProductsTransferService,
  ) {}

  @Post('import')
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

    switch (source) {
      case ProductsImportSource.Prom:
        return this.promProductsTransferService.import(result);
      default:
        throw new HttpException('Unknown source', HttpStatus.BAD_REQUEST);
    }
  }
}
