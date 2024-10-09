import { IsInt, Max, Min } from 'class-validator';

export class UpdateCartItemDto {
  @Min(1)
  @Max(100)
  @IsInt()
  quantity: number;
}
