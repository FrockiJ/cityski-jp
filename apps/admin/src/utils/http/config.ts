const BASE_URL = {
	development: process.env.NEXT_PUBLIC_DOMAIN ?? '',
	production: process.env.NEXT_PUBLIC_DOMAIN ?? '',
	test: process.env.NEXT_PUBLIC_DOMAIN ?? '',
} as const;

const TIME_OUT = {
	development: 1000 * 60 * 1,
	production: 1000 * 60 * 5,
	test: 1000,
} as const;

const WITH_CREDENTIALS = {
	development: false,
	production: true,
	test: false,
} as const;

// axios 配置
const config = {
	baseURL: BASE_URL[process.env.NODE_ENV],
	timeout: TIME_OUT[process.env.NODE_ENV], //指定請求超時的毫秒數值，預設為 0ms
	withCredentials: WITH_CREDENTIALS[process.env.NODE_ENV], // 跨域請求時，是否需要使用認證，預設為 false
};

export { BASE_URL, TIME_OUT, config };
