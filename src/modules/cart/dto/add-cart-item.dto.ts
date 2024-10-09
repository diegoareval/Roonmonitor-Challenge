import { IsInt, Max, Min } from 'class-validator';

export class AddCartItemDto {
  @Min(1)
  @IsInt()
  productId: number;

  @Min(1)
  @Max(100)
  @IsInt()
  quantity: number;
}
