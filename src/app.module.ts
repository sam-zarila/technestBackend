import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsModule } from './payments/payments.module';


import { ConfigModule } from '@nestjs/config';

import { OrdersModule } from './orders/orders.module';
import { Orders } from './entitys/orderEntity';
import { ProductOrderService } from './orders/orders.service';
import { ProductOrderController } from './orders/orders.controller';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-cvrip2ogjchc7sbaouq0-a.oregon-postgres.render.com',
      port: 5432,
      username: 'technest',
      password: 'cajTiQGYvgthUwIyUNiIqCEgBZAN2sdn',
      database: 'technest',
      entities: [Orders],
      synchronize: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    
    PaymentsModule,
    OrdersModule, // This already brings in the controller and service
  ],
  controllers: [AppController], // ✅ REMOVE ProductOrderController
  providers: [AppService],      // ✅ REMOVE ProductOrderService
})
export class AppModule {}

