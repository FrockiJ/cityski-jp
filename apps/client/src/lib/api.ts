import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4040';

const instance = axios.create({ 
  baseURL,
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Enable sending cookies with requests
});

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login
    }
    return Promise.reject(error);
  }
);

export default instance;
