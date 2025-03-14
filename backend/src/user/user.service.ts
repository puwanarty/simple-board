import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async seed(): Promise<User[]> {
    const users = [{ username: 'admin' }, { username: 'johndoe' }, { username: 'janedoe' }];
    await this.prisma.user.createMany({ data: users });
    return this.prisma.user.findMany({ where: { username: { in: ['admin', 'johndoe', 'janedoe'] } } });
  }
}
