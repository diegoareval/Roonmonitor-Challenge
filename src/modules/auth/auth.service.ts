import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInEmailDto } from './dto/sign-in-email.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * It takes in a user's email and password, checks if the user exists, if the user exists, it checks
   * if the password is valid, if the password is valid, it signs a JWT token with the user's email,
   * role, and id, and returns the token and the user
   * @param {SignInEmailDto} signInEmailDto - SignInEmailDto
   * @returns An object with two properties: authenticatedUser and accessToken.
   */
  async signInWithEmail(signInEmailDto: SignInEmailDto) {
    const user = await this.usersService.findOneByEmail(signInEmailDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await argon2.verify(
      user.password,
      signInEmailDto.password,
    );
    /*
		if (user.verified === false) {
			throw new UnauthorizedException('Please verify your email');
		}
    */
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.jwtService.sign({
      email: user.email,
      roles: user.roles.toString(),
      sub: user.id,
    });
    return {
      authenticatedUser: user,
      accessToken: accessToken,
    };
  }

  /**
   * It takes a signUpDto object, checks if the email is already in use, and if not, creates a new user
   * @param {SignUpDto} signUpDto - SignUpDto - This is the DTO that we created earlier.
   * @returns A user object
   */
  async signUp(signUpDto: SignUpDto): Promise<User> {
    const existingUser = await this.usersService.findOneByEmail(
      signUpDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }
    return this.usersService.create({ ...signUpDto });
  }

  /**
   * It returns a promise that resolves to an object with a message property
   * @returns A promise that resolves to an object with a message property.
   */
  async signOut() {
    return { message: 'User has been signed out.' };
  }
}
