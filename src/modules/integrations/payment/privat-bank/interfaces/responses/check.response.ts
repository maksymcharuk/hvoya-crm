import { PRIVAT_BANK_XMLNS_XSI } from '../../constants';
import { Action } from '../../enums/action.enum';
import { Interface } from '../../enums/interface.enum';
import { XsiType } from '../../enums/xsi-type.enum';
import { BaseXml } from '../base-xml.interface';

class CheckResponseParams {
  checkReference: number;
}

class CheckResponseDate {
  $: {
    'xmlns:xsi': typeof PRIVAT_BANK_XMLNS_XSI,
    'xsi:type': XsiType.Gateway,
    'reference': number,
  };


  constructor(params: CheckResponseParams) {
    this.$ = {
      'xmlns:xsi': PRIVAT_BANK_XMLNS_XSI,
      'xsi:type': XsiType.Gateway,
      'reference': params.checkReference,
    };
  }
}

export class CheckResponse extends BaseXml<CheckResponseDate> {
  constructor(params: CheckResponseParams) {
    super(Interface.Debt, Action.Check, new CheckResponseDate(params));
  }
}
