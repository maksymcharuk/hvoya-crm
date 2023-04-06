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
        companyinfo: [
          {
            $: {
              companyId: string | undefined;
            }
            companyCode: string | undefined;
            companyName: string | undefined;
            dopdata: [
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
            ] | undefined;
          }
        ] | undefined;
        payerinfo: [
          {
            $: {
              billIdentifier: string | undefined;
              ls: string | undefined;
            }
            fio: [''] | undefined;
            phone: [''] | undefined;
            address: [''] | undefined;
          }
        ]
        totalSum: [''];
        createTime: [''] | undefined;
        servicegroup: [
          {
            service: [
              {
                $: {
                  sum: string;
                  serviceCode: string;
                }
                companyinfo: [
                  {
                    companyCode: [''];
                    companyName: [''] | undefined;
                  }
                ] | undefined;
                serviceName: [''] | undefined;
                destination: [''] | undefined;
                meterdata: [
                  {
                    meter: [
                      {
                        $: {
                          previousValue: string;
                          currentValue: string | undefined;
                          tarif: string | undefined;
                          delta: string | undefined;
                          name: string | undefined;
                        }
                      }
                    ]
                  }
                ] | undefined
                dopdata: [
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
                ] | undefined;
              }
            ] | undefined;
          }
        ] | undefined;
      }
    ]
  }
}
