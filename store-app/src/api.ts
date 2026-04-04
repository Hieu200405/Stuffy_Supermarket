import { Product, User } from "@stuffy/types";

const BASE_URL = "https://stuffy-backend-api.onrender.com/api";

const apiRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const settings = {
    ...options,
    credentials: 'include' as const,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${url}`, settings);
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  
  return data as T;
};

export const authApi = {
  login: (email: string, password: string): Promise<{ user: User }> => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string): Promise<{ user: User }> => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  logout: (): Promise<{ message: string }> => 
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
  me: (): Promise<User> => apiRequest('/auth/me'),
};

export const productApi = {
  getAll: (keyword = '', page = 1, category = 'All'): Promise<{ products: Product[], pages: number, total: number }> => 
    apiRequest(`/products?keyword=${keyword}&pageNumber=${page}&category=${category}`),
  getById: (id: string): Promise<Product> => apiRequest(`/products/${id}`),
  create: (product: Partial<Product>): Promise<Product> => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id: string, product: Partial<Product>): Promise<Product> => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  delete: (id: string): Promise<void> => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),
  addReview: (id: string, rating: number, comment: string): Promise<void> => apiRequest(`/products/${id}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
  }),
};

export const cartApi = {
  getCart: (): Promise<{ cartItems: any[] }> => apiRequest('/cart'),
  syncCart: (cartItems: any[]): Promise<void> => apiRequest('/cart', {
    method: 'POST',
    body: JSON.stringify({ cartItems }),
  }),
};

export const orderApi = {
  create: (order: any): Promise<any> => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  getById: (id: string): Promise<any> => apiRequest(`/orders/${id}`),
  getMyOrders: (): Promise<any[]> => apiRequest('/orders/myorders'),
  getAll: (): Promise<any[]> => apiRequest('/orders'),
};
