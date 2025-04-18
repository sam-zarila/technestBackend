import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
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


  @Column({ nullable: true })
  EndDate: Date;

  @BeforeInsert()
  setEndDate() {
    const purchase = new Date(this.purchaseDate);
    const end = new Date(purchase);
    end.setMonth(end.getMonth() + 1); // adds 1 month, respecting month lengths
    this.EndDate = end;
  }
}
