import { Community } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum([Community.FOOD, Community.HISTORY, Community.OTHER])
  community: Community;
}

export class getPostsQuery {
  @IsOptional()
  @IsString()
  q: string;

  @IsOptional()
  @IsEnum([Community.FOOD, Community.HISTORY, Community.OTHER])
  community: Community;
}
