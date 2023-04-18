import { PRIVAT_BANK_XMLNS_XSI } from '../../constants';
import { Action } from '../../enums/action.enum';
import { Interface } from '../../enums/interface.enum';
import { XsiType } from '../../enums/xsi-type.enum';
import { BaseXml } from '../base-xml.interface';

class UploadResponseParams {
  uploadReference: string;
}

class UploadResponseDate {
  $: {
    'xmlns:xsi': typeof PRIVAT_BANK_XMLNS_XSI,
    'xsi:type': XsiType.Gateway,
    'reference': string,
  };


  constructor(params: UploadResponseParams) {
    this.$ = {
      'xmlns:xsi': PRIVAT_BANK_XMLNS_XSI,
      'xsi:type': XsiType.Gateway,
      'reference': params.uploadReference,
    };
  }
}

export class UploadResponse extends BaseXml<UploadResponseDate> {
  constructor(params: UploadResponseParams) {
    super(Interface.Debt, Action.Upload, new UploadResponseDate(params));
  }
}
