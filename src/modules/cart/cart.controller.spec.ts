import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaModule } from '../../database/prisma.module';
import { ProductsModule } from '../products/products.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ProductsModule],
      controllers: [CartController],
      providers: [CartService],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  describe('create', () => {
    it('should add a product to the user cart', async () => {
      const payload: AddCartItemDto = {
        productId: 1,
        quantity: 2,
      };
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
      const mockCartItem = {
        id: 1,
        cartId: 1,
        productId: 1,
        quantity: 2,
      };
      jest
        .spyOn(service, 'addItem')
        .mockImplementation(() => Promise.resolve(mockCartItem));
      const result = await controller.create(mockUser, payload);
      expect(result).toEqual(mockCartItem);
    });
  });

  describe('findAll', () => {
    it('should return all the items in the user cart', async () => {
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
      jest.spyOn(service, 'getItems').mockImplementation(() =>
        Promise.resolve({
          items: [mockCartItem],
          totalItems: 1,
          totalPrice: 20,
        }),
      );
      const result = await controller.findAll(mockUser);
      expect(result).toEqual({
        items: [mockCartItem],
        totalItems: 1,
        totalPrice: 20,
      });
    });
  });

  describe('update', () => {
    it('should update the quantity of an item in the user cart', async () => {
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
      jest
        .spyOn(service, 'updateItem')
        .mockImplementation(() =>
          Promise.resolve({ ...mockCartItem, quantity: 3 }),
        );
      const result = await controller.update(
        mockCartItem.id.toString(),
        mockUser,
        {
          quantity: 3,
        },
      );
      expect(result).toEqual({ ...mockCartItem, quantity: 3 });
    });
  });

  describe('remove', () => {
    it('should remove an item from the user cart', async () => {
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
      jest
        .spyOn(service, 'removeItem')
        .mockImplementation(() => Promise.resolve(mockCartItem));

      expect(
        await controller.remove(mockCartItem.toString(), mockUser),
      ).toEqual(mockCartItem);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
