export class CheckRequest {
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
          number: string;
          id: string;
        }
        companyinfo?: [
          {
            $: {
              companyId?: string;
            }
            companyCode?: string;
            companyName?: string;
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
        ];
        payerinfo: [
          {
            $: {
              billIdentifier?: string;
              ls?: string;
            }
            fio?: [''];
            phone?: [''];
            address?: [''];
          }
        ]
        totalsum: [''];
        createTime?: [''];
        servicegroup?: [
          {
            service?: [
              {
                $: {
                  sum: string;
                  serviceCode: string;
                }
                companyinfo?: [
                  {
                    companyCode: [''];
                    companyName?: [''];
                  }
                ];
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
                ]
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
            ];
          }
        ];
      }
    ]
  }
}
