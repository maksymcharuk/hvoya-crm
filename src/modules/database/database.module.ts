import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { options } from './configs/db.configs';
import { DatabaseTasksService } from './services/database-tasks.service';
import { DatabaseService } from './services/database.service';
import { OrderSubscriber } from './subscribers/order.subscriber';
import { ProductPackageSizeSubscriber } from './subscribers/product-package-size.subscriber';
import { ProductSizeSubscriber } from './subscribers/product-size.subscriber';
import { UserSubscriber } from './subscribers/user.subscriber';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...options,
      subscribers: [
        UserSubscriber,
        ProductSizeSubscriber,
        ProductPackageSizeSubscriber,
        OrderSubscriber,
      ],
      autoLoadEntities: true,
    }),
  ],
  providers: [DatabaseService, DatabaseTasksService],
})
export class DatabaseModule {}
