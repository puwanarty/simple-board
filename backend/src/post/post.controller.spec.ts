import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Community } from '@prisma/client';
import { CommentService } from '../comment/comment.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../user/user.dto';
import { PostController } from './post.controller';
import { CreatePostDto, getPostsQuery } from './post.dto';
import { PostService } from './post.service';

const DEFAULT_POST = {
  id: '1',
  title: 'Test Post',
  content: 'Test Content',
  community: Community.HISTORY,
  userId: '1',
  user: { username: 'testuser' },
  comments: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const DEFAULT_COMMENT = {
  id: '1',
  content: 'Test Comment',
  postId: '1',
  userId: '1',
  user: { username: 'testuser' },
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
      const result = [DEFAULT_POST];
      jest.spyOn(postService, 'getPosts').mockResolvedValue(result);

      expect(await controller.getPosts(query)).toBe(result);
    });
  });

  describe('getPost', () => {
    it('should return a post', async () => {
      const result = DEFAULT_POST;
      jest.spyOn(postService, 'getPost').mockResolvedValue(result);

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
      const result = [DEFAULT_POST];
      jest.spyOn(postService, 'getPosts').mockResolvedValue(result);

      expect(await controller.getPostsByUser(user, query)).toBe(result);
    });

    it('should return posts by user without query', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const query: getPostsQuery = {};
      const result = [DEFAULT_POST];
      jest.spyOn(postService, 'getPosts').mockResolvedValue(result);

      expect(await controller.getPostsByUser(user, query)).toBe(result);
    });

    it('should return posts by user with only community query', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const query: getPostsQuery = { community: Community.HISTORY };
      const result = [DEFAULT_POST];
      jest.spyOn(postService, 'getPosts').mockResolvedValue(result);

      expect(await controller.getPostsByUser(user, query)).toBe(result);
    });

    it('should return posts by user with only q query', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const query: getPostsQuery = { q: 'test' };
      const result = [DEFAULT_POST];
      jest.spyOn(postService, 'getPosts').mockResolvedValue(result);

      expect(await controller.getPostsByUser(user, query)).toBe(result);
    });
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const dto: CreatePostDto = { title: 'Test Post', content: 'Test Content', community: Community.HISTORY };
      const result = { ...DEFAULT_POST, ...dto };
      jest.spyOn(postService, 'createPost').mockResolvedValue(result);

      expect(await controller.createPost(user, dto)).toBe(result);
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const dto: CreatePostDto = { title: 'Updated Post', content: 'Updated Content', community: Community.HISTORY };
      const result = { ...DEFAULT_POST, ...dto };
      jest.spyOn(postService, 'getPost').mockResolvedValue({ ...DEFAULT_POST, ...dto });
      jest.spyOn(postService, 'updatePost').mockResolvedValue(result);

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
      jest.spyOn(postService, 'getPost').mockResolvedValue({ ...DEFAULT_POST, userId: '2' });

      await expect(controller.updatePost(user, dto, '1')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const result = { ...DEFAULT_POST };
      jest.spyOn(postService, 'getPost').mockResolvedValue(result);
      jest.spyOn(postService, 'deletePost').mockResolvedValue(result);

      expect(await controller.deletePost(user, '1')).toBe(result);
    });

    it('should throw NotFoundException if post not found', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      jest.spyOn(postService, 'getPost').mockResolvedValue(null);

      await expect(controller.deletePost(user, '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      jest.spyOn(postService, 'getPost').mockResolvedValue({ ...DEFAULT_POST, userId: '2' });

      await expect(controller.deletePost(user, '1')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getComments', () => {
    it('should return comments', async () => {
      const result = [DEFAULT_COMMENT];
      jest.spyOn(commentService, 'getComments').mockResolvedValue(result);

      expect(await controller.getComments('1')).toBe(result);
    });
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const dto = { content: 'Test Comment' };
      const result = { ...DEFAULT_COMMENT, ...dto };
      jest.spyOn(commentService, 'createComment').mockResolvedValue(result);

      expect(await controller.createComment(user, dto, '1')).toBe(result);
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const dto = { content: 'Updated Comment' };
      const result = { ...DEFAULT_COMMENT, ...dto };
      jest.spyOn(commentService, 'getComment').mockResolvedValue({ ...DEFAULT_COMMENT, ...dto });
      jest.spyOn(commentService, 'updateComment').mockResolvedValue(result);

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
      const dto = { ...DEFAULT_COMMENT, content: 'Updated Comment' };
      jest.spyOn(commentService, 'getComment').mockResolvedValue({ ...DEFAULT_COMMENT, userId: '2' });

      await expect(controller.updateComment(user, dto, '1')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      const result = { ...DEFAULT_COMMENT, id: '1', content: 'Test Comment' };
      jest
        .spyOn(commentService, 'getComment')
        .mockResolvedValue({ ...DEFAULT_COMMENT, id: '1', content: 'Test Comment' });
      jest.spyOn(commentService, 'deleteComment').mockResolvedValue(result);

      expect(await controller.deleteComment(user, '1')).toBe(result);
    });

    it('should throw NotFoundException if comment not found', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      jest.spyOn(commentService, 'getComment').mockResolvedValue(null);

      await expect(controller.deleteComment(user, '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const user: UserEntity = { username: 'testuser', sub: '1' };
      jest.spyOn(commentService, 'getComment').mockResolvedValueOnce({ ...DEFAULT_COMMENT, userId: '2' });
      jest.spyOn(commentService, 'deleteComment').mockRejectedValueOnce(new UnauthorizedException());

      await expect(controller.deleteComment(user, '1')).rejects.toThrow(UnauthorizedException);
    });
  });
});
