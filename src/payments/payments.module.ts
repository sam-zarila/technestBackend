import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments/payments.controller';
import { PaymentsService } from './services/payments/payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[TypeOrmModule.forFeature([]),HttpModule],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
