import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
  ) {}

  /**
   * We get the cart, check if it's empty, create an order, and clear the cart
   * @param {number} userId - number - The userId of the user who is placing the order.
   * @returns The order object
   */
  async create(userId: number) {
    const cart = await this.cartService.getItems(userId);
    if (cart.totalItems === 0) {
      throw new BadRequestException('Your cart is empty');
    }
    const orderItems = cart.items.map((item) => ({
      quantity: item.quantity,
      price: item.product.price,
      product: {
        connect: {
          id: item.product.id,
        },
      },
    }));
    const order = await this.prisma.order.create({
      data: {
        total: cart.totalPrice,
        items: {
          create: orderItems,
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        items: true,
      },
    });
    await this.cartService.clearCart(userId);
    return order;
  }

  /**
   * If a userId is passed in, then we'll use it to filter the results, otherwise we'll return all
   * orders
   * @param {number} [userId] - number - This is the userId that we want to filter by. If it's not
   * provided, we want to return all orders.
   * @returns An array of orders.
   */
  async findAll(userId?: number) {
    const whereClause = userId ? { userId } : {};
    const items = await this.prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return items;
  }
}
