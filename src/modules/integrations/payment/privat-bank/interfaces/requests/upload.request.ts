export class UploadRequest {
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
        unit: Unit[]
      }
    ]
  }
}

class Unit {
  paymentgroup: [
    {
      payment: [
        {
          $: {
            id: string;
          }
          companyinfo: [
            {
              checkReference: [''];
            }
          ]
          payerinfo: [
            {
              $: {
                ls: string | undefined;
                billIdentifier: string;
              }
              fio: [''] | undefined;
              address: [''] | undefined;
            }
          ]
          bankinfo: [
            {
              $: {
                pointId: string | undefined;
                pointType: string;
              }
            }
          ] | undefined;
          totalSum: string;
          payerComission: [''] | undefined;
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
          createTime: string;
          companyComissionByPay: [''] | undefined;
          dealerComission: [''] | undefined;
          confirmTime: [''] | undefined;
          servicegroup: [
            {
              service: [
                {
                  $: {
                    sum: string;
                    serviceCode: string;
                  }
                  meterdata: [
                    {
                      meter: [
                        {
                          $: {
                            name: string;
                            delta: string;
                            previousValue: string;
                          }
                        }
                      ]
                    }
                  ]
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
            }
          ]
        }
      ]
    }
  ]
  sdate: [''] | undefined;
  sum: string;
  timestamp: [''] | undefined;
  bplref: [''] | undefined;
  operday: [''] | undefined;
  providerId: [''] | undefined;
  statusFlag: [''] | undefined;
  companyCode: [''] | undefined;
  comissionSum: [''] | undefined;
  numberOfPayments: [''] | undefined;
  mfo: [''] | undefined;
  account: [''] | undefined;
  okpo: [''] | undefined;
  dgBankAccount: [''] | undefined;
  dgBankMfo: [''] | undefined;
  dgBankOkpo: [''] | undefined;
  acceptSum: [''] | undefined;
}
