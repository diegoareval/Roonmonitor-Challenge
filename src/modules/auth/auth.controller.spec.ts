import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../database/prisma.module';
import { User } from '@prisma/client';
import { SignInEmailDto } from './dto/sign-in-email.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, UsersModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockToken'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('loginEmail', () => {
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

    const payload: SignInEmailDto = {
      email: 'example@example.com',
      password: '',
    };

    const result = {
      authenticatedUser: mockUser,
      accessToken: 'mockToken',
    };

    it('should sign a Jwt based on the user', async () => {
      jest
        .spyOn(service, 'signInWithEmail')
        .mockImplementation(() => Promise.resolve(result));
      expect(await controller.loginEmail(payload)).toEqual(result);
    });

    it('should throw a UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(service, 'signInWithEmail').mockImplementation(async () => {
        throw new UnauthorizedException('Invalid credentials');
      });
      await expect(service.signInWithEmail(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
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

    const payload: SignUpDto = {
      email: 'example@example.com',
      password: '',
      firstName: 'Jhon',
      lastName: 'Doe',
    };

    it('should return the user', async () => {
      jest
        .spyOn(service, 'signUp')
        .mockImplementation(() => Promise.resolve(mockUser));
      expect(await controller.register(payload)).toEqual(mockUser);
    });

    it('should throw a BadRequestException when email is in use', async () => {
      jest.spyOn(service, 'signUp').mockImplementation(async () => {
        throw new BadRequestException('Email is already in use');
      });
      await expect(controller.register(payload)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('logout', () => {
    it('should return a success message', async () => {
      jest
        .spyOn(service, 'signOut')
        .mockImplementation(() =>
          Promise.resolve({ message: 'User has been signed out.' }),
        );
      expect(await controller.logout()).toEqual({
        message: 'User has been signed out.',
      });
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
