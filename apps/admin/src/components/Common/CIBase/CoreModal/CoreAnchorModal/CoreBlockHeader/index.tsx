// import Button from '../../../Button';
import { BtnActionTypeEnum } from '@repo/shared/dist/constants/enums';

import CoreButton from '@/CIBase/CoreButton';

import { StyledBlockHeader, StyledHeaderTitle } from '../styles';

type CoreBlockHeaderProps = {
	title: string;
	buttonLabel?: string;
	buttonIsLink?: boolean;
	buttonIconType?: BtnActionTypeEnum;
	handleClick?: () => void;
};

const CoreBlockHeader = ({
	title,
	buttonLabel = '',
	handleClick,
	buttonIsLink = false,
	buttonIconType = 'manage',
}: CoreBlockHeaderProps) => {
	return (
		<StyledBlockHeader>
			<StyledHeaderTitle>{title}</StyledHeaderTitle>
			{handleClick && (
				<CoreButton
					iconType={buttonIsLink ? 'link' : buttonIconType}
					label={buttonLabel}
					onClick={handleClick}
					variant='outlined'
				/>
			)}
		</StyledBlockHeader>
	);
};

export default CoreBlockHeader;
