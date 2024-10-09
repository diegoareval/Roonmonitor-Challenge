import { Transform, TransformFnParams } from 'class-transformer';
import { IsNumber, Min, Max } from 'class-validator';

/**
 * PaginationQueryDto is a Data Transfer Object (DTO) used for handling pagination queries.
 * It validates the `limit` and `page` parameters and ensures they are transformed into numbers.
 */
export class PaginationQueryDto {
  /**
   * The number of items to be fetched per page.
   * 
   * @type {number}
   * @minimum 1
   * @maximum 50
   * 
   * @example
   * limit=10 // Retrieves 10 items per page.
   */
  @IsNumber()
  @Min(1)
  @Max(50)
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  limit: number;

  /**
   * The page number to be fetched.
   * 
   * @type {number}
   * @minimum 1
   * 
   * @example
   * page=2 // Fetches the second page of items.
   */
  @IsNumber()
  @Min(1)
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  page: number;
}
