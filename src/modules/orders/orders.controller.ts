import { Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { User } from '@prisma/client';
import { UseRoles } from 'nest-access-control';

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Place an order based on the products in your cart',
  })
  @Post()
  @UseRoles({
    resource: 'order',
    action: 'create',
    possession: 'own',
  })
  create(@CurrentUser() user: User) {
    return this.ordersService.create(user.id);
  }

  @ApiOperation({
    summary: 'Get all the client orders',
  })
  @Get()
  @UseRoles({
    resource: 'order',
    action: 'read',
    possession: 'any',
  })
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({
    summary: 'Get all your placed orders',
  })
  @Get('my')
  @UseRoles({
    resource: 'order',
    action: 'read',
    possession: 'own',
  })
  findAllByUserId(@CurrentUser() user: User) {
    return this.ordersService.findAll(user.id);
  }
}
