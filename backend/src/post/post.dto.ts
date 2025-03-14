import { Community } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
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
