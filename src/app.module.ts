import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { UserEntity } from '@entities/user.entity';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserFreezeInterceptor } from './interceptors/user-freeze/user-freeze.interceptor';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { BalanceModule } from './modules/balance/balance.module';
import { CartModule } from './modules/cart/cart.module';
import { CaslModule } from './modules/casl/casl.module';
import { DatabaseModule } from './modules/database/database.module';
import { FaqModule } from './modules/faq/faq.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { UsersModule } from './modules/users/users.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigModule.forRoot({
      envFilePath: process.env['NODE_ENV']
        ? `${process.cwd()}/env/${process.env['NODE_ENV']}.env`
        : `${process.cwd()}/env/.env`,
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: { target: 'pino-pretty' },
      },
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    AccountModule,
    CaslModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    TypeOrmModule.forFeature([UserEntity]),
    IntegrationsModule,
    ScheduleModule.forRoot(),
    FaqModule,
    BalanceModule,
    TransferModule,
    EventEmitterModule.forRoot(),
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserFreezeInterceptor,
    },
  ],
})
export class AppModule { }
