import { PRIVAT_BANK_XMLNS } from '../constants';
import { Action } from '../enums/action.enum';
import { Interface } from '../enums/interface.enum';

export class BaseXml<T> {
  Transfer: {
    $: {
      action: Action;
      interface: Interface;
      xmlns: typeof PRIVAT_BANK_XMLNS;
    };
    Data: T[];
  };

  constructor(_interface: Interface, action: Action, data: T) {
    this.Transfer = {
      $: {
        action,
        interface: _interface,
        xmlns: PRIVAT_BANK_XMLNS,
      },
      Data: [data],
    };
  }
}
