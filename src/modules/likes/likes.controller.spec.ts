import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Like, User } from '@prisma/client';
import { PrismaModule } from '../../database/prisma.module';
import { ProductsModule } from '../products/products.module';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

describe('LikesController', () => {
  let controller: LikesController;
  let service: LikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ProductsModule],
      controllers: [LikesController],
      providers: [LikesService],
    }).compile();

    controller = module.get<LikesController>(LikesController);
    service = module.get<LikesService>(LikesService);
  });

  describe('create', () => {
    const mockUser: User = {
      id: 1,
      email: 'example@example.com',
      firstName: 'Jhon',
      lastName: 'Doe',
      password: '',
      roles: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createLikeDto: CreateLikeDto = {
      productId: 1,
    };

    const result: Like = {
      id: 1,
      productId: 1,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it('should create a like for a product', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.create(mockUser, createLikeDto)).toEqual(result);
    });
    it('should throw a BadRequestException if the product is already in the user wishlist', async () => {
      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new BadRequestException('Product is already in wishlist');
      });
      await expect(controller.create(mockUser, createLikeDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    const mockUser: User = {
      id: 1,
      email: 'example@example.com',
      firstName: 'Jhon',
      lastName: 'Doe',
      password: '',
      roles: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const productId = 1;
    const result: Like = {
      id: 1,
      productId: 1,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it('should return a list of all the products in the wishlist', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve([result]));

      expect(await controller.findAll(mockUser)).toEqual([result]);
    });

    it('should return a specific product in the wishlist', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.findAll(mockUser, productId.toString())).toEqual(
        result,
      );
    });
  });

  describe('remove', () => {
    const mockUser: User = {
      id: 1,
      email: 'example@example.com',
      firstName: 'Jhon',
      lastName: 'Doe',
      password: '',
      roles: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const productId = 1;
    const result: Like = {
      id: 1,
      productId: 1,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it('should remove a product from the wishlist', async () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.remove(productId.toString(), mockUser)).toEqual(
        result,
      );
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
