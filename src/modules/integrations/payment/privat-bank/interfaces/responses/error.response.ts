import { PRIVAT_BANK_XMLNS_XSI } from '../../constants';
import { Action } from '../../enums/action.enum';
import { Interface } from '../../enums/interface.enum';
import { XsiType } from '../../enums/xsi-type.enum';
import { BaseXml } from '../base-xml.interface';

class ErrorResponseParams {
  message: string;
  code: number;
}

class ErrorResponseData {
  $: {
    'xmlns:xsi': typeof PRIVAT_BANK_XMLNS_XSI,
    'xsi:type': XsiType.ErrorInfo,
    'code': number,
  };
  message: string;


  constructor(params: ErrorResponseParams) {
    this.$ = {
      'xmlns:xsi': PRIVAT_BANK_XMLNS_XSI,
      'xsi:type': XsiType.ErrorInfo,
      'code': params.code,
    };
    this.message = params.message;
  }
}

export class ErrorResponse extends BaseXml<ErrorResponseData> {
  constructor(params: ErrorResponseParams) {
    super(Interface.Debt, Action.Presearch, new ErrorResponseData(params));
  }
}
