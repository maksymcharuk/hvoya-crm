import { PRIVAT_BANK_XMLNS_XSI } from '../../constants';
import { Action } from '../../enums/action.enum';
import { Interface } from '../../enums/interface.enum';
import { XsiType } from '../../enums/xsi-type.enum';
import { BaseXml } from '../base-xml.interface';

class PayResponseParams {
  payReference: string;
}

class PayResponseDate {
  $: {
    'xmlns:xsi': typeof PRIVAT_BANK_XMLNS_XSI;
    'xsi:type': XsiType.Gateway;
    reference: string;
  };

  constructor(params: PayResponseParams) {
    this.$ = {
      'xmlns:xsi': PRIVAT_BANK_XMLNS_XSI,
      'xsi:type': XsiType.Gateway,
      reference: params.payReference,
    };
  }
}

export class PayResponse extends BaseXml<PayResponseDate> {
  constructor(params: PayResponseParams) {
    super(Interface.Debt, Action.Pay, new PayResponseDate(params));
  }
}
