import type { Metadata } from 'next';
import { Noto_Sans_TC, Poppins } from 'next/font/google';

import MainLayout from '@/components/Layout/MainLayout';

import CustomProvider from './provider';

import '@/styles/globals.css';
// Toastify Styles
import '@/styles/react-toastify.min.css';

const notoSansTC = Noto_Sans_TC({
	weight: ['400', '500', '700'],
	variable: '--font-noto-sans-tc',
	display: 'swap',
	subsets: ['cyrillic', 'latin', 'latin-ext', 'vietnamese'],
});

const poppins = Poppins({
	weight: ['400', '500', '700'],
	variable: '--font-poppins',
	display: 'swap',
	subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
	title: 'CitySki 城市滑雪',
	description: 'CitySki 城市滑雪學校- 台中最好玩的滑雪學校！',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${notoSansTC.variable} ${poppins.variable} antialiased overflow-hidden`}>
				<CustomProvider>
					<MainLayout>{children}</MainLayout>
				</CustomProvider>
			</body>
		</html>
	);
}
