import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string) {
    const user = await this.userService.findOne(username);

    if (!user) throw new UnauthorizedException();

    const dto = { sub: user.id, username: user.username };

    return { access_token: await this.jwtService.signAsync(dto) };
  }
}
