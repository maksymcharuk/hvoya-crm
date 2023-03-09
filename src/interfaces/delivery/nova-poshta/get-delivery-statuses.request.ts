import { IsArray, IsOptional, IsString } from 'class-validator';

import { NovaPoshtaBaseRequest } from './base.request';

class Document {
  @IsString()
  DocumentNumber: string;

  @IsOptional()
  @IsString()
  Phone?: string;

  constructor(data?: Document) {
    this.DocumentNumber = data?.DocumentNumber ?? '';
    this.Phone = data?.Phone ?? '';
  }
}

class MethodProperties {
  @IsArray()
  Documents: Document[];
}

export class NovaPoshtaGetDeliveryStatusesRequest extends NovaPoshtaBaseRequest<MethodProperties> {
  constructor(data?: NovaPoshtaGetDeliveryStatusesRequest) {
    super(data);

    this.methodProperties =
      data?.methodProperties && data?.methodProperties.Documents
        ? {
            Documents: data.methodProperties.Documents.map(
              (document) => new Document(document),
            ),
          }
        : {
            Documents: [],
          };
  }
}
