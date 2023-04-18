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
            companyCode?: [''];
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
        payerinfo: [
          {
            $: {
              billIdentifier: string;
              ls: string;
            }
            fio?: [''];
            phone?: [''];
            address?: [''];
          }
        ]
        totalsum: [''];
        createTime: [''];
        confirmTime?: [''];
        serviceGroup: [
          {
            service?: [
              {
                $: {
                  sum: string;
                  id: string;
                }
                payerInfo: [
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
                companyinfo?: [
                  {
                    checkReference: string;
                    companyCode: string;
                    companyName?: [''];
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
                ];
                idinvoice: string;
                serviceName?: [''];
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
            ];
          }
        ]
      }
    ]
  }
}
