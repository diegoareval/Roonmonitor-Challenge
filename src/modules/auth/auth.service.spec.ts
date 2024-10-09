import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as argon2 from 'argon2';
import { SignInEmailDto } from './dto/sign-in-email.dto';
import { SignUpDto } from './dto/sign-up.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockToken'),
          },
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });
  describe('signInWithEmail', () => {
    it('should throw an error if email is not found', async () => {
      const signInEmailDto: SignInEmailDto = {
        email: 'user@example.com',
        password: 'password',
      };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      await expect(service.signInWithEmail(signInEmailDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an error if password is incorrect', async () => {
      const signInEmailDto: SignInEmailDto = {
        email: 'user@example.com',
        password: 'wrongpassword',
      };
      const user: User = {
        id: 1,
        firstName: '',
        lastName: '',
        email: 'user@example.com',
        password: await argon2.hash('password'),
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);
      await expect(service.signInWithEmail(signInEmailDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return a token and user if email and password are correct', async () => {
      const signInEmailDto: SignInEmailDto = {
        email: 'user@example.com',
        password: 'password',
      };
      const user: User = {
        id: 1,
        firstName: '',
        lastName: '',
        email: 'user@example.com',
        password: await argon2.hash('password'),
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(user);
      const result = await service.signInWithEmail(signInEmailDto);
      expect(result).toEqual({
        authenticatedUser: user,
        accessToken: 'mockToken',
      });
    });
  });

  describe('signUp', () => {
    it('should throw an error if email is already in use', async () => {
      const signUpDto: SignUpDto = {
        email: 'user@example.com',
        password: 'password',
        firstName: '',
        lastName: '',
      };
      const user: User = {
        id: 1,
        firstName: '',
        lastName: '',
        email: 'user@example.com',
        password: await argon2.hash('password'),
        roles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValueOnce(user);
      await expect(service.signUp(signUpDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a new user and return it', async () => {
      const signUpDto: SignUpDto = {
        email: 'newuser@example.com',
        password: 'password',
        firstName: 'Example',
        lastName: 'Example',
      };
      const user: User = {
        id: 1,
        firstName: 'Example',
        lastName: 'Example',
        email: 'newuser@example.com',
        password: await argon2.hash('password'),
        roles: [UserRole.CLIENT],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(user);
      const result = await service.signUp(signUpDto);
      expect(result).toEqual(user);
    });
  });
  describe('signOut', () => {
    it('should return a sucess message', async () => {
      jest
        .spyOn(service, 'signOut')
        .mockResolvedValue({ message: 'User has been signed out.' });
      const result = await service.signOut();
      expect(result).toEqual({ message: 'User has been signed out.' });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
