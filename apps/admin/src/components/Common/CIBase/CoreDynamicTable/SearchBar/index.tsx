import React, { useRef, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, SxProps, Theme, Typography } from '@mui/material';

import { StyledInputBase, StyledSearch, StyledSearchBarWrapper } from './styles';

export interface SearchBarProps {
	placeholder?: string;
	value: string;
	title?: string;
	onChange?: (event: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>, value: string | null) => void;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	sx?: SxProps<Theme> | undefined;
}

const SearchBar = ({ placeholder = 'Search', onChange, onKeyDown, value, sx, title }: SearchBarProps) => {
	const [text, setText] = useState(value);
	const ref = useRef<HTMLInputElement>(null);

	const handleClear: React.MouseEventHandler<HTMLButtonElement> = (event) => {
		setText('');
		onChange?.(Object.assign(event, { target: ref.current, currentTarget: ref.current }), '');

		// manually invoke 'Enter key' keydown event
		ref.current?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
	};

	return (
		<>
			<Typography variant='body2' color='text.secondary' pb={0.5}>
				{title}
			</Typography>
			<StyledSearchBarWrapper sx={sx}>
				<StyledSearch>
					<SearchIcon />
					<StyledInputBase
						inputRef={ref}
						value={text}
						placeholder={placeholder}
						inputProps={{ 'aria-label': 'search' }}
						onChange={(event) => {
							setText(event.target.value);
							if (onChange) onChange(event, event.target.value);
						}}
						onKeyDown={(event) => {
							if (event.key !== 'Enter') return;

							if (onKeyDown) onKeyDown(event);
						}}
						endAdornment={
							Boolean(text) && (
								<IconButton size='small' sx={{ scale: '.8' }} onClick={handleClear}>
									<ClearIcon />
								</IconButton>
							)
						}
					/>
				</StyledSearch>
			</StyledSearchBarWrapper>
		</>
	);
};

export default SearchBar;
