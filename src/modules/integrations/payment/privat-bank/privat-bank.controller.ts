import { Response } from 'express';
import { Builder } from 'xml2js';

import { Body, Controller, Post, Res } from '@nestjs/common';

import { Action } from './enums/action.enum';
import { PaymentApiService } from './services/payment-api.service';

@Controller()
export class PrivatBankController {
  constructor(private readonly paymentApiService: PaymentApiService) {}

  @Post()
  async main(@Body() xml: any, @Res() res: Response): Promise<void> {
    let xmlData;

    switch (xml.transfer.$.action) {
      case Action.Presearch:
        xmlData = await this.paymentApiService.presearch();
    }

    const buildXml = new Builder().buildObject(xmlData);

    res.set('Content-Type', 'text/xml');
    res.send(buildXml);
  }
}
