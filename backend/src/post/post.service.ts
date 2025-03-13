import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getPosts(args: Prisma.PostFindManyArgs) {
    return this.prisma.post.findMany(args);
  }

  async getPost(id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async createPost(data: Prisma.PostCreateInput) {
    return this.prisma.post.create({ data });
  }

  async updatePost(id: string, data: Prisma.PostUpdateInput) {
    return this.prisma.post.update({ where: { id }, data });
  }

  async deletePost(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}
