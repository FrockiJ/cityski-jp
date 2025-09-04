import { alpha, Chip, Theme } from '@mui/material';
import { styled } from '@mui/material';

/** Themes ******/

export const yellowTheme = {
	color: 'warning.dark',
	backgroundColor: (theme: Theme) => alpha(theme.palette.warning.main, 0.16),
};
export const redTheme = {
	color: 'error.dark',
	backgroundColor: (theme: Theme) => alpha(theme.palette.error.main, 0.16),
};
export const greenTheme = {
	color: 'success.dark',
	backgroundColor: (theme: Theme) => alpha(theme.palette.success.main, 0.16),
};
export const greyTheme = {
	color: 'text.primary',
	backgroundColor: (theme: Theme) => alpha(theme.palette.text.quaternary, 0.16),
};
export const blueTheme = {
	color: 'primary.main',
	backgroundColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.16),
};

/** Styles ******/

export const StyledChip = styled(Chip)(() => ({
	fontSize: '12px',
	fontWeight: 700,
	lineHeight: '20px',
	borderRadius: '6px',
	height: '20px',
}));
