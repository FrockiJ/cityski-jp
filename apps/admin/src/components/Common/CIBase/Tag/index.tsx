import { SxProps, Theme } from '@mui/material';

import { StyledChip } from './styles';

type TagProps<T> = {
	label: T[keyof T] | string;
	sx: SxProps<Theme>;
};

const Tag = <T,>({ label, sx }: TagProps<T>) => {
	return <StyledChip label={String(label)} sx={sx} />;
};

export default Tag;
