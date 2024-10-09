import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Like, PrismaClient, Product } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../../database/prisma.service';
import { ProductsService } from '../products/products.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikesService } from './likes.service';

describe('LikesService', () => {
  let service: LikesService;
  let prisma: DeepMockProxy<PrismaClient>;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        PrismaService,
        {
          provide: ProductsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<LikesService>(LikesService);
    productsService = module.get<ProductsService>(ProductsService);
    prisma = module.get(PrismaService);
  });

  describe('create', () => {
    const userId = 1;
    const createProductDto: CreateLikeDto = {
      productId: 1,
    };
    const mockProduct: Product = {
      id: 1,
      name: 'Test',
      description: 'Test',
      category: 'test',
      price: 20,
      stock: 5,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockedLike: Like = {
      id: 1,
      productId: 1,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    describe('when a product is valid and is not in the user wishlist', () => {
      it('should create a new like on that product', async () => {
        prisma.like.findFirst.mockResolvedValueOnce(null);
        jest
          .spyOn(productsService, 'findOne')
          .mockResolvedValueOnce(mockProduct);
        prisma.like.create.mockResolvedValue(mockedLike);
        expect(await service.create(userId, createProductDto)).toEqual(
          mockedLike,
        );
      });
    });
    describe('when a product is valid and is already in the user wishlist', () => {
      it('should throw the "BadRequestException"', async () => {
        prisma.like.findFirst.mockResolvedValueOnce(mockedLike);
        try {
          await service.create(userId, createProductDto);
        } catch (err) {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toEqual(`Product is already in wishlist`);
        }
      });
    });
    describe('when a product is not valid or does not exists', () => {
      it('should throw the "NotFoundException"', async () => {
        prisma.like.findFirst.mockResolvedValue(null);
        jest
          .spyOn(productsService, 'findOne')
          .mockRejectedValueOnce(
            new NotFoundException(`Product #${mockProduct.id} not found`),
          );
        try {
          await service.create(userId, createProductDto);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Product #${mockProduct.id} not found`);
        }
      });
    });
  });

  describe('findAll', () => {
    const userId = 1;
    const mockedLikeList: Like[] = [
      {
        id: 1,
        productId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 1,
        productId: 2,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    it('should return all the likes created by a specific user', async () => {
      prisma.like.findMany.mockResolvedValueOnce(mockedLikeList);
      expect(await service.findAll(userId)).toEqual(mockedLikeList);
    });
  });

  describe('findOne', () => {
    const userId = 1;
    const mockProduct: Product = {
      id: 1,
      name: 'Test',
      description: 'Test',
      category: 'test',
      price: 20,
      stock: 5,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockedLike: Like = {
      id: 1,
      productId: 1,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    describe('when the product is in the user wishlist', () => {
      it('should return the existing like', async () => {
        prisma.like.findFirst.mockResolvedValue(mockedLike);
        expect(await service.findOne(userId, mockProduct.id)).toEqual(
          mockedLike,
        );
      });
    });

    describe('when the product does not exists or is not in the user wishlist', () => {
      it('should throw the "NotFoundException"', async () => {
        prisma.like.findFirst.mockResolvedValue(null);
        try {
          await service.findOne(userId, mockProduct.id);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Product #${mockProduct.id} is not on user's liked products`,
          );
        }
      });
    });
  });

  describe('remove', () => {
    const userId = 1;
    const mockProduct: Product = {
      id: 1,
      name: 'Test',
      description: 'Test',
      category: 'test',
      price: 20,
      stock: 5,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockedLike: Like = {
      id: 1,
      productId: 1,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    describe('when product with ID exists', () => {
      it('should delete a like by id', async () => {
        prisma.like.findFirst.mockResolvedValue(mockedLike);
        prisma.like.delete.mockResolvedValue(mockedLike);
        const result = await service.remove(userId, mockProduct.id);
        expect(result).toEqual(result);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const productId = 1;
        prisma.like.findFirst.mockResolvedValue(null);
        try {
          await service.remove(userId, mockProduct.id);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(
            `Product #${productId} is not on user's liked products`,
          );
        }
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
