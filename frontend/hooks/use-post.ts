import { Comment, CreatePost, Post } from '@/interfaces';
import { getCookie } from 'cookies-next';
import useSWR from 'swr';

interface ErrorResult {
  error: string;
  message: string[];
}

const usePost = () => {
  const fetcher = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, options);
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

  const get = <T>(url: string) => useSWR<T, ErrorResult>(url, fetcher);

  const post = async <T>(url: string, data: any): Promise<T | ErrorResult> => {
    const token = getCookie('access_token');

    if (!token) throw new Error('Unauthorized');

    return fetcher(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  };

  const put = async <T>(url: string, data: any): Promise<T | ErrorResult> => {
    const token = getCookie('access_token');

    if (!token) throw new Error('Unauthorized');

    return fetcher(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  };

  const getPosts = (query: string, community: string) =>
    get<Post[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/post?${query ? `q=${query}` : ''}${community ? `&community=${community}` : ''}`,
    );

  const getMyPosts = (query: string, community: string) =>
    get<Post[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/post/me?${query ? `q=${query}` : ''}${community ? `&community=${community}` : ''}`,
    );

  const getPost = (id: string) => get<Post>(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`);

  const getComments = (id: string) => get<Comment[]>(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}/comment`);

  const createPost = (data: CreatePost) => post<Post>(`${process.env.NEXT_PUBLIC_API_URL}/post`, data);

  const createComment = (id: string, content: string) =>
    post<Comment>(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}/comment`, { content });

  const updatePost = (id: string, data: CreatePost) => put<Post>(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, data);

  return { getPosts, getMyPosts, getPost, getComments, createPost, createComment, updatePost };
};

export default usePost;
