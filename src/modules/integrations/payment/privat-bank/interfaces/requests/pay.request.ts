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
          number: string | undefined;
        }
        companyinfo: [
          {
            $: {
              inn: string | undefined;
              companyId: string;
            }
            companyCode: [''] | undefined;
            unitCode: [''] | undefined;
            companyName: [''] | undefined;
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
            checkreference: [''];
          }
        ] | undefined;
        payerinfo: [
          {
            $: {
              billIdentifier: string;
              ls: string | undefined;
            }
            fio: [''] | undefined;
            phone: [''] | undefined;
            address: [''] | undefined;
          }
        ]
        totalsum: [''];
        createTime: [''];
        confirmTime: [''] | undefined;
        numberPack: [''] | undefined;
        subNumberPack: [''] | undefined;
        serviceGroup: [
          {
            service: [
              {
                $: {
                  sum: string;
                  serviceCode: string;
                  id: string | undefined;
                }
                companyinfo: [
                  {
                    checkReference: [''] | undefined;
                    companyCode: [''] | undefined;
                    unitCode: [''] | undefined;
                    companyName: [''] | undefined;
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
                ]
                idinvoice: [''];
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
                ] | undefined;
                dopdata: [
                  {
                    dop: [
                      {
                        $: {
                          name: string;
                          value: string;
                        }
                      }
                    ] | undefined;
                  }
                ]
                comissions: Commision[]
              }
            ] | undefined;
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
