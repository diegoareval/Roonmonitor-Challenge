import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ExposedEndpoint } from '../../decorators/exposed-endpoint.decorator';
import { SignInEmailDto } from './dto/sign-in-email.dto';

@ApiTags('Authentication')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Authenticate using your email & password',
  })
  @Post('login-email')
  @ExposedEndpoint()
  async loginEmail(@Body() signInEmailDto: SignInEmailDto) {
    return this.authService.signInWithEmail(signInEmailDto);
  }

  @ApiOperation({
    summary: 'Create a brand new account',
  })
  @Post('register')
  @ExposedEndpoint()
  async register(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Returns success, JWT should be removed in the client-side',
  })
  @Post('logout')
  async logout() {
    return this.authService.signOut();
  }
}
