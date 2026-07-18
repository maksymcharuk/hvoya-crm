import { join } from 'path';

import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@auth/auth.module';
import { UserEntity } from '@entities/user.entity';
import { Env } from '@enums/env.enum';
import { WSocketModule } from '@gateways/websocket/websocket.module';

import { JwTokenModule } from '@modules/jw-token/jw-token.module';
import { PaymentTransactionsModule } from '@modules/payment-transactions/payment-transactions.module';
import { PostsModule } from '@modules/posts/posts.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserFreezeInterceptor } from './interceptors/user-freeze/user-freeze.interceptor';
import { AppLoggerMiddleware } from './middlewares/app-logger.middleware';
import { AccountModule } from './modules/account/account.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { BalanceModule } from './modules/balance/balance.module';
import { CartModule } from './modules/cart/cart.module';
import { CaslModule } from './modules/casl/casl.module';
import { DatabaseModule } from './modules/database/database.module';
import { FaqModule } from './modules/faq/faq.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { RequestsModule } from './modules/requests/requests.module';
import { SetupModule } from './modules/setup/setup.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // compiled app.module.js lives in dist/src, so this is <root>/client/dist
      rootPath: join(__dirname, '..', '..', 'client', 'dist'),
    }),
    ConfigModule.forRoot({
      // Same rule as src/config.ts: test.env under NODE_ENV=test, env/.env otherwise
      envFilePath: `${process.cwd()}/env/${
        process.env['NODE_ENV'] === Env.Test ? 'test.env' : '.env'
      }`,
      isGlobal: true,
    }),
    JwTokenModule,
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
    WSocketModule,
    SetupModule,
    AnalyticsModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 20 * 1000, // 20 seconds
      max: 20, // maximum number of items in cache
    }),
    RequestsModule,
    PaymentTransactionsModule,
    PostsModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Express 5 (path-to-regexp v8) syntax — bare '*' is no longer a valid path
    consumer.apply(AppLoggerMiddleware).forRoutes('{*splat}');
  }
}
