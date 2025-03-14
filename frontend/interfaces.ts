export interface User {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  posts: Post[];
  comments: Comment[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  community: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  postId: string;
  user: User;
  post: Post;
}

export interface CreatePost extends Pick<Post, 'title' | 'content' | 'community'> {}

export interface UpdatePost extends CreatePost {}

export interface CreateComment extends Pick<Comment, 'content'> {}
