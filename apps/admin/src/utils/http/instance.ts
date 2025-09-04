import { store } from '@/state/store';
import Http from '@/utils/http/classes/Http';
import { BASE_URL, TIME_OUT } from '@/utils/http/config';

const accessToken = store.getState().auth.accessToken;

export const http = new Http({
	baseURL: BASE_URL[process.env.NODE_ENV],
	timeout: TIME_OUT[process.env.NODE_ENV],
	showLoading: true,
});

export const httpWithToken = new Http({
	baseURL: BASE_URL[process.env.NODE_ENV],
	timeout: TIME_OUT[process.env.NODE_ENV],
	showLoading: true,
	interceptors: {
		requestInterceptor(config) {
			if (config.headers && !config.headers['Authorization'] && accessToken) {
				config.headers['Authorization'] = `Bearer ${accessToken}`;
			}

			return config;
		},
		requestInterceptorCatch(err) {
			return err;
		},
		responseInterceptor(res) {
			return res;
		},
		async responseInterceptorCatch(err) {
			return err;
		},
	},
});

export default http;
