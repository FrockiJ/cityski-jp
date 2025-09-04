'use client';
import { Provider } from 'react-redux';

import { store } from '@/state/store';

// import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
// import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
// import { theme } from '@/styles/theme';

// Refer to the following link
// https://v5.mui.com/material-ui/integrations/nextjs/#app-router
const CustomProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<Provider store={store}>
			{children}
			{/* <AppRouterCacheProvider options={{ key: 'css', enableCssLayer: true }}>
				<StyledEngineProvider injectFirst>
					<ThemeProvider theme={theme}>{children}</ThemeProvider>
				</StyledEngineProvider>
			</AppRouterCacheProvider> */}
		</Provider>
	);
};
export default CustomProvider;
