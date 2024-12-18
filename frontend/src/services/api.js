import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000' });

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const register = (data) => API.post('/register', data);
export const login = (data) => API.post('/login', data);
export const fetchProfile = () => API.get('/profile');
export const fetchBooks = () => API.get('/books');

export const addBook = (data) => API.post('/books/add-book', data);
export const removeBook = (data) => API.post('/books/remove-book', data);
export const addToWishlist = (data) => API.post('/books/add-wishlist', data);
export const removeFromWishlist = (data) => API.post('/books/remove-wishlist', data);
export const addLikedBook = (data) => API.post('/profile/add-liked', data);
export const removeLikedBook = (data) => API.post('/profile/remove-liked', data);

export const fetchFollows = () => API.get("/follows");
export const fetchFollowers = () => API.get("/follows/followers");
export const fetchFollowing = () => API.get("/follows/following");
export const searchUsers = (query) => API.get(`/follows/search?query=${query}`);
export const followUser = (targetUser) => API.post("/follows/follow", { targetUser });
export const unfollowUser = (targetUser) => API.post("/follows/unfollow", { targetUser });
export const fetchFollowRecommendations = () => API.get("/follows/recommend-follows");