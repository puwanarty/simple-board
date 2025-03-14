import { getCookie } from 'cookies-next';
import useSWR from 'swr';

interface ErrorResult {
  error: string;
  message: string[];
}

const fetcher = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching ${url}: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

const getToken = () => {
  const token = getCookie('access_token');

  if (!token) throw new Error('Unauthorized');

  return token;
};

export const get = <T>(url: string) => useSWR<T, ErrorResult>(url, fetcher);

export const post = async <T, D>(url: string, data: D): Promise<T | ErrorResult> => {
  const token = getToken();

  return fetcher(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
};

export const put = async <T, D>(url: string, data: D): Promise<T | ErrorResult> => {
  const token = getToken();

  return fetcher(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
};

export const del = async <T>(url: string): Promise<T | ErrorResult> => {
  const token = getToken();

  return fetcher(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};
