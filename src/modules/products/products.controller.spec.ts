import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '@prisma/client';
import { Readable } from 'stream';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { PrismaModule } from '../../database/prisma.module';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();
    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'This is a test product',
        category: 'Test Category',
        isVisible: true,
        price: 10,
        stock: 5,
      };

      const result: Product = {
        id: 1,
        ...createProductDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.create(createProductDto)).toEqual(result);
    });
  });

  describe('addImage', () => {
    it('should add an image to the product', async () => {
      const productId = 1;
      const file = {
        fieldname: '',
        destination: '',
        mimetype: 'image/png',
        originalname: '',
        filename: '',
        path: 'file',
        size: 1000,
        encoding: 'null',
        stream: Readable.from('test'),
        buffer: Buffer.from('test'),
      };
      jest.spyOn(service, 'addImage').mockImplementation(() =>
        Promise.resolve({
          id: 1,
          productId: 1,
          url: `https://picsum.photos/id/${productId}/200/300`,
        }),
      );
      expect(await controller.addImage(productId.toString(), file)).toEqual({
        id: 1,
        productId: 1,
        url: `https://picsum.photos/id/${productId}/200/300`,
      });
    });
  });

  describe('findAll', () => {
    it('should get an array of products', async () => {
      const result: Product[] = [
        {
          id: 1,
          name: 'Test Product',
          description: 'This is a test product',
          category: 'Test Category',
          isVisible: true,
          price: 10,
          stock: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Test Product',
          description: 'This is a test product',
          category: 'Test Category',
          isVisible: false,
          price: 10,
          stock: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() =>
          Promise.resolve(
            new PaginationResponseDto(result, result.length, 1, 10),
          ),
        );
      expect(
        await controller.findAll({
          limit: 10,
          page: 1,
        }),
      ).toEqual({
        items: result,
        total: 2,
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrev: false,
      });
    });
  });

  describe('findAllPublic', () => {
    it('should get an array of public products', async () => {
      const result: Product[] = [
        {
          id: 1,
          name: 'Test Product',
          description: 'This is a test product',
          category: 'Test Category',
          isVisible: true,
          price: 10,
          stock: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Test Product',
          description: 'This is a test product',
          category: 'Test Category',

          isVisible: true,
          price: 10,
          stock: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() =>
          Promise.resolve(
            new PaginationResponseDto(result, result.length, 1, 10),
          ),
        );
      expect(
        await controller.findAll({
          limit: 10,
          page: 1,
        }),
      ).toEqual({
        items: result,
        total: 2,
        page: 1,
        limit: 10,
        hasNext: false,
        hasPrev: false,
      });
    });
  });

  describe('findOne', () => {
    it('should get a single product', async () => {
      const result: Product = {
        id: 1,
        name: 'Test Product',
        description: 'This is a test product',
        category: 'Test Category',
        isVisible: true,
        price: 10,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(result));
      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Test Product',
        description: 'This is a test product',
        category: 'Test Category',
        isVisible: true,
        price: 10,
        stock: 5,
      };
      const product: Product = {
        id: 1,
        name: 'Test Product',
        description: 'This is a test product',
        category: 'Test Category',
        isVisible: true,
        price: 10,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve(product));
      expect(await controller.update('1', updateProductDto)).toEqual({
        id: 1,
        ...updateProductDto,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('remove', () => {
    it('should return that it deleted a product', async () => {
      const result: Product = {
        id: 1,
        name: 'Test Product',
        description: 'This is a test product',
        category: 'Test Category',
        isVisible: true,
        price: 10,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(service, 'remove')
        .mockImplementation(() => Promise.resolve(result));
      expect(await controller.remove('1')).toEqual(result);
    });
  });
});
