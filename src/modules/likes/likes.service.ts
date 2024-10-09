import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Like } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ProductsService } from '../products/products.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * It creates a new like for a product, but only if the product is visible and the user hasn't
   * already liked it
   * @param {number} userId - number - the id of the user who is adding the product to the wishlist
   * @param {CreateLikeDto} createLikeDto - CreateLikeDto
   * @returns A promise of a like object
   */
  async create(userId: number, createLikeDto: CreateLikeDto): Promise<Like> {
    const existingWishlistItem = await this.prisma.like.findFirst({
      where: {
        productId: createLikeDto.productId,
        userId: userId,
      },
    });
    if (existingWishlistItem) {
      throw new BadRequestException(`Product is already in wishlist`);
    }
    const product = await this.productsService.findOne(
      createLikeDto.productId,
      {
        isVisible: true,
      },
    );
    return this.prisma.like.create({
      data: {
        product: {
          connect: {
            id: product.id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  /**
   * It returns a list of all the likes for a given user
   * @param {number} userId - number
   * @returns An array of Like objects
   */
  async findAll(userId: number): Promise<Like[]> {
    const items = await this.prisma.like.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: true,
      },
    });
    return items;
  }

  /**
   * Finds a like by userId and productId
   * @param {number} userId - number - The user's ID
   * @param {number} productId - number - The ID of the product to be added to the wishlist
   * @returns A Like object
   */
  async findOne(userId: number, productId: number): Promise<Like> {
    const wishlistItem = await this.prisma.like.findFirst({
      where: {
        productId: productId,
        userId: userId,
      },
      include: {
        product: true,
      },
    });
    if (!wishlistItem) {
      throw new NotFoundException(
        `Product #${productId} is not on user's liked products`,
      );
    }
    return wishlistItem;
  }

  /**
   * It deletes the like from the database
   * @param {number} userId - The id of the user who liked the product.
   * @param {number} productId - The id of the product that the user is liking.
   * @returns The deleted item.
   */
  async remove(userId: number, productId: number): Promise<Like> {
    const existingItem = await this.findOne(userId, productId);
    const deletedItem = await this.prisma.like.delete({
      where: {
        id: existingItem.id,
      },
    });
    return deletedItem;
  }
}
