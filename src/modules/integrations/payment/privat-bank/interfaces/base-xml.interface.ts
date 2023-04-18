import { PRIVAT_BANK_XMLNS } from '../constants';
import { Action } from '../enums/action.enum';
import { Interface } from '../enums/interface.enum';

export class BaseXml<T> {
  transfer: {
    $: {
      xmlns: typeof PRIVAT_BANK_XMLNS;
      interface: Interface;
      action: Action;
    };
    data: T[];
  };

  constructor(_interface: Interface, action: Action, data: T) {
    this.transfer = {
      $: {
        xmlns: PRIVAT_BANK_XMLNS,
        interface: _interface,
        action,
      },
      data: [data],
    };
  }
}
