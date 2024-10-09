import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cart, CartItem, PrismaClient, Product } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../../database/prisma.service';
import { ProductsService } from '../products/products.service';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let prisma: DeepMockProxy<PrismaClient>;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        PrismaService,
        {
          provide: ProductsService,
          useValue: {
            findOneAndCheckAvailability: jest.fn(),
            clearCart: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<CartService>(CartService);
    productsService = module.get<ProductsService>(ProductsService);
    prisma = module.get(PrismaService);
  });

  describe('addItem', () => {
    const userId = 1;
    const mockedCart: Cart = {
      id: 1,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockedProduct: Product = {
      id: 1,
      price: 20,
      name: 'Test Product',
      description: 'This is a test product',
      category: 'Test Category',
      isVisible: true,
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockedCartItem: CartItem = {
      id: 1,
      cartId: 1,
      productId: 1,
      quantity: 1,
    };

    it('should add a new item to the cart', async () => {
      jest.spyOn(service, 'retrieveUserCart').mockResolvedValue(mockedCart);
      jest
        .spyOn(productsService, 'findOneAndCheckAvailability')
        .mockResolvedValue(mockedProduct);
      prisma.cartItem.findFirst.mockResolvedValue(null);
      prisma.cartItem.create.mockResolvedValue(mockedCartItem);
      const result = await service.addItem(userId, {
        productId: 1,
        quantity: 1,
      });
      expect(result).toEqual(mockedCartItem);
    });

    it('should update the quantity of an existing item in the cart', async () => {
      jest.spyOn(service, 'retrieveUserCart').mockResolvedValue(mockedCart);
      jest
        .spyOn(productsService, 'findOneAndCheckAvailability')
        .mockResolvedValue(mockedProduct);
      prisma.cartItem.findFirst.mockResolvedValue(mockedCartItem);
      jest.spyOn(service, 'updateItem').mockResolvedValue({
        ...mockedCartItem,
        quantity: 2,
      });
      const result = await service.addItem(userId, {
        productId: 1,
        quantity: 1,
      });
      expect(result).toEqual({
        ...mockedCartItem,
        quantity: 2,
      });
    });
  });

  describe('getItems', () => {
    const userId = 1;
    const mockedCart: Cart = {
      id: 1,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockCartItem = {
      id: 1,
      cartId: 1,
      productId: 1,
      quantity: 2,
      product: {
        id: 1,
        price: 10,
        name: 'Test Product',
        description: 'This is a test product',
        category: 'Test Category',
        imageUrl: '',
        isVisible: true,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    it("should retrieve all items in the user's cart", async () => {
      jest.spyOn(service, 'retrieveUserCart').mockResolvedValue(mockedCart);
      prisma.cartItem.findMany.mockResolvedValue([mockCartItem]);
      const result = await service.getItems(userId);
      expect(result).toEqual({
        items: [mockCartItem],
        totalItems: 1,
        totalPrice: 20,
      });
    });
  });

  describe('updateItem', () => {
    const userId = 1;
    const mockProduct = {
      id: 1,
      price: 10,
      name: 'Test Product',
      description: 'This is a test product',
      category: 'Test Category',
      imageUrl: '',
      isVisible: true,
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockCartItem = {
      id: 1,
      cartId: 1,
      productId: 1,
      quantity: 2,
      product: mockProduct,
    };
    it('should update the quantity of an existing cart item', async () => {
      prisma.cartItem.findFirst.mockResolvedValue(mockCartItem);
      jest
        .spyOn(productsService, 'findOneAndCheckAvailability')
        .mockResolvedValue(mockProduct);
      prisma.cartItem.update.mockResolvedValue({
        ...mockCartItem,
        quantity: 4,
      });
      const result = await service.updateItem(mockCartItem.id, userId, {
        quantity: 4,
      });
      expect(result).toEqual({
        ...mockCartItem,
        quantity: 4,
      });
    });

    it('should throw NotFoundException if the cart item does not exist', async () => {
      prisma.cartItem.findFirst.mockResolvedValue(null);
      await expect(
        service.updateItem(mockCartItem.id, userId, {
          quantity: 4,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeItem', () => {
    const userId = 1;
    const mockProduct = {
      id: 1,
      price: 10,
      name: 'Test Product',
      description: 'This is a test product',
      category: 'Test Category',
      imageUrl: '',
      isVisible: true,
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockCartItem = {
      id: 1,
      cartId: 1,
      productId: 1,
      quantity: 2,
      product: mockProduct,
    };
    it('should remove the specified item from the cart', async () => {
      prisma.cartItem.findFirst.mockResolvedValue(mockCartItem);
      prisma.cartItem.delete.mockResolvedValue(mockCartItem);
      const result = await service.removeItem(mockCartItem.id, userId);
      expect(result).toEqual(mockCartItem);
    });

    it('should throw NotFoundException if the cart item does not exist', async () => {
      prisma.cartItem.findFirst.mockResolvedValue(null);
      await expect(
        service.updateItem(mockCartItem.id, userId, {
          quantity: 4,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('retrieveUserCart', () => {
    const userId = 1;

    const mockCart = {
      id: 1,
      userId: 1,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it('should retrieve the cart for the specified user', async () => {
      prisma.cart.findUnique.mockResolvedValue(mockCart);
      const result = await service.retrieveUserCart(userId);
      expect(result).toEqual(mockCart);
    });

    it('should create a new cart if no cart exists for the user', async () => {
      prisma.cart.findUnique.mockResolvedValue(null);
      prisma.cart.create.mockResolvedValue(mockCart);
      const result = await service.retrieveUserCart(userId);
      expect(result).toEqual(mockCart);
    });
  });

  describe('clearCart', () => {
    const userId = 1;
    const mockCartItem = {
      id: 1,
      cartId: 1,
      productId: 1,
      quantity: 2,
    };
    const mockCart = {
      id: 1,
      userId: 1,
      items: [mockCartItem],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    it("should remove all items from the user's cart", async () => {
      jest.spyOn(service, 'retrieveUserCart').mockResolvedValue(mockCart);
      prisma.cart.deleteMany.mockResolvedValue({
        count: 1,
      });
      const result = await service.clearCart(userId);
      expect(result).toEqual(undefined);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
