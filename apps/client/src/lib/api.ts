import axios from 'axios';
import { store } from '@/state/store';
import { setAuthToken, setUserInfo } from '@/state/slices/authSlice';
import { showToast } from '@/components/Project/Utils/Toast';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4040';

const instance = axios.create({
  baseURL,
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Enable sending cookies with requests
});

// 防止重複刷新 token 的標記
let isRefreshing = false;
// 等待刷新完成的請求佇列
let refreshSubscribers: ((token: string) => void)[] = [];

// 通知所有等待中的請求
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// 將請求加入等待佇列
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 刷新 token
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  try {
    const response = await axios.post(`${baseURL}/api/auth/refresh`, { refreshToken });
    const { result } = response.data;
    const { accessToken, refreshToken: newRefreshToken, userInfo } = result;

    if (accessToken) {
      store.dispatch(setAuthToken(accessToken));
      store.dispatch(setUserInfo(userInfo));

      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken);
      }

      return accessToken;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }

  return null;
};

// 清除認證資訊並導向登入頁
const handleAuthFailure = () => {
  store.dispatch(setAuthToken(''));
  store.dispatch(setUserInfo(null));

  if (typeof window !== 'undefined') {
    localStorage.removeItem('refresh_token');

    if (window.location.pathname !== '/login') {
      setTimeout(() => {
        const confirmed = window.confirm('登入已過期，請重新登入。\n\n點擊「確定」前往登入頁面。');
        if (confirmed) {
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }, 0);
    }
  }
};

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 處理 401 Unauthorized 錯誤
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 如果正在刷新 token，將請求加入等待佇列
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(instance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 嘗試刷新 token
        const newToken = await refreshAccessToken();

        if (newToken) {
          // 刷新成功，通知等待中的請求
          onRefreshed(newToken);
          isRefreshing = false;

          // 重試原請求
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return instance(originalRequest);
        } else {
          // 刷新失敗，清除認證並導向登入頁
          handleAuthFailure();
        }
      } catch (refreshError) {
        // 刷新失敗，清除認證並導向登入頁
        handleAuthFailure();
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
