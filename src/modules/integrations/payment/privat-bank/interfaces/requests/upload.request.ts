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
                ls?: string;
                billIdentifier: string;
              }
              fio?: [''];
              address?: [''];
            }
          ]
          bankinfo?: [
            {
              $: {
                pointId?: string;
                pointType: string;
              }
            }
          ];
          totalSum: string;
          payerComission?: [''];
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
          companyComissionByPay?: [''];
          dealerComission?: [''];
          confirmTime?: [''];
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
            }
          ]
        }
      ]
    }
  ]
  sdate?: [''];
  sum: string;
  timestamp?: [''];
  bplref?: [''];
  operday?: [''];
  providerId?: [''];
  statusFlag?: [''];
  companyCode?: [''];
  comissionSum?: [''];
  numberOfPayments?: [''];
  mfo?: [''];
  account?: [''];
  okpo?: [''];
  dgBankAccount?: [''];
  dgBankMfo?: [''];
  dgBankOkpo?: [''];
  acceptSum?: [''];
}
