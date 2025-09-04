import { MenuProps } from '@mui/material';

import { MenuArrow, StyledMenu } from './styles';

const CoreMenu = ({
	anchorOrigin = {
		vertical: 'bottom',
		horizontal: 'right',
	},
	transformOrigin = {
		vertical: 'top',
		horizontal: 'right',
	},
	...props
}: MenuProps) => {
	return (
		<StyledMenu anchorOrigin={anchorOrigin} transformOrigin={transformOrigin} {...props}>
			<MenuArrow anchorOrigin={anchorOrigin} transformOrigin={transformOrigin}></MenuArrow>
			{props.children}
		</StyledMenu>
	);
};

export default CoreMenu;
