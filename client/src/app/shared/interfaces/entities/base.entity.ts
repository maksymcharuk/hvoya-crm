export abstract class BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: BaseEntity) {
    this.id = data?.id || 0;
    this.createdAt = data?.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data?.updatedAt ? new Date(data.updatedAt) : new Date();
  }
}
