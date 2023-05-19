import { Response } from 'express';
import { Builder } from 'xml2js';

import { Body, Controller, Post, Res } from '@nestjs/common';

import { Action } from './enums/action.enum';
import { CancelRequest } from './interfaces/requests/cancel.request';
import { CheckRequest } from './interfaces/requests/check.request';
import { PayRequest } from './interfaces/requests/pay.request';
import { PresearchRequest } from './interfaces/requests/presearch.request';
import { SearchRequest } from './interfaces/requests/search.request';
import { PaymentApiService } from './services/payment-api.service';
import { PrivatJSONRequest, PrivatXMLRequest } from './types/request.type';

@Controller()
export class PrivatBankController {
  constructor(private readonly paymentApiService: PaymentApiService) { }

  @Post()
  async main(
    @Body() body: PrivatXMLRequest | PrivatJSONRequest,
    @Res() res: Response,
  ): Promise<void> {
    let xmlData;

    if ('transfer' in body) {
      switch (body.transfer.$.action) {
        case Action.Presearch:
          const xmlPreserch = body as PresearchRequest;
          xmlData = await this.paymentApiService.presearch(
            xmlPreserch.transfer.data[0].unit[0].$.value,
          );
          break;
        case Action.Search:
          const xmlSearch = body as SearchRequest;
          xmlData = await this.paymentApiService.search(
            xmlSearch.transfer.data[0].$.presearchId
              ? xmlSearch.transfer.data[0].$.presearchId
              : xmlSearch.transfer.data[0].unit[0].$.value,
          );
          break;
        case Action.Check:
          const xmlCheck = body as CheckRequest;
          xmlData = await this.paymentApiService.check(
            xmlCheck.transfer.data[0].$.id,
            xmlCheck.transfer.data[0].payerinfo[0].$.billIdentifier,
          );
          break;
        case Action.Pay:
          const xmlPay = body as PayRequest;
          xmlData = await this.paymentApiService.pay(
            xmlPay.transfer.data[0].payerinfo[0].$.billIdentifier,
            xmlPay.transfer.data[0].$.id,
            xmlPay.transfer.data[0].companyinfo
              ? xmlPay.transfer.data[0].companyinfo[0].checkreference[0]
              : null,
            xmlPay.transfer.data[0].totalsum[0],
          );
          break;
        case Action.Cancel:
          const xmlCancel = body as CancelRequest;
          xmlData = await this.paymentApiService.cancel(
            xmlCancel.transfer.data[0].payerinfo[0].$.billIdentifier,
            xmlCancel.transfer.data[0].$.id,
            xmlCancel.transfer.data[0].totalsum[0],
          );
          break;
        case Action.Upload:
          xmlData = await this.paymentApiService.upload();
          break;
      }

      const buildXml = new Builder({
        xmldec: {
          version: '1.0',
          encoding: 'UTF-8',
          standalone: undefined
        }
      }).buildObject(xmlData);

      res.set({ 'content-type': 'application/xml; charset=utf-8' });
      res.send(buildXml);
    } else {
      const calcBody = body as PrivatJSONRequest;
      res.send(this.paymentApiService.calc(calcBody.payments));
    }
  }
}
