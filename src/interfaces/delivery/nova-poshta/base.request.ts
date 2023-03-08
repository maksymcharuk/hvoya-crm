import { IsNotEmptyObject, IsString } from 'class-validator';

export abstract class NovaPoshtaBaseRequest<T> {
  @IsString()
  apiKey: string;

  @IsString()
  modelName: string;

  @IsString()
  calledMethod: string;

  @IsNotEmptyObject()
  methodProperties: T;

  constructor(data?: NovaPoshtaBaseRequest<T>) {
    this.apiKey = data?.apiKey ?? '';
    this.modelName = data?.modelName ?? '';
    this.calledMethod = data?.calledMethod ?? '';
    this.methodProperties = data?.methodProperties ?? ({} as T);
  }
}
