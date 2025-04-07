import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from 'src/entitys/orderEntity';
import { ProductOrderController } from './orders.controller';
import { ProductOrderService } from './orders.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Orders]), // Include both entities
  ],
  controllers: [ProductOrderController],
  providers: [ProductOrderService],
  exports: [ProductOrderService], // Export if used in other modules
})
export class OrdersModule {}