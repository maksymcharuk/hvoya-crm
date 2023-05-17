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
  PayerInfo: [
    {
      $: {
        billIdentifier: string,
        ls: string,
      },
      Fio: string,
    },
  ];
  ServiceGroup: [
    {
      DebtService: [
        {
          $: {
            ServiceCode: string,
          },
          CompanyInfo: [
            {
              CompanyCode: string,
            }
          ]
          DebtInfo: [
            {
              $: {
                amountToPay: string,
              }
              _: string,
            }
          ]
          PayerInfo: [
            {
              $: {
                billIdentifier: string,
                ls: string,
              },
              Fio: string,
            }
          ],
        },
      ],
    },
  ];

  constructor(params: SearchResponseParams) {
    this.PayerInfo = [
      {
        $: {
          billIdentifier: params.billIdentifier,
          ls: params.billIdentifier,
        },
        Fio: params.fio,
      },
    ];

    this.ServiceGroup = [
      {
        DebtService: [
          {
            $: {
              ServiceCode: params.serviceCode,
            },
            CompanyInfo: [
              {
                CompanyCode: '2611220009',
              }
            ],
            DebtInfo: [
              {
                $: {
                  amountToPay: '0.00',
                },
                _: ' '
              }
            ],
            PayerInfo: [
              {
                $: {
                  billIdentifier: params.billIdentifier,
                  ls: params.billIdentifier,
                },
                Fio: params.fio,
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
