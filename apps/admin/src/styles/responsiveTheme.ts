import { createTheme, Theme } from '@mui/material';

/**
 * If you want to set up a responsive component
 * you can write it here
 */
export const responsiveTheme = (theme: Theme) => {
	return createTheme(theme, {
		components: {
			MuiTabs: {
				styleOverrides: {
					flexContainer: {
						gap: '40px',
						[theme.breakpoints.down('smmd')]: {
							gap: '24px',
						},
					},
				},
			},
		},
	});
};
