import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../auth/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Get('seed')
  async seed() {
    return this.userService.seed();
  }
}
