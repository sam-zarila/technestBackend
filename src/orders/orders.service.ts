import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { Orders } from 'src/entitys/orderEntity';
import { OrderDto } from './orderDTO/orderDto';
import { Orderparams } from './utils/types';

@Injectable()
export class ProductOrderService {
  constructor(
    @InjectRepository(Orders)
    private OrderRepository: Repository<Orders>,
  ) {}

  // Private method to generate a unique OrderNumber
  private async generateUniqueOrderNumber(): Promise<string> {
    let isUnique = false;
    let OrderNumber = '';

    while (!isUnique) {
      const randomNumber = Math.floor(10000 + Math.random() * 90000);
      OrderNumber = `technest${randomNumber}`;

      const existingBooking = await this.OrderRepository.findOne({
        where: { OrderNumber },
      });

      if (!existingBooking) {
        isUnique = true;
      }
    }

    return OrderNumber;
  }

  async createOrder(OrderDto: OrderDto): Promise<Orders> {
      // Removed the check for an existing order by id, since this is for creating a new order
    
      const maxPeople = OrderDto.maxPeople || 1;  // Default maxPeople if not provided
    
      // Count how many orders already exist for this product
      const currentOrdersCount = await this.OrderRepository.count({
        where: { product: OrderDto.product },
      });
    
      let remainingSpaces = maxPeople - currentOrdersCount;
    
      // Check if the product is out of stock
      if (remainingSpaces <= 0) {
        throw new ConflictException('This product is out of stock.');
      }
    
      const OrderNumber = await this.generateUniqueOrderNumber();
    
      // Create the new order
      const order = this.OrderRepository.create({
        OrderNumber,
        CustomerName: OrderDto.CustomerName,
        email: OrderDto.email,
        product: OrderDto.product,
        purchaseDate: OrderDto.purchaseDate,
        price: OrderDto.price,

        EndDate: OrderDto.EndDate,
        maxPeople,
      });
    
      // Save the new order to the database
      await this.OrderRepository.save(order);
    
      // Update remaining spaces
      remainingSpaces--;
    
      // Warn if there are limited remaining spaces
      if (remainingSpaces === 1) {
        console.warn('Hurry up! Be the last one to order this product!');
      } else if (remainingSpaces > 1) {
        console.warn(`Hurry up! Only ${remainingSpaces} orders remaining for this product.`);
      }
    
      return order;
    }
    
  async findOrdersByNumber(OrderNumber: string): Promise<Orders | string> {
    try {
      const order = await this.OrderRepository.findOne({
        where: { OrderNumber },
      });

      if (!order) {
        return `order with number ${OrderNumber} not found`;
      }

      return order;
    } catch (error) {
      console.error(`Error while searching for a order: ${error.message}`);
      throw new Error(`Error while searching for a order: ${error.message}`);
    }
  }

  async findOrdersByEmail(email: string): Promise<Orders | string> {
    try {
      const order = await this.OrderRepository.findOne({
        where: { email },
      });
  
      if (!order) {
        return `Order with email ${email} not found`;
      }
  
      return order;
    } catch (error) {
      console.error(`Error while searching for an order: ${error.message}`);
      throw new Error(`Error while searching for an order: ${error.message}`);
    }
  }
  


  async getAllOrders(): Promise<Orders[]> {
    return this.OrderRepository.find();
  }

  async getOrderById(id: number): Promise<Orders> {
    const order = await this.OrderRepository.findOne({
      where: { id },
      relations: ['orders'],
    });

    if (!order) {
      throw new NotFoundException(`order with ID ${id} not found`);
    }

    return order;
  }

  async findOrderBySelectedDate(selectedDate: string) {
    try {
      const orders = await this.OrderRepository.createQueryBuilder('orders')
        .where('DATE(orders.purchaseDate) = :selectedDate', { selectedDate })
        .getMany();

      return orders;
    } catch (error) {
      console.error('An error occurred when selecting the chosen date', error);
      throw new Error('Could not retrieve order transactions for the selected date.');
    }
  }

  async findTotalAmountOfCurrentDay(): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const result = await this.OrderRepository.createQueryBuilder('orders')
        .select('SUM(orders.price)', 'total')
        .where('orders.purchaseDate BETWEEN :startOfDay AND :endOfDay', {
          startOfDay,
          endOfDay,
        })
        .getRawOne();

      return result?.total || 0;
    } catch (error) {
      console.error(`Error while fetching total amount for the current day: ${error.message}`);
      throw new Error(`Error while fetching total amount: ${error.message}`);
    }
  }

  async updateOrdersById(id: number, updatedOrderDetails: Orderparams): Promise<void> {
    const existingOrder = await this.OrderRepository.findOne({ where: { id } });

    if (!existingOrder) {
      throw new NotFoundException(`order with ID ${id} not found`);
    }

    const updateObject: Partial<Orderparams> = {};

    if (updatedOrderDetails.product !== undefined) {
      updateObject.product = updatedOrderDetails.product;
    }

    if (updatedOrderDetails.CustomerName !== undefined) {
      updateObject.CustomerName = updatedOrderDetails.CustomerName;
    }

    if (updatedOrderDetails.email !== undefined) {
      updateObject.email = updatedOrderDetails.email;
    }

    if (updatedOrderDetails.purchaseDate !== undefined) {
      updateObject.purchaseDate = updatedOrderDetails.purchaseDate;
    }

    if (updatedOrderDetails.price !== undefined) {
      updateObject.price = updatedOrderDetails.price;
    }

    if (updatedOrderDetails.maxPeople !== undefined) {
      updateObject.maxPeople = updatedOrderDetails.maxPeople;
    }

    if (Object.keys(updateObject).length > 0) {
      await this.OrderRepository.update(id, updateObject);
    }
  }

  async findAllOrderByCurrentDay(): Promise<Orders[] | string> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    try {
      const orders = await this.OrderRepository.find({
        where: {
          purchaseDate: Between(startOfDay, endOfDay),
        },
      });

      if (orders.length === 0) {
        return 'Oops! No orders available for today.';
      }

      return orders;
    } catch (error) {
      console.error(`Error while fetching for orders: ${error.message}`);
      throw new Error(`Error while fetching orders: ${error.message}`);
    }
  }

  async cancelOrder(id: number): Promise<void> {
    await this.getOrderById(id); // throws if not found
    await this.OrderRepository.delete(id);
  }
}
