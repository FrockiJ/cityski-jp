import { GroupBase, StylesConfig } from 'react-select';
import { alpha, Box, BoxProps, styled, Theme } from '@mui/material';
import { SelectOption } from '@repo/shared';

interface StyledSelectProps extends BoxProps {
	width?: string | number;
	disabled?: boolean;
}

export const StyledSelectWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'disabled',
})<StyledSelectProps>(({ width = 240, disabled }) => ({
	width,
	maxWidth: '100%',

	'&:hover': {
		cursor: disabled ? 'not-allowed' : 'text',
	},
}));

export const customReactSelectStyles = (theme: Theme) => {
	const selectStyle: StylesConfig<SelectOption, boolean, GroupBase<SelectOption>> = {
		option: (_base, state) => ({
			display: 'flex',
			alignItems: 'center',
			margin: '0 8px',
			padding: 10,
			fontSize: 14,
			height: 34,
			cursor: 'pointer',
			color: '#212B36',
			backgroundColor: state.isSelected ? theme.palette.background.light : 'transparent',
			borderRadius: 6,
			'&:hover, &:active': {
				backgroundColor: '#F9FAFB',
			},
		}),
		menu: (base, state) => ({
			...base,
			gap: 4,
			zIndex: 1,
			position: 'absolute', // make scrollbar start at the top when scroll appears
			backgroundColor: theme.palette.primary.contrast,
			borderRadius: 4,
			padding: 0,
			width: '100%',
			bottom: state.menuPlacement === 'top' ? '40px' : 'auto',
			boxShadow: '-20px 20px 40px -4px rgba(145, 158, 171, 0.24)',
			filter: 'drop-shadow(0px 0px 2px rgba(145, 158, 171, 0.24))',
		}),
		menuList: (_base, state) => ({
			padding: '8px 0',
			maxHeight: state.maxHeight,
			overflow: 'auto',

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
		}),
		control: (_base, state) => ({
			background: state.isDisabled ? theme.palette.background.light : 'initial',
			padding: state.className?.includes('size-medium') ? '14px 0px 14px 6px' : '5px 0px 5px 6px',
			lineHeight: '24px',
			display: 'flex',
			alignItems: 'center',
			borderRadius: state.selectProps['aria-label'] ? '0 8px 8px 0' : '8px',
			fontSize: 16,
			margin: 'auto',
			border: `1px solid ${
				state.selectProps['aria-invalid'] ? theme.palette.error.main : alpha(theme.palette.text.quaternary, 0.32)
			}`,
			// change styles below if you want effect on hover or focus
			'&:hover': {
				borderColor: state.selectProps['aria-invalid'] ? theme.palette.error.main : theme.palette.text.secondary,
				cursor: state.isDisabled ? 'not-allowed' : 'pointer',
			},
			transition: 'border-color 0.2s ease-in-out',
		}),
		dropdownIndicator: (_base, state) => ({
			display: 'flex',
			width: 18,
			color: state.isDisabled ? theme.palette.text.disabled : theme.palette.text.secondary,
			transition: 'all .2s ease',
			transform:
				state.selectProps.menuPlacement === 'top' && !state.selectProps.menuIsOpen
					? 'rotate(180deg)'
					: state.selectProps.menuPlacement === 'top' && state.selectProps.menuIsOpen
						? 'rotate(0deg)'
						: state.selectProps.menuIsOpen
							? 'rotate(180deg)'
							: 'none',
		}),
		placeholder: () => ({
			gridArea: '1/1',
			color: theme.palette.text.quaternary,
		}),
		indicatorsContainer: () => ({
			width: 30,
		}),
		input: () => ({
			gridArea: '1/1',
			color: '#212B36',
			minWidth: 1,
			flex: '1',
			// if you want to hide the caret
			caretColor: 'transparent',
		}),
		valueContainer: (base, state) => ({
			...base,
			...(!state.className?.includes('multi-text') && {
				gap: 4,
				padding: '2px 8px 2px 6px',
			}),
		}),
		multiValue: () => ({
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: '0px 8px',
			backgroundColor: alpha(theme.palette.text.quaternary, 0.16),
			borderRadius: '50px',
			fontSize: 14,
			lineHeight: '18px',
		}),
		multiValueRemove: (base, state) => ({
			...base,
			display: state.isDisabled ? 'none' : 'flex',
			padding: 3,
			width: 16,
			height: 16,
			backgroundColor: alpha(theme.palette.primary.basic, 0.4),
			borderRadius: '50%',
			color: alpha(theme.palette.primary.contrast, 0.8),
			'&:hover': {
				backgroundColor: alpha(theme.palette.primary.basic, 0.3),
				color: alpha(theme.palette.primary.contrast, 0.8),
			},
		}),
		menuPortal: (base) => ({ ...base, zIndex: 9999 }),
	};

	return selectStyle;
};
