import { Module } from '@nestjs/common';
import { ProductsTransferModule } from './products-transfer/products-transfer.module';

@Module({
  imports: [ProductsTransferModule]
})
export class TransferModule {}
