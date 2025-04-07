
import { isString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique:true})
 
  OrderNumber: string;

  @Column()
  CustomerName: string;

  @Column()
  email: string;

  
  @Column()
  product: string;

  @Column()
  purchaseDate: Date;

  @Column()
  price: number;

  @Column()
  paymentMode: string;

  @Column()
  maxPeople: number;


  @Column()
  EndDate: string;

}
