import { Provider } from 'react-redux';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import createEmotionCache from 'src/createEmotionCache';
import { theme } from 'src/styles/theme';

import AppLayout from '@/components/Layout/AppLayout';
import RouteGuard from '@/HOC/RouteGuard';
import { store } from '@/state/store';

import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/700.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/800.css';
import 'src/styles/globals.css';
import 'src/styles/nprogress.css';
import 'src/styles/react-toastify.min.css';
import 'src/styles/simplebar.css';

export interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache;
}

// handling removal of console.log in PRODUCTION
if (process.env.NODE_ENV === 'production') console.log = function () {};

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const ThemeComponent = (props: MyAppProps) => {
	const { Component, pageProps } = props;

	return (
		<ThemeProvider theme={theme}>
			<RouteGuard>
				<CssBaseline />
				<AppLayout>
					<Component {...pageProps} />
				</AppLayout>
			</RouteGuard>
		</ThemeProvider>
	);
};

const MyApp = (props: MyAppProps) => {
	const { emotionCache = clientSideEmotionCache } = props;

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<meta name='viewport' content='initial-scale=1, width=device-width' />
			</Head>
			<Provider store={store}>
				<ThemeComponent {...props} />
			</Provider>
		</CacheProvider>
	);
};

export default MyApp;
