import { GroupBase, StylesConfig } from 'react-select';
import { alpha, MenuItem, styled, Theme } from '@mui/material';
import { SelectOption } from '@repo/shared';

const SelectLabel = styled('div', {
	shouldForwardProp: (prop) => prop !== 'error',
})<{ error?: boolean }>(({ theme, error }) => ({
	fontSize: '14px',
	color: theme.palette.text.primary,
	padding: '10px 16px',
	borderRadius: '4px 0 0 4px',
	backgroundColor: 'lightgray',
	// conditional styles
	...(error && {
		backgroundColor: 'rgba(255, 62, 73, 0.1)',
	}),
}));

const customStyles = (theme: Theme) => {
	const selectStyle: StylesConfig<SelectOption, boolean, GroupBase<SelectOption>> = {
		container: (provided) => ({
			...provided,
			pointerEvents: 'initial',
		}),
		option: (_provided, state) => ({
			color: state.selectProps.isDisabled ? theme.palette.text.disabled : theme.palette.text.primary,
			display: 'flex',
			alignItems: 'center',
			margin: '0 8px',
			padding: 0,
			fontSize: 14,

			'&:hover, &:active': {
				cursor: state.selectProps.isDisabled ? 'not-allowed' : 'pointer',
				backgroundColor: 'transparent',
			},
		}),
		menu: (provided, state) => ({
			...provided,
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
		menuList: (provided) => ({
			display: 'flex',
			flexDirection: 'column',
			padding: '8px 0',
			maxHeight: provided.maxHeight,
			overflow: 'auto',
			gap: 4,

			'::-webkit-scrollbar': {
				width: 6,
				height: 0,
			},
			'::-webkit-scrollbar-track': {
				borderRadius: 4,
				backgroundColor: theme.palette.primary.contrast,
			},
			'::-webkit-scrollbar-thumb': {
				backgroundColor: 'lightgray',
				borderRadius: 4,
			},
		}),
		control: (_provided, state) => ({
			padding: state.selectProps.className?.includes('size-medium') ? '14px 0px 14px 6px' : '5px 0px 5px 6px',
			lineHeight: '24px',
			display: 'flex',
			alignItems: 'center',
			borderRadius: state.selectProps['aria-label'] ? '0 8px 8px 0' : '8px',
			fontSize: 16,
			margin: 'auto',
			border: state.selectProps['aria-invalid']
				? `1px solid ${theme.palette.error.main}`
				: `1px solid ${alpha(theme.palette.text.quaternary, 0.32)}`,
			backgroundColor: 'transparent',
			...(state.selectProps.isDisabled && {
				cursor: 'not-allowed',
				color: `${theme.palette.text.disabled} !important`,
				WebkitTextFillColor: theme.palette.text.disabled,
				borderColor: `${alpha(theme.palette.text.disabled, 0.24)} !important`,
				backgroundColor: theme.palette.background.light,
			}),
			'&:hover': {
				cursor: state.selectProps.isDisabled ? 'not-allowed' : 'pointer',
				color: theme.palette.text.primary,
				borderColor: theme.palette.text.secondary,
			},
			transition: 'border-color 0.2s ease-in-out',
		}),
		dropdownIndicator: (_provided, state) => ({
			display: 'flex',
			width: 18,
			color: state.selectProps.isDisabled ? theme.palette.text.disabled : theme.palette.text.secondary,
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
			color: theme.palette.text.primary,
			minWidth: 1,
			flex: '1',
			// if you want to hide the caret
			caretColor: 'transparent',
		}),
		valueContainer: (base, state) => ({
			...base,
			...(!state.selectProps.className?.includes('multi-text') && {
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
			borderRadius: 50,
			fontSize: 13,
			lineHeight: '18px',
		}),
		multiValueRemove: (base, state) => ({
			...base,
			display: state.selectProps.isDisabled ? 'none' : 'flex',
			padding: 3,
			width: 16,
			height: 16,
			backgroundColor: alpha(theme.palette.primary.basic, 0.2),
			borderRadius: '50%',
			color: alpha(theme.palette.primary.contrast, 0.8),
			'&:hover': {
				backgroundColor: alpha(theme.palette.primary.basic, 0.4),
				color: alpha(theme.palette.primary.contrast, 0.8),
			},
		}),
		menuPortal: (base) => ({ ...base, zIndex: 9999 }),
	};

	return selectStyle;
};

const StyledMenuItem = styled(MenuItem, {
	shouldForwardProp: (prop) => prop !== 'isHidden' && prop !== 'isSelected' && prop !== 'isDisabled',
})<{ isSelected?: boolean; isDisabled?: boolean; isHidden?: boolean }>(
	({ theme, isSelected, isDisabled, isHidden }) => ({
		...theme.typography.body2,
		padding: '6px 16px',
		width: '100%',
		borderRadius: 6,
		minHeight: 34,
		height: 'auto',
		whiteSpace: 'normal',
		wordBreak: 'break-word',
		color: isDisabled ? theme.palette.text.disabled : theme.palette.text.primary,
		cursor: isDisabled ? 'not-allowed' : 'pointer',
		backgroundColor: isDisabled
			? theme.palette.grey[200]
			: isSelected
				? alpha(theme.palette.text.quaternary, 0.16)
				: 'transparent',
		...(isHidden && { display: 'none !important' }),
	}),
);

const StyledMultiTextMenuItem = styled(MenuItem, {
	shouldForwardProp: (prop) => prop !== 'isHidden',
})<{ isHidden?: boolean }>(({ theme, isHidden }) => ({
	...theme.typography.body2,
	padding: '6px 8px',
	width: '100%',
	borderRadius: 6,
	...(isHidden && { display: 'none !important' }),
}));

export { customStyles, SelectLabel, StyledMenuItem, StyledMultiTextMenuItem };
