import { Controller, Post, Get, Delete, Param, Body, Query, Put, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


import { Orders } from 'src/entitys/orderEntity';
import { ProductOrderService } from './orders.service';
import { OrderDto, selectedDateDTO, UpdateOrderDto } from './orderDTO/orderDto';

@ApiTags('Product Orders')
@Controller('orders')
export class ProductOrderController {
  constructor(private readonly productorder: ProductOrderService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new order' })
  async createProductOrder(@Body() orderdto: OrderDto): Promise<Orders> {
    return this.productorder.createOrder(orderdto);
  }
  @Get('byselectedDate')
  @ApiOperation({
    summary: 'Get orders transaction by selected date',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns orders transaction by selected date',
  })
  
  async getOrderTransactionsSelectedByDate(@Query() selectedDateDTO: selectedDateDTO) {
    const { purchaseDate} = selectedDateDTO; // Extract the date from the DTO
    console.log(`Request received for date: ${purchaseDate}`);  // Logging the incoming request
    try {
      const transactions = await this.productorder.findOrderBySelectedDate(purchaseDate);
      return transactions;
    } catch (error) {
      console.error('Error retrieving order transactions:', error);
      return {
        message: 'Error retrieving order transactions for the selected date.',
        error: error.message,
      };
    }
  }
     
  @Get('/todayOrders')
  @ApiOperation({summary:'Get all orders for the current day'})
  @ApiResponse({ status: 200, description: 'return all orders by current day ' })
  async getOrdersByDay():Promise<Orders[] | string> {
    return  await this.productorder.findAllOrderByCurrentDay();
  }

  // GET /orders/remaining/:product

  


  @Get('total-orderfee-today')
  @ApiOperation({
    summary: 'Get total amount  for the current day',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns total amount for the current day',
  })


  @Get('total-amount-today')
  async getTotalAmountToday(): Promise<{ totalAmount: number }> {
    const totalAmount = await this.productorder.findTotalAmountOfCurrentDay();
    return { totalAmount };
  }
  
  

  @Get('number/:OrderNumber')
  @ApiOperation({ summary: 'Find order by order Number' })
  async findBookingByNumber(@Param('OrderNumber') OrderNumber: string): Promise<Orders | string> {
    return this.productorder.findOrdersByNumber(OrderNumber);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Find order by email' })
  async findBookingByEmail(@Param('email') email: string): Promise<Orders | string> {
    return this.productorder.findOrdersByEmail(email);
  }
  

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  async getAllOrders(): Promise<Orders[]> {
    return this.productorder.getAllOrders();
  }

  @Put(':id')

  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({ status: 200, description: 'order updated successfully' })
  async updateOrdersById(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateOrderDto:UpdateOrderDto,
  ): Promise<{ message: string }> {
    await this.productorder.updateOrdersById(
      id,
      UpdateOrderDto,
    );
    return { message: 'Order updated successfully' };
  }


@Delete(':id')
  @ApiOperation({ summary: 'Cancel a order' })
  async cancelOrder(@Param('id') id: number): Promise<string> {
    await this.productorder.cancelOrder(id);
    return 'Order cancelled successfully';
  }
  
  
}