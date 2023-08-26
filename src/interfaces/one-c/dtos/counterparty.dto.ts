export interface CounterpartyDtoData {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  bio?: string;
}

export class Counterparty {
  id_counterparty: string;
  name: string;
  family: string;
  surname: string;
  email: string;
  phonenumber: string;
  description: string;

  constructor(data: CounterpartyDtoData) {
    this.id_counterparty = data.id;
    this.name = data.firstName;
    this.family = data.lastName;
    this.surname = data.middleName;
    this.email = data.email;
    this.phonenumber = data.phoneNumber;
    this.description = data.bio || '';
  }
}

export type CounterpartyDto = Counterparty[];
