import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreOption } from '@repo/shared';

import {
	MenuPaperProps,
	MoreButtonOverlay,
	StyledTableCell,
} from '@/CIBase/CoreDynamicTable/CoreDynamicTableList/styles';

interface MoreCellProps {
	moreOptions: MoreOption[];
	rowData: any;
}

const MoreCell = (props: MoreCellProps) => {
	const { rowData, moreOptions } = props;

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<StyledTableCell>
			{moreOptions && moreOptions.length > 0 && (
				<>
					<MoreButtonOverlay />
					<IconButton
						onClick={(event: React.MouseEvent<HTMLElement>) => {
							handleClick(event);
						}}
					>
						<MoreVertIcon />
					</IconButton>
				</>
			)}
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				closeAfterTransition={false}
				onClick={handleClose}
				slotProps={{
					paper: MenuPaperProps,
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'center' }}
				anchorOrigin={{ horizontal: 'left', vertical: 'center' }}
			>
				{moreOptions.map((option) => (
					<MenuItem
						key={option.label}
						disabled={option.isDisabled ?? rowData.disabled}
						onClick={() => option.onClick(rowData.id, rowData)}
					>
						{option.label}
					</MenuItem>
				))}
			</Menu>
		</StyledTableCell>
	);
};

export default MoreCell;
