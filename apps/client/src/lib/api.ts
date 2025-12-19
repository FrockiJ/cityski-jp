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

// 防止重複處理 401 的標記
let isHandling401 = false;

// Response interceptor for error handling
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 處理所有 401 Unauthorized 錯誤
    if (error.response?.status === 401) {
      // 防止併發請求重複處理
      if (isHandling401) {
        return Promise.reject(error);
      }

      isHandling401 = true;

      // 1. 清除 Redux 中的認證資訊
      store.dispatch(setAuthToken(''));
      store.dispatch(setUserInfo(null));

      // 2. 清除 localStorage 中的認證資訊
      if (typeof window !== 'undefined') {
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('line_auth_state');
        localStorage.removeItem('line_auth_redirect');
      }

      // 3. 顯示確認對話框並等待使用者確認（但在登入頁不顯示）
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        // 使用 setTimeout 確保在主執行緒中顯示對話框
        setTimeout(() => {
          const confirmed = window.confirm('登入已過期，請重新登入。\n\n點擊「確定」前往登入頁面。');

          if (confirmed) {
            const currentPath = window.location.pathname;
            // 保留當前路徑作為 redirect 參數
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }

          // 重置標記
          isHandling401 = false;
        }, 0);
      } else if (typeof window !== 'undefined' && window.location.pathname === '/login') {
        // 如果已經在登入頁，直接重置標記
        isHandling401 = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
