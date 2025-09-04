'use client';
import { alpha, createTheme } from '@mui/material/styles';

import {
	BACKGROUND_DEFAULT,
	ERROR_MAIN,
	GREY,
	PRIMARY_MAIN,
	SECONDARY_MAIN,
	SUCCESS_MAIN,
	TEXT_PRIMARY,
	WARNING_MAIN,
} from '@/shared/constants/colors';

// Create a theme instance.
let theme = createTheme({
	components: {
		MuiDialog: {
			styleOverrides: {
				paper: {
					maxHeight: 'calc(100% - 96px)',
					maxWidth: 'calc(100% - 160px)',
					borderRadius: '16px',
				},
				paperFullScreen: {
					maxHeight: '100%',
					maxWidth: '100%',
					borderRadius: '0px',
				},
			},
		},
	},
	palette: {
		primary: {
			main: PRIMARY_MAIN,
		},
		secondary: {
			main: SECONDARY_MAIN,
		},
		error: {
			main: ERROR_MAIN,
		},
		// info: {
		//   main: INFO_MAIN,
		// },
		warning: {
			main: WARNING_MAIN,
		},
		success: {
			main: SUCCESS_MAIN,
		},
		background: {
			// page's background, mui auto setting on body,
			default: BACKGROUND_DEFAULT,
		},
		text: {
			primary: TEXT_PRIMARY,
		},
		grey: {
			'100': alpha(GREY, 0.24),
			'200': '#F4F6F8',
			'300': '#DFE3E8',
			'400': '#C4CDD5',
			'500': '#919EAB',
			'600': '#637381',
			'700': '#454F5B',
			'800': '#212B36',
			'900': '#161C24',
		},
	},
});

export { theme };
