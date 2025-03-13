import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async getComments(args: Prisma.CommentFindManyArgs) {
    return this.prisma.comment.findMany({
      ...args,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { username: true } } },
    });
  }

  async getComment(id: string) {
    return this.prisma.comment.findUnique({
      where: { id },
      include: { user: { select: { username: true } } },
    });
  }

  async createComment(data: Prisma.CommentCreateInput) {
    return this.prisma.comment.create({ data });
  }

  async updateComment(id: string, data: Prisma.CommentUpdateInput) {
    return this.prisma.comment.update({ where: { id }, data });
  }

  async deleteComment(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
