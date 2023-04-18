export class PayRequest {
  transfer: {
    $: {
      xmls: string;
      interface: string;
      action: string;
    }
    data: [
      {
        $: {
          'xmlns:xsi': string;
          'xsi:type': string;
          id: string;
          number?: string;
        }
        companyinfo?: [
          {
            $: {
              inn?: string;
              companyId: string;
            }
            companyCode?: [''];
            unitCode?: [''];
            companyName?: [''];
            dopdata?: [
              {
                dop: [
                  {
                    $: {
                      name: string;
                      value: string;
                    }
                  }
                ]
              }
            ];
            checkreference: [''];
          }
        ];
        payerinfo: [
          {
            $: {
              billIdentifier: string;
              ls?: string;
            }
            fio?: [''];
            phone?: [''];
            address?: [''];
          }
        ]
        totalsum: [''];
        createTime: [''];
        confirmTime?: [''];
        numberPack?: [''];
        subNumberPack?: [''];
        serviceGroup: [
          {
            service?: [
              {
                $: {
                  sum: string;
                  serviceCode: string;
                  id?: string;
                }
                companyinfo: [
                  {
                    checkReference?: [''];
                    companyCode?: [''];
                    unitCode?: [''];
                    companyName?: [''];
                    dopdata?: [
                      {
                        dop: [
                          {
                            $: {
                              name: string;
                              value: string;
                            }
                          }
                        ]
                      }
                    ];
                  }
                ]
                idinvoice: [''];
                serviceName?: [''];
                destination?: [''];
                meterdata?: [
                  {
                    meter: [
                      {
                        $: {
                          previousValue: string;
                          currentValue?: string;
                          tarif?: string;
                          delta?: string;
                          name?: string;
                        }
                      }
                    ]
                  }
                ];
                dopdata: [
                  {
                    dop?: [
                      {
                        $: {
                          name: string;
                          value: string;
                        }
                      }
                    ];
                  }
                ]
                comissions: Commision[]
              }
            ];
          }
        ]
      }
    ]
  }

}

class Commision {
  commision: [
    {
      $: {
        type: string;
        summ: string;
      }
    }
  ]
}
