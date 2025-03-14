import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Community, Prisma } from '@prisma/client';
import { CommentService } from '../comment/comment.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../user/user.dto';
import { PostController } from './post.controller';
import { CreatePostDto, getPostsQuery } from './post.dto';
import { PostService } from './post.service';

describe('PostController', () => {
  let controller: PostController;
  let postService: PostService;
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            getPosts: jest.fn(),
            getPost: jest.fn(),
            createPost: jest.fn(),
            updatePost: jest.fn(),
            deletePost: jest.fn(),
          },
        },
        {
          provide: CommentService,
          useValue: {
            getComments: jest.fn(),
            getComment: jest.fn(),
            createComment: jest.fn(),
            updateComment: jest.fn(),
            deleteComment: jest.fn(),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
    commentService = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPosts', () => {
    it('should return posts', async () => {
      const query: getPostsQuery = { q: 'test', community: Community.HISTORY };
      const result = [{ id: '1', title: 'Test Post' }];
      jest.spyOn(postService, 'getPosts').mockResolvedValue(result as any);

      expect(await controller.getPosts(query)).toBe(result);
    });
  });

  describe('getPost', () => {
    it('should return a post', async () => {
      const result = { id: '1', title: 'Test Post' };
      jest.spyOn(postService, 'getPost').mockResolvedValue(result as any);

      expect(await controller.getPost('1')).toBe(result);
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(postService, 'getPost').mockResolvedValue(null);

      await expect(controller.getPost('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPostsByUser', () => {
    it('should return posts by user', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const query: getPostsQuery = { q: 'test', community: Community.HISTORY };
      const result = [{ id: '1', title: 'Test Post', user: { username: 'testuser' } }];
      jest.spyOn(postService, 'getPosts').mockResolvedValue(result as any);

      expect(await controller.getPostsByUser(user, query)).toBe(result);
    });

    it('should return posts by user without query', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const query: getPostsQuery = {};
      const result = [{ id: '1', title: 'Test Post', user: { username: 'testuser' } }];
      jest.spyOn(postService, 'getPosts').mockResolvedValue(result as any);

      expect(await controller.getPostsByUser(user, query)).toBe(result);
    });

    it('should return posts by user with only community query', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const query: getPostsQuery = { community: Community.HISTORY };
      const result = [{ id: '1', title: 'Test Post', user: { username: 'testuser' } }];
      jest.spyOn(postService, 'getPosts').mockResolvedValue(result as any);

      expect(await controller.getPostsByUser(user, query)).toBe(result);
    });

    it('should return posts by user with only q query', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const query: getPostsQuery = { q: 'test' };
      const result = [{ id: '1', title: 'Test Post', user: { username: 'testuser' } }];
      jest.spyOn(postService, 'getPosts').mockResolvedValue(result as any);

      expect(await controller.getPostsByUser(user, query)).toBe(result);
    });
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const dto: CreatePostDto = { title: 'Test Post', content: 'Test Content', community: Community.HISTORY };
      const result = { id: '1', ...dto };
      jest.spyOn(postService, 'createPost').mockResolvedValue(result as any);

      expect(await controller.createPost(user, dto)).toBe(result);
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const dto: CreatePostDto = { title: 'Updated Post', content: 'Updated Content', community: Community.HISTORY };
      const result = { id: '1', ...dto };
      jest.spyOn(postService, 'getPost').mockResolvedValue({ id: '1', userId: '1' } as any as any);
      jest.spyOn(postService, 'updatePost').mockResolvedValue(result as any);

      expect(await controller.updatePost(user, dto, '1')).toBe(result);
    });

    it('should throw NotFoundException if post not found', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const dto: CreatePostDto = { title: 'Updated Post', content: 'Updated Content', community: Community.HISTORY };
      jest.spyOn(postService, 'getPost').mockResolvedValue(null);

      await expect(controller.updatePost(user, dto, '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const dto: CreatePostDto = { title: 'Updated Post', content: 'Updated Content', community: Community.HISTORY };
      jest.spyOn(postService, 'getPost').mockResolvedValue({ id: '1', userId: '2' } as any);

      await expect(controller.updatePost(user, dto, '1')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const result = { id: '1', title: 'Test Post' };
      jest.spyOn(postService, 'getPost').mockResolvedValue({ id: '1', userId: '1' } as any);
      jest.spyOn(postService, 'deletePost').mockResolvedValue(result as any);

      expect(await controller.deletePost(user, '1')).toBe(result);
    });

    it('should throw NotFoundException if post not found', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      jest.spyOn(postService, 'getPost').mockResolvedValue(null);

      await expect(controller.deletePost(user, '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      jest.spyOn(postService, 'getPost').mockResolvedValue({ id: '1', userId: '2' } as any);

      await expect(controller.deletePost(user, '1')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getComments', () => {
    it('should return comments', async () => {
      const result = [{ id: '1', content: 'Test Comment' }];
      jest.spyOn(commentService, 'getComments').mockResolvedValue(result as any);

      expect(await controller.getComments('1')).toBe(result);
    });
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const dto = { content: 'Test Comment' };
      const result = { id: '1', ...dto };
      jest.spyOn(commentService, 'createComment').mockResolvedValue(result as any);

      expect(await controller.createComment(user, dto, '1')).toBe(result);
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const dto = { content: 'Updated Comment' };
      const result = { id: '1', ...dto };
      jest.spyOn(commentService, 'getComment').mockResolvedValue({ id: '1', userId: '1' } as any);
      jest.spyOn(commentService, 'updateComment').mockResolvedValue(result as any);

      expect(await controller.updateComment(user, dto, '1')).toBe(result);
    });

    it('should throw NotFoundException if comment not found', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const dto = { content: 'Updated Comment' };
      jest.spyOn(commentService, 'getComment').mockResolvedValue(null);

      await expect(controller.updateComment(user, dto, '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const dto = { content: 'Updated Comment' };
      jest.spyOn(commentService, 'getComment').mockResolvedValue({ id: '1', userId: '2' } as any);

      await expect(controller.updateComment(user, dto, '1')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const result = { id: '1', content: 'Test Comment' };
      jest.spyOn(commentService, 'getComment').mockResolvedValue({ id: '1', userId: '1' } as any);
      jest.spyOn(commentService, 'deleteComment').mockResolvedValue(result as any);

      expect(await controller.deleteComment(user, '1')).toBe(result);
    });

    it('should throw NotFoundException if comment not found', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      jest.spyOn(commentService, 'getComment').mockResolvedValue(null);

      await expect(controller.deleteComment(user, '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      jest.spyOn(commentService, 'getComment').mockResolvedValue({ id: '1', userId: '2' } as any);

      await expect(controller.deleteComment(user, '1')).rejects.toThrow(UnauthorizedException);
    });
  });
});
