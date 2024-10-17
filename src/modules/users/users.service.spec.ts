import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import * as argon2 from 'argon2';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();
    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  describe('create', () => {
    it('should hash the password before creating a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'jhon.doe@gmail.com',
        firstName: 'Jhon',
        lastName: 'Doe',
        password: 'jhondoe',
        age: "20"
      };
      const newUser: User = {
        id: 1,
        age: "20",
        ...createUserDto,
        password: 'hashedPassword', // Mocked hashed password
        roles: ['CLIENT'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      jest.spyOn(argon2, 'hash').mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValueOnce(newUser);
      
      const result = await service.create(createUserDto);
      expect(result.password).toBe('hashedPassword');
      expect(argon2.hash).toHaveBeenCalledWith('jhondoe');
    });

    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'jhon.doe@gmail.com',
        firstName: 'Jhon',
        lastName: 'Doe',
        password: 'jhondoe',
        age: "20"
      };
      const newUser: User = {
        id: 1,
        age: "20",
        ...createUserDto,
        roles: ['CLIENT'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.user.create.mockResolvedValueOnce(newUser);
      expect(await service.create(createUserDto)).toEqual(newUser);
    });
  });

  

  describe('findOneByEmail', () => {
    it('should return a user', async () => {
      const existingEmail = 'jhon.doe@gmail.com';
      const existingUser: User = {
        id: 1,
        age: "20",
        email: 'jhon.doe@gmail.com',
        firstName: 'Jhon',
        lastName: 'Doe',
        password: 'jhondoe',
        roles: ['CLIENT'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prisma.user.findUnique.mockResolvedValueOnce(existingUser);
      expect(await service.findOneByEmail(existingEmail)).toEqual(existingUser);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return null if user is not found', async () => {
    const nonExistentEmail = 'nonexistent@example.com';
    prisma.user.findUnique.mockResolvedValueOnce(null);
    const result = await service.findOneByEmail(nonExistentEmail);
    expect(result).toBeNull();
  });
});
