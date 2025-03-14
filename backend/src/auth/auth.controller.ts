import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';
import { User } from '../user/user.decorator';
import { UserEntity } from '../user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  async signIn(@Body('username') username: string) {
    return this.authService.signIn(username);
  }

  @Get('me')
  async me(@User() user: UserEntity) {
    return user;
  }
}
