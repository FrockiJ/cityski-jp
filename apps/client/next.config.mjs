/** @type {import('next').NextConfig} */
import * as dotenvflow from 'dotenv-flow';
import * as path from 'path';
import { fileURLToPath } from 'url';

// esm module沒有提供全域__dirname，所以要自幾處理
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenvflow.config({
	path: path.join(__dirname, '../../'),
	// node_env: process.env.NODE_ENV || 'development',
});

const nextConfig = {
	reactStrictMode: false,
	// TODO: replace with the actual image CDN
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.builder.io',
				pathname: '/api/v1/image/assets/**',
			},
			{
				protocol: 'https',
				hostname: process.env.NEXT_PUBLIC_AWS_S3_URL?.replace('https://', '').replace('/', ''),
				pathname: '/**',
			},
		],
	},
	headers: async () => [
		{
			source: '/member',
			headers: [
				{
					key: 'Cache-Control',
					value: 'no-store, max-age=0',
				},
			],
		},
	],
};

export default nextConfig;
