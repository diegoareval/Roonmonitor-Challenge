import { IsString, IsInt, IsNumber, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  isVisible: boolean;

  @IsString()
  category: string;

  @IsNumber()
  price: number;

  @IsInt()
  stock: number;
}
