import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * @description 攔截器類型
 * @export
 * @interface HttpInterceptors
 */
export interface HttpInterceptors {
	// 請求欄截 (接口請求成功)
	requestInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;

	// 請求欄截 (捕獲請求失敗)
	requestInterceptorCatch?: (err: any) => any;

	// 回應欄截 (接口回應成功)
	responseInterceptor?: (res: AxiosResponse) => AxiosResponse;

	// 回應欄截 (捕獲回應失敗)
	responseInterceptorCatch?: (err: any) => any;
}

/**
 * @description 請求配置類型，繼承來自 AxiosRequestConfig, 對 axios 擴充，同時會有實體欄截器，也可以對它傳入欄截器，還可以控制這個請求 loading 是否有需要顯示。
 * @export
 * @interface HttpConfig
 * @extends { AxiosRequestConfig }
 */
export interface HttpRequestConfig extends AxiosRequestConfig {
	interceptors?: HttpInterceptors; // 是否傳入欄截器
	showLoading?: boolean; // 是否顯示 loading 狀態
}

/**
 * @description 定義錯誤請求的資料格式。 (需與 BE 溝通協調)
 * @export
 * @interface ErrorResponse
 */
export interface ErrorResponse {
	error: string;
	message: string;
	statusCode: number;
}
