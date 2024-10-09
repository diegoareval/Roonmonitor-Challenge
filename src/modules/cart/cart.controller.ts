import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UseRoles } from 'nest-access-control';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiBearerAuth()
@ApiTags('Shopping Cart')
@Controller('shopping-carts/items/')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseRoles({
    resource: 'cart-item',
    action: 'create',
    possession: 'own',
  })
  @ApiOperation({
    summary: 'Add a product to your shopping cart',
  })
  create(@CurrentUser() user: User, @Body() addCartItemDto: AddCartItemDto) {
    return this.cartService.addItem(user.id, addCartItemDto);
  }

  @Get()
  @UseRoles({
    resource: 'cart-item',
    action: 'read',
    possession: 'own',
  })
  @ApiOperation({
    summary: 'Get all the products in your shopping cart',
  })
  findAll(@CurrentUser() user: User) {
    return this.cartService.getItems(user.id);
  }

  @Patch(':id')
  @UseRoles({
    resource: 'cart-item',
    action: 'update',
    possession: 'own',
  })
  @ApiOperation({
    summary: 'Update a product quantity in your shopping cart',
  })
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(+id, user.id, updateCartItemDto);
  }

  @Delete(':id')
  @UseRoles({
    resource: 'cart-item',
    action: 'delete',
    possession: 'own',
  })
  @ApiOperation({
    summary: 'Remove a product from your shopping cart',
  })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.cartService.removeItem(+id, user.id);
  }
}
