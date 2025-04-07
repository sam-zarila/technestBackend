import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class  OrderDto {
  @ApiProperty({ description: 'ID of the customer ordering' })
    Id:number;




  @ApiProperty({ description: 'Name of the customer ordering' })
  CustomerName: string;

  @ApiProperty({ description: 'Email of the customer ordering' })
  email: string;

  @ApiProperty({ description: 'Name of the product' })
  product: string;


  @ApiProperty({ description: 'purchase date' })
  purchaseDate: Date;

  

  @ApiProperty({ description: 'payment mode' })
  paymentMode: string;

  @ApiProperty({ description: 'total price' })
  price: number;

  @ApiProperty({ description: 'max people' })
  maxPeople: number;

  

  @ApiProperty({ description: 'date to end subscription' })
  EndDate: string;


 
}
export class selectedDateDTO {
  @IsDateString()
  purchaseDate: string;
}

export class UpdateOrderDto{




    @ApiProperty({ description: 'Name of the customer ordering' })
    CustomerName: string;
  
    @ApiProperty({ description: 'Email of the customer ordering' })
    email: string;
  
    @ApiProperty({ description: 'Name of the product' })
    product: string;
  
  
    @ApiProperty({ description: 'purchase date' })
    purchaseDate: Date;
  
    
  
    @ApiProperty({ description: 'payment mode' })
    paymentMode: string;
  
    @ApiProperty({ description: 'total price' })
    price: number;

    @ApiProperty({ description: 'order' })
    OrderNumber: string;

        @ApiProperty({ description: 'maxpeople' })
    maxPeople: number;

  
    @ApiProperty({ description: 'date to end subscription' })
    EndDate: string;
  


}