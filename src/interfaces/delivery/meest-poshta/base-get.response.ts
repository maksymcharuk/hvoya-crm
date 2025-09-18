export abstract class MeestPoshtaBaseResponse<T> {
  status: string;
  info: {
    fieldName: string;
    message: string;
    messageDetails: string;
  };
  result: T[];
}
