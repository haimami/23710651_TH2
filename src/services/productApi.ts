import { useQuery } from '@tanstack/react-query';
import { STALE_TIME_MS } from '@constants/student';
import apiClient from './apiClient';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export const productApi = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products?limit=12');
    return response.data;
  },
  getProductById: async (id: string | number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },
};

export function useProductsQuery() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: productApi.getProducts,
    staleTime: STALE_TIME_MS,
  });
}

export default productApi;

