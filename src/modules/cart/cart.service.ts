import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItem } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ProductsService } from '../products/products.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * It adds a new item to the cart, or updates the quantity of an existing item in the cart
   * @param {number} userId - number - the id of the user who is adding the item to their cart
   * @param {AddCartItemDto} addCartItemDto - AddCartItemDto
   * @returns A cart item
   */
  async addItem(
    userId: number,
    addCartItemDto: AddCartItemDto,
  ): Promise<CartItem> {
    const cart = await this.retrieveUserCart(userId);
    const product = await this.productsService.findOneAndCheckAvailability(
      addCartItemDto.productId,
      addCartItemDto.quantity,
    );
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        productId: product.id,
        cartId: cart.id,
      },
    });
    if (existingItem) {
      // TODO: refactor to reduce database queries
      return this.updateItem(existingItem.id, userId, {
        quantity: addCartItemDto.quantity + existingItem.quantity,
      });
    }
    return this.prisma.cartItem.create({
      data: {
        cart: {
          connect: {
            id: cart.id,
          },
        },
        product: {
          connect: {
            id: product.id,
          },
        },
        quantity: addCartItemDto.quantity,
      },
    });
  }

  /**
   * We're retrieving the cart for the user, and then using the cart's id to retrieve all the cart
   * items for that cart
   * @param {number} userId - number - The user's ID
   * @returns An array of CartItem objects.
   */
  async getItems(userId: number) {
    const cart = await this.retrieveUserCart(userId);
    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
        product: {
          isVisible: true,
        },
      },
      include: {
        product: true,
      },
    });
    let totalPrice = 0;
    for (const cartItem of cartItems) {
      totalPrice += cartItem.product.price * cartItem.quantity;
    }
    return {
      items: cartItems,
      totalItems: cartItems.length,
      totalPrice: totalPrice,
    };
  }

  /**
   * It updates a cart item by id, checking that the user is the owner of the cart item and that the
   * product is available
   * @param {number} id - The id of the cart item to update.
   * @param {number} userId - number - The userId of the user who owns the cart.
   * @param {UpdateCartItemDto} updateCartItemDto - UpdateCartItemDto
   * @returns The updated cart item
   */
  async updateItem(
    id: number,
    userId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: id,
        cart: {
          userId: userId,
        },
      },
    });
    if (!cartItem) {
      throw new NotFoundException(`Cart Item #${id} not found`);
    }
    await this.productsService.findOneAndCheckAvailability(
      cartItem.productId,
      updateCartItemDto.quantity,
    );
    const updatedCartItem = await this.prisma.cartItem.update({
      where: {
        id: id,
      },
      data: {
        quantity: updateCartItemDto.quantity,
      },
      include: {
        product: true,
      },
    });
    return updatedCartItem;
  }

  /**
   * It finds the cart item with the given id and userId, and if it exists, it deletes it
   * @param {number} id - number - The id of the cart item to be deleted
   * @param {number} userId - number - The userId of the user who owns the cart
   * @returns The cartItem object is being returned.
   */
  async removeItem(id: number, userId: number) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: id,
        cart: {
          userId: userId,
        },
      },
    });
    if (!cartItem) {
      throw new NotFoundException(`Cart Item #${id} not found`);
    }
    return this.prisma.cartItem.delete({
      where: {
        id: id,
      },
    });
  }

  /**
   * We're using Prisma's `findUnique` method to find a cart that belongs to the user with the provided
   * `userId`. If no cart is found, we're creating a new cart and returning it. If a cart is found,
   * we're returning it
   * @param {number} userId - number - The userId of the user we want to retrieve the cart for.
   * @returns A cart object
   */
  async retrieveUserCart(userId: number): Promise<Cart> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
        user: true,
      },
    });
    if (!cart) {
      const newCart = await this.prisma.cart.create({
        data: {
          user: { connect: { id: userId } },
        },
        include: {
          items: true,
          user: true,
        },
      });
      return newCart;
    }
    return cart;
  }

  /**
   * It deletes all the cart items associated with a cart
   * @param {number} userId - number - The user's id
   */
  async clearCart(userId: number) {
    const cart = await this.retrieveUserCart(userId);
    return this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
  }
}
