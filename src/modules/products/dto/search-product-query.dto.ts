import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class SearchProductQueryDto extends PartialType(PaginationQueryDto) {
  @IsOptional()
  category?: string;
}
