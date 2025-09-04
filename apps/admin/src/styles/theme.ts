import { alpha, createTheme } from '@mui/material';

import {
	BACKGROUND_DEFAULT,
	BACKGROUND_LIGHT,
	BACKGROUND_LIGHTER,
	DARK,
	DARK_BACKGROUND_DEFAULT,
	DARK_GREY,
	DARK_PRIMARY_KEY,
	DARK_TEXT_KEY,
	DEFAULT_MAIN,
	ERROR_DARKER,
	ERROR_LIGHTER,
	ERROR_MAIN,
	GREY,
	INFO_DARKER,
	INFO_LIGHTER,
	INFO_MAIN,
	PRIMARY_BASIC,
	PRIMARY_CONTRAST,
	PRIMARY_DARK,
	PRIMARY_DARKER,
	PRIMARY_KEY,
	PRIMARY_LIGHT,
	PRIMARY_MAIN,
	SECONDARY_BASIC,
	SECONDARY_LIGHT,
	SECONDARY_MAIN,
	SUCCESS_DARK,
	SUCCESS_MAIN,
	TEXT_DISABLED,
	TEXT_KEY,
	TEXT_PRIMARY,
	TEXT_QUATERNARY,
	TEXT_SECONDARY,
	TEXT_TERTIARY,
	WARNING_DARK,
	WARNING_MAIN,
	WHITE,
} from '@/shared/constants/colors';

import { responsiveTheme } from './responsiveTheme';
declare module '@mui/material/styles/createMixins' {
	interface Mixins {
		scrollbar: CSSProperties;
	}
}

/**
 * 在 palette 自訂一個客製化屬性，如下：
 * custom: {
 * 	main: 'red',
 * 	customColor: 'blue',
 * }
 *
 * declare module @mui/material/style 意思是找出 @mui/material/style 這個套件的模組
 * 在裡面寫跟模組相同的 interface 名稱就會與 Mui 本身的 interface 合併
 * 再將自定的 key 如下格式加入
 * 使用 PaletteOptions['primary'] 是 Mui 定義過的物件結構如 main,light, dark, contrastText
 * 使用 Custom 可自訂 key
 * 使用 Partial<TypeText> 是 Mui 定義過的物件結構如 primary, secondary, disabled
 */
declare module '@mui/material/styles' {
	// custom start
	interface Theme {
		mode: 'dark' | 'light';
	}
	interface ThemeOptions {
		mode?: 'dark' | 'light';
	}
	interface CustomOptions {
		custom: string;
	}
	interface Palette {
		default: PaletteOptions['primary'];
		custom1: Partial<TypeText>;
		custom2: PaletteOptions['primary'];
		custom3: CustomOptions;
	}
	interface PaletteOptions {
		default?: PaletteOptions['primary'];
		custom1?: Partial<TypeText>;
		custom2?: PaletteOptions['primary'];
		custom3?: CustomOptions;
	}
	// SimplePaletteColorOptions跟PaletteColor可針對mui的原type增加自訂屬性 但會讓所有使用這兩個type的mui都多新屬性
	// 原屬性為main,light,dark,contrastText
	interface SimplePaletteColorOptions {
		basic?: string;
		key?: string;
		contrast?: string;
		important?: string;
		light?: string;
		lighter?: string;
		dark?: string;
		darker?: string;
	}
	interface PaletteColor {
		basic: string;
		key: string;
		contrast: string;
		important: string;
	}
	// // custom end

	// text顏色擴充
	interface TypeText {
		tertiary: string;
		quaternary: string;
		key: string;
	}

	// background顏色擴充
	interface TypeBackground {
		light: string;
		lighter: string;
	}
	interface BreakpointOverrides {
		xs: true;
		sm: true;
		smmd: true;
		md: true;
		lg: true;
		xl: false;
	}
}

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		default: true;
	}
}

declare module '@mui/material/SvgIcon' {
	interface SvgIconPropsColorOverrides {
		default: true;
	}
}

declare module '@mui/material/TextField' {
	interface TextFieldPropsColorOverrides {
		default: true;
	}
}

// Create a theme instance.
const customTheme = createTheme({
	mode: 'light', // custom mode
	components: {
		MuiButton: {
			// default props
			defaultProps: {
				disableElevation: true,
				// disableRipple: true,
			},
			styleOverrides: {
				// root is global button styles
				root: {
					borderRadius: 8,
					textTransform: 'none',
				},
				contained: {
					color: WHITE,
				},
				containedInfo: {
					color: WHITE,
				},
				containedWarning: {
					color: WHITE,
				},
				containedSuccess: {
					color: WHITE,
				},
				containedError: {
					color: WHITE,
				},
				outlined: {
					fontWeight: 700,
				},
				text: {
					fontWeight: 400,
				},
				sizeLarge: {
					padding: '11px 22px',
					height: 48,
				},
				sizeMedium: {
					padding: '6px 16px',
					height: 36,
				},
				sizeSmall: {
					padding: '4px 10px',
					height: 30,
				},
			},
		},
		MuiTooltip: {
			defaultProps: {
				arrow: true,
			},
			styleOverrides: {
				tooltip: {
					backgroundColor: DARK_GREY,
					fontSize: 14,
					lineHeight: '22px',
					fontWeight: 400,
				},
				arrow: {
					color: DARK_GREY,
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: 8,
				},
				notchedOutline: {
					transition: 'border-color 0.2s ease-in-out',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				elevation1: {
					boxShadow: `0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)`,
				},
			},
		},
		MuiPopover: {
			styleOverrides: {
				paper: {
					boxShadow: ` -20px 20px 40px -4px rgba(145, 158, 171, 0.24)`,
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					maxHeight: 'calc(100% - 96px)',
					maxWidth: 'calc(100% - 160px)',
					borderRadius: 16,
				},
				paperFullScreen: {
					maxHeight: '100%',
					maxWidth: '100%',
					borderRadius: 0,
				},
			},
		},
	},
	typography: {
		fontFamily: ['Public Sans', 'Helvetica', 'sans-serif'].join(','),
		h1: {
			fontSize: 64,
			lineHeight: '80px',
			fontWeight: 800,
		},
		h2: {
			fontSize: 48,
			lineHeight: '64px',
			fontWeight: 800,
		},
		h3: {
			fontSize: 32,
			lineHeight: '48px',
			fontWeight: 700,
		},
		h4: {
			fontSize: 24,
			lineHeight: '36px',
			fontWeight: 700,
		},
		h5: {
			fontSize: 20,
			lineHeight: '30px',
			fontWeight: 700,
		},
		h6: {
			fontSize: 18,
			lineHeight: '28px',
			fontWeight: 700,
		},
		subtitle1: {
			fontSize: 16,
			lineHeight: '24px',
			fontWeight: 600,
		},
		subtitle2: {
			fontSize: 14,
			lineHeight: '22px',
			fontWeight: 600,
		},
		body1: {
			fontSize: 16,
			lineHeight: '24px',
			fontWeight: 400,
		},
		body2: {
			fontSize: 14,
			lineHeight: '22px',
			fontWeight: 400,
		},
		caption: {
			fontSize: 12,
			lineHeight: '18px',
			fontWeight: 400,
		},
		overline: {
			fontSize: 12,
			lineHeight: '18px',
			fontWeight: 700,
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 376,
			smmd: 600,
			md: 1024,
			lg: 1280,
		},
	},
	palette: {
		primary: {
			main: PRIMARY_MAIN,
			light: PRIMARY_LIGHT,
			// TODO: review Mui custom settings (now hover button bg color has issue)
			// dark: PRIMARY_DARK,
			basic: PRIMARY_BASIC,
			key: PRIMARY_KEY,
			// important: '',
			contrast: PRIMARY_CONTRAST,
			dark: PRIMARY_DARK,
			darker: PRIMARY_DARKER,
		},
		secondary: {
			light: SECONDARY_LIGHT,
			main: SECONDARY_MAIN,
			// TODO: review Mui custom settings (now hover button bg color has issue)
			// dark: '',
			basic: SECONDARY_BASIC,
			// key: '',
			// important: '',
			// contrast: '',
		},
		error: {
			lighter: ERROR_LIGHTER,
			main: ERROR_MAIN,
			darker: ERROR_DARKER,
		},
		info: {
			lighter: INFO_LIGHTER,
			main: INFO_MAIN,
			darker: INFO_DARKER,
		},
		warning: {
			main: WARNING_MAIN,
			dark: WARNING_DARK,
		},
		success: {
			main: SUCCESS_MAIN,
			dark: SUCCESS_DARK,
		},
		default: {
			//  button, icon necessary
			main: DEFAULT_MAIN,
		},
		background: {
			// page's background, mui auto setting on body,
			default: BACKGROUND_DEFAULT,
			light: BACKGROUND_LIGHT,
			lighter: BACKGROUND_LIGHTER,
		},
		text: {
			primary: TEXT_PRIMARY,
			secondary: TEXT_SECONDARY,
			tertiary: TEXT_TERTIARY,
			quaternary: TEXT_QUATERNARY,
			key: TEXT_KEY,
			disabled: TEXT_DISABLED,
		},
		grey: {
			'100': alpha(GREY, 0.12),
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
	mixins: {
		scrollbar: {
			'::-webkit-scrollbar': {
				width: 6,
				height: 6,
			},
			'::-webkit-scrollbar-thumb': {
				background: '#CECECE',
				borderRadius: 4,

				'&:hover': {
					background: '#868E96',
				},
			},
		},
	},
});

// Create a theme instance.
const customDarkTheme = createTheme({
	mode: 'dark', // custom mode
	components: {
		MuiButton: {
			// default props
			defaultProps: {
				disableElevation: true,
				// disableRipple: true,
			},
			styleOverrides: {
				// root is global button styles
				root: {
					borderRadius: 8,
					textTransform: 'none',
				},
				contained: {
					color: DARK,
				},
				containedInfo: {
					color: DARK,
				},
				containedWarning: {
					color: DARK,
				},
				containedSuccess: {
					color: DARK,
				},
				containedError: {
					color: DARK,
				},
				outlined: {
					fontWeight: 700,
				},
				text: {
					fontWeight: 400,
				},
				sizeLarge: {
					padding: '11px 22px',
					height: 48,
				},
				sizeMedium: {
					padding: '6px 16px',
					height: 36,
				},
				sizeSmall: {
					padding: '4px 10px',
					height: 30,
				},
			},
		},
		MuiTooltip: {
			defaultProps: {
				arrow: true,
			},
			styleOverrides: {
				tooltip: {
					backgroundColor: DARK_GREY,
					fontSize: 14,
					lineHeight: '22px',
					fontWeight: 400,
				},
				arrow: {
					color: DARK_GREY,
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					borderRadius: 8,
				},
				notchedOutline: {
					transition: 'border-color 0.2s ease-in-out',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				elevation1: {
					boxShadow: `0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)`,
				},
			},
		},
		MuiPopover: {
			styleOverrides: {
				paper: {
					boxShadow: ` -20px 20px 40px -4px rgba(145, 158, 171, 0.24)`,
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					maxHeight: 'calc(100% - 96px)',
					maxWidth: 'calc(100% - 160px)',
					borderRadius: 16,
				},
				paperFullScreen: {
					maxHeight: '100%',
					maxWidth: '100%',
					borderRadius: 0,
				},
			},
		},
	},
	typography: {
		fontFamily: ['Public Sans', 'Helvetica', 'sans-serif'].join(','),
		h1: {
			fontSize: 64,
			lineHeight: '80px',
			fontWeight: 800,
		},
		h2: {
			fontSize: 48,
			lineHeight: '64px',
			fontWeight: 800,
		},
		h3: {
			fontSize: 32,
			lineHeight: '48px',
			fontWeight: 700,
		},
		h4: {
			fontSize: 24,
			lineHeight: '36px',
			fontWeight: 700,
		},
		h5: {
			fontSize: 20,
			lineHeight: '30px',
			fontWeight: 700,
		},
		h6: {
			fontSize: 18,
			lineHeight: '28px',
			fontWeight: 700,
		},
		subtitle1: {
			fontSize: 16,
			lineHeight: '24px',
			fontWeight: 600,
		},
		subtitle2: {
			fontSize: 14,
			lineHeight: '22px',
			fontWeight: 600,
		},
		body1: {
			fontSize: 16,
			lineHeight: '24px',
			fontWeight: 400,
		},
		body2: {
			fontSize: 14,
			lineHeight: '22px',
			fontWeight: 400,
		},
		caption: {
			fontSize: 12,
			lineHeight: '18px',
			fontWeight: 400,
		},
		overline: {
			fontSize: 12,
			lineHeight: '18px',
			fontWeight: 700,
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 376,
			smmd: 600,
			md: 1024,
			lg: 1280,
		},
	},
	palette: {
		primary: {
			main: PRIMARY_MAIN,
			light: PRIMARY_LIGHT,
			dark: PRIMARY_DARK,
			basic: PRIMARY_BASIC,
			key: DARK_PRIMARY_KEY,
			// important: '',
			contrast: PRIMARY_CONTRAST,
		},
		secondary: {
			light: SECONDARY_LIGHT,
			main: SECONDARY_MAIN,
			dark: '',
			basic: SECONDARY_BASIC,
			// key: '',
			// important: '',
			// contrast: '',
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
		default: {
			//  button, icon necessary
			main: DEFAULT_MAIN,
		},
		background: {
			// page's background, mui auto setting on body,
			default: DARK_BACKGROUND_DEFAULT,
		},
		text: {
			primary: TEXT_PRIMARY,
			secondary: TEXT_SECONDARY,
			tertiary: TEXT_TERTIARY,
			quaternary: TEXT_QUATERNARY,
			key: DARK_TEXT_KEY,
			disabled: TEXT_DISABLED,
		},
		grey: {
			'100': alpha('#919EAB', 0.12),
			'200': '#F4F6F8',
			'300': '#DFE3E8',
			'400': '#C4CDD5',
			'500': '#919EAB',
			'600': '#637381',
			'700': '#454F5B',
			'800': '#212B36',
			'900': '#161C24',
		},
		// custom1: {
		//   primary: 'custom color',
		// },
		// custom2: {
		//   main: 'custom color',
		// },
		// custom3: {
		//   custom: 'custom color',
		// },
	},
	mixins: {
		scrollbar: {
			'::-webkit-scrollbar': {
				width: 6,
				height: 6,
			},
			'::-webkit-scrollbar-thumb': {
				background: '#CECECE',
				borderRadius: 4,

				'&:hover': {
					background: '#868E96',
				},
			},
		},
	},
});

const theme = responsiveTheme(customTheme);
const darkTheme = responsiveTheme(customDarkTheme);

export { theme, darkTheme };
