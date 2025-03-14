import { Comment, CreateComment, CreatePost, Post, UpdatePost } from '@/interfaces';
import { del, get, getWithToken, post, put } from '@/utils/network';

const usePost = () => {
  const buildQueryString = (query: string, community: string) =>
    `${query ? `q=${query}` : ''}${community ? `&community=${community}` : ''}`;

  const getPosts = (query: string, community: string) =>
    get<Post[]>(`${process.env.NEXT_PUBLIC_API_URL}/post?${buildQueryString(query, community)}`);

  const getMyPosts = (query: string, community: string) =>
    getWithToken<Post[]>(`${process.env.NEXT_PUBLIC_API_URL}/post/me?${buildQueryString(query, community)}`);

  const getPost = (id: string) => get<Post>(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`);

  const getComments = (id: string) => get<Comment[]>(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}/comment`);

  const createPost = (data: CreatePost) => post<Post, CreatePost>(`${process.env.NEXT_PUBLIC_API_URL}/post`, data);

  const createComment = (id: string, data: CreateComment) =>
    post<Comment, CreateComment>(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}/comment`, data);

  const updatePost = (id: string, data: UpdatePost) =>
    put<Post, UpdatePost>(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, data);

  const removePost = (id: string) => del<Post>(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`);

  return { getPosts, getMyPosts, getPost, getComments, createPost, createComment, updatePost, removePost };
};

export default usePost;
