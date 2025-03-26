import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { PaymentsDto } from 'src/payments/DTO/paymentDto';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(private readonly httpService: HttpService) {}

  // tnm and airtel ids
  private readonly operatorRefIds = {
    '8': '27494cb5-ba9e-437f-a114-4e7a7686bcca',
    '9': '20be6c20-adeb-4b5b-a7ba-0769820df4fb',
  };

  // method for generating mobile operators
  private getMobileMoneyOperatorRefId(mobile: string): string {
    const prefix = mobile.charAt(0);
    const refId = this.operatorRefIds[prefix];
    if (!refId) {
      throw new HttpException(
        'Unsupported mobile number prefix.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return refId;
  }

  // generating unique transaction identifier
  private generateUniqueTransactionReference(): string {
    return uuidv4();
  }

  // processing payments
  async processPayment(paymentsDto: PaymentsDto): Promise<any> {
    const { amount } = paymentsDto;

  
    const apiKey = process.env.PAYCHANGU_API_KEY;
    if (!apiKey) {
      throw new HttpException(
        'API key not configured.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const options = {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.paychangu.com/payment',
          {
            ...paymentsDto,
            callback_url: `https://technetsystem.netlify.app/`, // Use BASE_URL environment variable
            return_url: `${process.env.BASE_URL}/order-details`, // Redirect to order-details page
            currency: 'MWK',
            email: 'zarilasam99@gmail.com',
            amount: amount,
          },
          options,
        ),
      );
      const data = response.data;

      if (data.status === 'success') {
        return {
          statusCode: 200,
          message: 'Payment initiated successfully.',
          data: data.data,
        };
      } else {
        throw new HttpException(
          data.message || 'Payment initiation failed.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error(
        'Error processing payment:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data?.message ||
          'An error occurred while processing payment.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // getting payment status
  async getPaymentStatus(tx_ref: string): Promise<any> {
    const apiKey = process.env.PAYCHANGU_API_KEY;
    if (!apiKey) {
      throw new HttpException(
        'API key not configured.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.paychangu.com/payment/status/${tx_ref}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          },
        ),
      );
      const data = response.data;

      if (data.status === 'success') {
        return {
          statusCode: 200,
          message: 'Payment status retrieved successfully.',
          data: data.data,
        };
      } else {
        throw new HttpException(
          data.message || 'Failed to retrieve payment status.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error(
        'Error retrieving payment status:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data?.message ||
          'An error occurred while retrieving payment status.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // verify the payment status via the phone PIN
  async verifyPayment(tx_ref: string): Promise<any> {
    const apiKey = process.env.PAYCHANGU_API_KEY;
    if (!apiKey) {
      throw new HttpException(
        'API key not configured.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.paychangu.com/verify-payment/${tx_ref}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              Accept: 'application/json',
            },
          },
        ),
      );

      const data = response.data;

      if (data.status === 'success') {
        return {
          statusCode: 200,
          message: 'Payment verified successfully.',
          data: data.data,
        };
      } else {
        throw new HttpException(
          data.message || 'Payment verification failed.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error(
        'Error verifying payment:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data?.message ||
          'An error occurred while verifying payment.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // initialize payout
  async initiatePayout(phoneNumber: string, amount: string): Promise<any> {
    const mobileMoneyOperatorRefId =
      this.getMobileMoneyOperatorRefId(phoneNumber);
    const chargeId = this.generateUniqueTransactionReference();

    const apiKey = process.env.PAYCHANGU_API_KEY;
    if (!apiKey) {
      throw new HttpException(
        'API key not configured.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          'https://api.paychangu.com/mobile-money/payouts/initialize',
          {
            mobile: phoneNumber,
            mobile_money_operator_ref_id: mobileMoneyOperatorRefId,
            amount,
            charge_id: chargeId,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (response.data.status === 'success') {
        return {
          statusCode: 200,
          message: 'Payout initiated successfully.',
          data: response.data.data,
        };
      } else {
        throw new HttpException(
          'Failed to initiate mobile money payout.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error(
        'Error initiating payout:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'An error occurred while processing payout.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
