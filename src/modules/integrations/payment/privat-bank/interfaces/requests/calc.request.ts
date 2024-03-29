export class CalcRequest {
  payments: Payments[];
}

class Payments {
  parameters: {
    param0: string;
    param1: string;
  };
  id: string;
  serviceInfo: ServiceInfo[];
}

class ServiceInfo {
  codifier: string;
  sum: number;
  parameters: {
    param0: string;
    param1: string;
  };
}
