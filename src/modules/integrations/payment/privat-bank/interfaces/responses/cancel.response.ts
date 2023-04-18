import { PRIVAT_BANK_XMLNS_XSI } from '../../constants';
import { Action } from '../../enums/action.enum';
import { Interface } from '../../enums/interface.enum';
import { XsiType } from '../../enums/xsi-type.enum';
import { BaseXml } from '../base-xml.interface';

class CancelResponseParams {
  cancelReference: number;
}

class CancelResponseDate {
  $: {
    'xmlns:xsi': typeof PRIVAT_BANK_XMLNS_XSI,
    'xsi:type': XsiType.Gateway,
    'reference': number,
  };


  constructor(params: CancelResponseParams) {
    this.$ = {
      'xmlns:xsi': PRIVAT_BANK_XMLNS_XSI,
      'xsi:type': XsiType.Gateway,
      'reference': params.cancelReference,
    };
  }
}

export class CancelResponse extends BaseXml<CancelResponseDate> {
  constructor(params: CancelResponseParams) {
    super(Interface.Debt, Action.Cancel, new CancelResponseDate(params));
  }
}
