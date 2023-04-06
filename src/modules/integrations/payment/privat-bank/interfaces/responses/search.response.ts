import { PRIVAT_BANK_XMLNS_XSI } from '../../constants';
import { Action } from '../../enums/action.enum';
import { Interface } from '../../enums/interface.enum';
import { XsiType } from '../../enums/xsi-type.enum';
import { BaseXml } from '../base-xml.interface';

class SearchResponseParams {
  billIdentifier: string;
  serviceCode: string;
  fio: string;
  phone: string;
}

class SearchResponseData {
  $ = {
    'xmlns:xsi': PRIVAT_BANK_XMLNS_XSI,
    'xsi:type': XsiType.DebtPack,
  };
  payerInfo: [
    {
      $: {
        billIdentifier: string,
      },
    },
  ];
  serviceGroup: [
    {
      debtService: [
        {
          $: {
            serviceCode: string,
          },
          payerInfo: [
            {
              $: {
                billIdentifier: string,
              },
              fio: string,
              phone: string,
            }
          ],
        },
      ],
    },
  ];

  constructor(params: SearchResponseParams) {
    this.payerInfo = [
      {
        $: {
          billIdentifier: params.billIdentifier,
        },
      },
    ];

    this.serviceGroup = [
      {
        debtService: [
          {
            $: {
              serviceCode: params.serviceCode,
            },
            payerInfo: [
              {
                $: {
                  billIdentifier: params.billIdentifier,
                },
                fio: params.fio,
                phone: params.phone,
              }
            ],
          },
        ],
      },
    ];
  }
}

export class SearchResponse extends BaseXml<SearchResponseData> {
  constructor(params: SearchResponseParams) {
    super(Interface.Debt, Action.Search, new SearchResponseData(params));
  }
}
