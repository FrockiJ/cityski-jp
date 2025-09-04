import { HttpMethod } from '@repo/shared';
import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios';
import NProgress from 'nprogress';

import { store } from '@/state/store';

import { refreshAccessToken } from '../handler';
import type { HttpInterceptors, HttpRequestConfig } from '../types';

import HttpError from './HttpError';

/**
 * 目標：
 * ．可重複實體化，各個實體 config 獨立 (專案可能會有多個請求網址 or 獨立的實體欄截器)
 * ．可自定義 interceptors
 * ．API 直接回傳 BE 的資料
 */

const DEFAULT_LOADING = true;

/**
 * @description - Axios 封裝
 * @export
 * @class Http
 */
export default class Http {
	private instance: AxiosInstance; // axios 實體
	private interceptors?: HttpInterceptors; // axios 攔截器
	showLoading?: boolean; // axios 發出請求及回應時的載入狀態

	// 初始化
	constructor(config: HttpRequestConfig) {
		this.instance = axios.create(config);
		this.interceptors = config.interceptors;
		this.showLoading = config.showLoading ?? DEFAULT_LOADING;

		// 如果 this.interceptors 存在，就處理傳入的攔截器 - 請求
		this.instance.interceptors.request.use(
			this.interceptors?.requestInterceptor,
			this.interceptors?.requestInterceptorCatch,
		);

		// 如果 this.interceptors 存在，就處理傳入的攔截器 - 回應
		this.instance.interceptors.response.use(
			this.interceptors?.responseInterceptor,
			this.interceptors?.responseInterceptorCatch,
		);

		// 處理所有 new 實體的請求欄截器
		this.instance.interceptors.request.use(
			(config) => {
				// 如果 this.showLoading 存在
				if (this.showLoading) NProgress.configure({ showSpinner: false }).start();

				const accessToken = store.getState().auth.accessToken;

				// 如果 accessToken 存在
				if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;

				return config;
			},
			(error) => error,
		);

		// 處理所有 new 實體的回應欄截器
		this.instance.interceptors.response.use(
			(res) => {
				// 如果 this.showLoading 存在
				if (this.showLoading) NProgress.configure({ showSpinner: false }).done();
				return res;
			},
			async (error) => {
				// console.log({ error });
				// 如果 this.showLoading 存在
				if (this.showLoading) NProgress.configure({ showSpinner: false }).done();

				const config = error?.config;

				// 如果回應是 401 Unauthorized 且前一個請求還沒重試
				if (error.response?.data.statusCode === HttpStatusCode.Unauthorized && !config?.sent) {
					console.log('如果回應是 401 Unauthorized 且前一個請求還沒重試');
					config.sent = true;

					try {
						// 獲取新的 accessToken
						const newAccessToken = await refreshAccessToken();

						// 如果有新 accessToken，將其添加到標頭中並重試請求
						if (newAccessToken) {
							config.headers['Authorization'] = `Bearer ${newAccessToken}`;
							return this.instance(config); // 重試請求
						}
					} catch (refreshError) {
						console.error('Error refreshing accessToken:', refreshError);
					}
				}
				return Promise.reject(error);
			},
		);
	}

	/**
	 * @description 封裝請求函式，獨立的欄截器
	 * @param {HttpConfig} config
	 * @memberof HTTP
	 */
	private requestApi<TData>(config: HttpRequestConfig) {
		return new Promise<TData>(async (resolve, reject) => {
			// 處理顯示 loading 的狀態，false 就是顯示圖標
			if (config.showLoading === false) {
				this.showLoading = false;
			}

			try {
				this.showLoading = DEFAULT_LOADING;
				const res = await this.instance.request(config);
				resolve(res.data);
			} catch (error) {
				NProgress.configure({ showSpinner: false }).done();

				// 可定義 error 時的 schema，最建議的方式要請 BE 統一回傳錯誤格式
				if (error instanceof AxiosError) {
					if (typeof error.response?.data.message === 'object') {
						if (Array.isArray(error.response?.data.message)) {
							reject(
								new HttpError({
									error: error.code ?? '錯誤',
									message: error.response?.data.message.toString(),
									statusCode: error.response?.data.message.statusCode,
								}),
							);
						} else {
							reject(
								new HttpError({
									error: error.response?.data.message.error,
									message: error.response?.data.message.message,
									statusCode: error.response?.data.message.statusCode,
								}),
							);
						}
					} else {
						reject(
							new HttpError({
								error: error.name,
								message: error.response?.data.message,
								statusCode: error.response?.data.statusCode,
							}),
						);
					}
				} else {
					// 其他未涵蓋的錯誤訊息
					reject(
						new HttpError({
							error: '錯誤',
							message: '發生錯誤，請稍候重試或聯繫系統管理員。',
							statusCode: 999,
						}),
					);
				}
			}
		});
	}

	public async get<TData = any, TParams = any>(path: string, params?: TParams, config?: HttpRequestConfig) {
		return this.requestApi<TData>({ ...config, url: path, params, method: HttpMethod.GET });
	}

	public async delete<TData = any, TParams = any>(path: string, params?: TParams, config?: HttpRequestConfig) {
		return this.requestApi<TData>({ ...config, url: path, params, method: HttpMethod.DELETE });
	}

	public async post<TData = any, TPayload = any>(path: string, payload?: TPayload, config?: HttpRequestConfig) {
		return this.requestApi<TData>({ ...config, url: path, data: payload, method: HttpMethod.POST });
	}

	public async put<TData = any, TPayload = any>(path: string, payload?: TPayload, config?: HttpRequestConfig) {
		return this.requestApi<TData>({ ...config, url: path, data: payload, method: HttpMethod.PUT });
	}

	public async patch<TData = any, TPayload = any>(path: string, payload?: TPayload, config?: HttpRequestConfig) {
		return this.requestApi<TData>({ ...config, url: path, data: payload, method: HttpMethod.PATCH });
	}
}
