import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000' });

// Add a request interceptor to include the token in headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

export const register = (data) => API.post('/register', data);
export const login = (data) => API.post('/login', data);
export const fetchProfile = () => API.get('/profile'); // No need to pass token explicitly
export const fetchBooks = () => API.get('/books'); // Token is added automatically

export const addBook = (data) => API.post('/books/add-book', data);
export const removeBook = (data) => API.post('/books/remove-book', data);
export const addToWishlist = (data) => API.post('/books/add-wishlist', data);
export const removeFromWishlist = (data) => API.post('/books/remove-wishlist', data);

export const addLikedBook = (data) => API.post('/profile/add-liked', data);
export const removeLikedBook = (data) => API.post('/profile/remove-liked', data);