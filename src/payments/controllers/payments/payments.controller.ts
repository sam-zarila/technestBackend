import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InitiatePayoutDto, PaymentsDto } from 'src/payments/DTO/paymentDto';

import { PaymentsService } from 'src/payments/services/payments/payments.service';

@ApiTags("Payment Gateway")
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Endpoint for initiating payment
  @Post('pay')
  async processPayment(@Body() paymentsDto: PaymentsDto) {
    // Initiates the payment process
    return this.paymentsService.processPayment(paymentsDto);
  }

  // Endpoint for getting the status of a payment using the transaction reference (tx_ref)
  @Get('status/:tx_ref')
  async getPaymentStatus(@Param('tx_ref') tx_ref: string) {
    // Retrieves the status of the payment
    return this.paymentsService.getPaymentStatus(tx_ref);
  }

  // Endpoint for verifying the payment using the transaction reference (tx_ref)
  @Get('verify/:tx_ref')
  async verifyPayment(@Param('tx_ref') tx_ref: string) {
    console.log("Verifying payment with tx_ref:", tx_ref);
    // Verifies the payment status
    return this.paymentsService.verifyPayment(tx_ref);
  }

  // Endpoint for initiating payout (cash-out) for mobile money
  @Post('cash-out')
  async initiatePayout(@Body() body: InitiatePayoutDto) {
    const { phoneNumber, amount } = body;
    // Initiates the payout process for mobile money
    return await this.paymentsService.initiatePayout(phoneNumber, amount.toString());
  }

  // Callback endpoint for payment status update (this will be triggered by PayChangu after payment completion)
  @Post('payment-callback')
  async paymentCallback(@Body() paymentData: any) {
    console.log('Payment callback data received:', paymentData);

    const { tx_ref, status } = paymentData;

    // Handle the payment status update (e.g., save status to the database, notify the user, etc.)
    if (status === 'success') {
      // Handle success
      console.log(`Payment ${tx_ref} successful`);
      // You can perform actions like updating order status or notifying the user
    } else {
      // Handle failure
      console.log(`Payment ${tx_ref} failed`);
    }

    // Respond back to PayChangu (or any other payment service) to acknowledge receipt of the callback
    return { message: 'Callback received successfully.' };
  }
}
