export class CancelRequest {
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
        }
        companyinfo: [
          {
            companyCode: [''] | undefined;
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
        payerinfo: [
          {
            $: {
              billIdentifier: string;
              ls: string;
            }
            fio: [''] | undefined;
            phone: [''] | undefined;
            address: [''] | undefined;
          }
        ]
        totalsum: [''];
        createTime: [''];
        confirmTime: [''] | undefined;
        serviceGroup: [
          {
            service: [
              {
                $: {
                  sum: string;
                  id: string;
                }
                payerInfo: [
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
                companyinfo: [
                  {
                    checkReference: string;
                    companyCode: string;
                    companyName: [''] | undefined;
                    dopData: [
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
                    ]
                  }
                ] | undefined;
                idinvoice: string;
                serviceName: [''] | undefined;
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
                ]
              }
            ] | undefined;
          }
        ]
      }
    ]
  }
}
