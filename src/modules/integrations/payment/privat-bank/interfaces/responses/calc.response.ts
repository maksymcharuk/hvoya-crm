export class CalcResponse {
  parameters: null;
  payments: Payments[];
}

class Payments {
  id: string;
  commissName: string;
  serviceInfo: ServiceInfo[];
}

class ServiceInfo {
  codifier: string;
  commissName: string;
  commissSum: number;
}
