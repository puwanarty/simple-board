import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, getPostsQuery } from './post.dto';
import { UserEntity } from 'src/user/user.dto';
import { User } from 'src/user/user.decorator';
import { Prisma } from '@prisma/client';
import { CommentService } from 'src/comment/comment.service';
import { CreateCommentDto } from 'src/comment/comment.dto';
import { Public } from 'src/auth/auth.decorator';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  @Public()
  @Get()
  async getPosts(@Query() query: getPostsQuery) {
    const { q, community } = query;

    const args: Prisma.PostFindManyArgs = {
      where: {
        ...(q?.length >= 2 && { title: { contains: q, mode: 'insensitive' } }),
        ...(community && { community }),
      },
    };

    return this.postService.getPosts(args);
  }

  @Get('me')
  async getPostsByUser(@User() user: UserEntity, @Query() query: getPostsQuery) {
    const { q, community } = query;

    const args: Prisma.PostFindManyArgs = {
      where: {
        user: { username: user.username },
        ...(q && q.length >= 2 && { title: { contains: q, mode: 'insensitive' } }),
        ...(community && { community }),
      },
    };

    return this.postService.getPosts(args);
  }

  @Post()
  async createPost(@User() user: UserEntity, @Body() data: CreatePostDto) {
    const { username } = user;

    const dto: Prisma.PostCreateInput = { ...data, user: { connect: { username } } };

    return this.postService.createPost(dto);
  }

  @Public()
  @Get(':id')
  async getPost(@Param('id') id: string) {
    const post = await this.postService.getPost(id);

    if (!post) throw new NotFoundException();

    return post;
  }

  @Public()
  @Get(':id/comment')
  async getComments(@Param('id') id: string) {
    const args: Prisma.CommentFindManyArgs = { where: { postId: id } };

    return this.commentService.getComments(args);
  }

  @Post(':id/comment')
  async createComment(@User() user: UserEntity, @Body() data: CreateCommentDto, @Param('id') id: string) {
    const { username } = user;

    const dto: Prisma.CommentCreateInput = { ...data, user: { connect: { username } }, post: { connect: { id } } };

    return this.commentService.createComment(dto);
  }

  @Put(':id')
  async updatePost(@User() user: UserEntity, @Body() data: CreatePostDto, @Param('id') id: string) {
    const post = await this.postService.getPost(id);

    if (!post) throw new NotFoundException();

    if (post.userId !== user.sub) throw new UnauthorizedException();

    const dto: Prisma.PostUpdateInput = { ...data };

    return this.postService.updatePost(id, dto);
  }

  @Put(':id/comment/:commentId')
  async updateComment(@User() user: UserEntity, @Body() data: CreateCommentDto, @Param('commentId') commentId: string) {
    const comment = await this.commentService.getComment(commentId);

    if (!comment) throw new NotFoundException();

    if (comment.userId !== user.sub) throw new UnauthorizedException();

    const dto: Prisma.CommentUpdateInput = { ...data };

    return this.commentService.updateComment(commentId, dto);
  }

  @Delete(':id')
  async deletePost(@User() user: UserEntity, @Param('id') id: string) {
    const post = await this.postService.getPost(id);

    if (!post) throw new NotFoundException();

    if (post.userId !== user.sub) throw new UnauthorizedException();

    return this.postService.deletePost(id);
  }

  @Delete(':id/comment/:commentId')
  async deleteComment(@User() user: UserEntity, @Param('commentId') commentId: string) {
    const comment = await this.commentService.getComment(commentId);

    if (!comment) throw new NotFoundException();

    if (comment.userId !== user.sub) throw new UnauthorizedException();

    return this.commentService.deleteComment(commentId);
  }
}
