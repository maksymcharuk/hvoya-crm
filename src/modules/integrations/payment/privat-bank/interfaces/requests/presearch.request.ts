import { PRIVAT_BANK_XMLNS_XSI } from '../../constants';
import { Action } from '../../enums/action.enum';
import { Interface } from '../../enums/interface.enum';
import { XsiType } from '../../enums/xsi-type.enum';
import { BaseXml } from '../base-xml.interface';

class PresearchRequestParams {
  fio: string[];
  ls: string[];
}

class PresearchRequestData {
  $ = {
    'xmlns:xsi': typeof PRIVAT_BANK_XMLNS_XSI,
    'xsi:type': XsiType.Payer,
  };
  headers = [
    {
      header: [
        {
          $: {
            name: 'fio',
          },
        },
        {
          $: {
            name: 'ls',
          },
        },
      ],
    },
  ];
  columns: [
    {
      column: [
        {
          element: string[];
        },
        {
          element: string[];
        },
      ];
    },
  ];

  constructor(params: PresearchRequestParams) {
    this.columns = [
      {
        column: [
          {
            element: params.fio,
          },
          {
            element: params.ls,
          },
        ],
      },
    ];
  }
}

export class PresearchRequest extends BaseXml<PresearchRequestData> {
  constructor(params: PresearchRequestParams) {
    super(Interface.Debt, Action.Presearch, new PresearchRequestData(params));
  }
}
