import { PRIVAT_BANK_XMLNS_XSI } from '../../constants';
import { Action } from '../../enums/action.enum';
import { Interface } from '../../enums/interface.enum';
import { XsiType } from '../../enums/xsi-type.enum';
import { BaseXml } from '../base-xml.interface';

class PresearchResponseParams {
  fio: string[];
  ls: string[];
}

class PresearchResponseData {
  $ = {
    'xmlns:xsi': PRIVAT_BANK_XMLNS_XSI,
    'xsi:type': XsiType.Payer,
  };
  Headers = [
    {
      Header: [
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
  Columns: [
    {
      Column: [
        {
          Element: string[];
        },
        {
          Element: string[];
        },
      ];
    },
  ];

  constructor(params: PresearchResponseParams) {
    this.Columns = [
      {
        Column: [
          {
            Element: params.fio,
          },
          {
            Element: params.ls,
          },
        ],
      },
    ];
  }
}

export class PresearchResponse extends BaseXml<PresearchResponseData> {
  constructor(params: PresearchResponseParams) {
    super(Interface.Debt, Action.Presearch, new PresearchResponseData(params));
  }
}
