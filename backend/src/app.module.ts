import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { CommentService } from './comment/comment.service';

@Module({
  imports: [UserModule, AuthModule, PostModule],
  controllers: [AppController, UserController, AuthController, PostController],
  providers: [
    AppService,
    UserService,
    PrismaService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    PostService,
    CommentService,
  ],
})
export class AppModule {}
