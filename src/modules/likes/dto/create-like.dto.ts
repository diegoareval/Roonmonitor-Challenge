import { IsInt } from 'class-validator';

export class CreateLikeDto {
  @IsInt()
  productId: number;
}
