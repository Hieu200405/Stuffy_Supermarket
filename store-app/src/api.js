const BASE_URL = "https://stuffy-backend-api.onrender.com/api";

const apiRequest = async (url, options = {}) => {
  const settings = {
    ...options,
    credentials: 'include',
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
  
  return data;
};

export const authApi = {
  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (name, email, password) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  }),
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
  me: () => apiRequest('/auth/me'),
};

export const productApi = {
  getAll: (keyword = '', page = 1, category = 'All') => apiRequest(`/products?keyword=${keyword}&pageNumber=${page}&category=${category}`),
  getById: (id) => apiRequest(`/products/${id}`),
  create: (product) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id, product) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  delete: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),
  addReview: (id, rating, comment) => apiRequest(`/products/${id}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
  }),
};

export const cartApi = {
  getCart: () => apiRequest('/cart'),
  syncCart: (cartItems) => apiRequest('/cart', {
    method: 'POST',
    body: JSON.stringify({ cartItems }),
  }),
};

export const orderApi = {
  create: (order) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  getById: (id) => apiRequest(`/orders/${id}`),
  getMyOrders: () => apiRequest('/orders/myorders'),
  getAll: () => apiRequest('/orders'),
};
