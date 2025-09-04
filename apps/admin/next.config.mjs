/** @type {import('next').NextConfig} */

import withBundleAnalyzer from '@next/bundle-analyzer';
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

// const env = {};
// Object.keys(process.env).forEach((key) => {
// 	if (key.startsWith('NEXT_PUBLIC_')) {
// 		env[key] = process.env[key];
// 	}
// });
const bundleAnalyzer = withBundleAnalyzer({
	reactStrictMode: false,
	enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
	...bundleAnalyzer,
	env: {
		GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
		GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID,
		AWS_S3_URL: process.env.AWS_S3_URL,
		// ...env,
	},
};

export default nextConfig;
