import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../../database/prisma.service';
import { CartService } from '../cart/cart.service';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: DeepMockProxy<PrismaClient>;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        PrismaService,
        {
          provide: CartService,
          useValue: {
            getItems: jest.fn(),
            clearCart: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<OrdersService>(OrdersService);
    cartService = module.get<CartService>(CartService);
    prisma = module.get(PrismaService);
  });

  describe('create', () => {
    it('should throw a BadRequestException when the cart is empty', async () => {
      const userId = 1;
      const cart = { items: [], totalItems: 0, totalPrice: 0 };
      jest.spyOn(cartService, 'getItems').mockResolvedValueOnce(cart);
      await expect(service.create(userId)).rejects.toThrow(
        new BadRequestException('Your cart is empty'),
      );
    });

    it('should create an order when the cart is not empty', async () => {
      const userId = 1;
      const cart = {
        totalItems: 1,
        totalPrice: 20,
        items: [
          {
            id: 1,
            cartId: 1,
            productId: 1,
            quantity: 1,
            product: {
              id: 1,
              price: 20,
              name: 'Test Product',
              description: 'This is a test product',
              category: 'Test Category',
              imageUrl: '',
              isVisible: true,
              stock: 5,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      };
      const order = {
        id: 1,
        userId: 1,
        total: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            price: 20,
            quantity: 1,
          },
        ],
      };
      const orderItems = [
        { quantity: 1, price: 20, product: { connect: { id: 1 } } },
      ];
      jest.spyOn(cartService, 'getItems').mockResolvedValueOnce(cart);
      prisma.order.create.mockResolvedValueOnce(order);
      jest.spyOn(cartService, 'clearCart').mockResolvedValue({ count: 1 });

      const result = await service.create(userId);

      expect(result).toEqual(order);
      expect(prisma.order.create).toHaveBeenCalledWith({
        data: {
          total: cart.totalPrice,
          items: { create: orderItems },
          user: { connect: { id: userId } },
        },
        include: { items: true },
      });
      expect(cartService.clearCart).toHaveBeenCalledWith(userId);
    });
  });

  describe('findAll', () => {
    it('should return all the orders', async () => {
      const placedOrders = [
        {
          id: 1,
          userId: 3,
          total: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 3,
            email: 'string@string.com',
            firstName: 'string',
            lastName: 'string',
          },
          items: [
            {
              id: 1,
              orderId: 1,
              productId: 4,
              price: 0,
              quantity: 4,
              product: {
                id: 4,
                name: 'Organic Shampoo',
                description: 'Real good for your hair',
                category: 'personal-care',
                price: 30,
                stock: 10,
                isVisible: true,
                imageUrl: 'string',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          ],
        },
        {
          id: 3,
          userId: 3,
          total: 120,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 1,
            email: 'string@string.com',
            firstName: 'string',
            lastName: 'string',
          },
          items: [
            {
              id: 3,
              orderId: 3,
              productId: 4,
              price: 30,
              quantity: 4,
              product: {
                id: 4,
                name: 'Organic Shampoo',
                description: 'Real good for your hair',
                category: 'personal-care',
                price: 30,
                stock: 10,
                isVisible: true,
                imageUrl: 'string',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          ],
        },
      ];
      prisma.order.findMany.mockResolvedValueOnce(placedOrders);
      const result = await service.findAll();
      expect(result).toEqual(placedOrders);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
