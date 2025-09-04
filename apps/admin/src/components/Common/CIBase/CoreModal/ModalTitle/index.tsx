import { DialogAction } from '@repo/shared';

import CloseIcon from '@/Icon/CloseIcon';

import { StyledModalTitle } from '../styles';

import { StyledIconButton } from './styles';

interface ModalTitleProps {
	title?: string;
	noTitleBorder?: boolean;
	noTitleCloseButton?: boolean;
	handleClose?: (action: DialogAction) => void;
}

const ModalTitle = ({ title, noTitleBorder, noTitleCloseButton, handleClose }: ModalTitleProps) => {
	return (
		<StyledModalTitle noTitleBorder={noTitleBorder}>
			<div>{title}</div>
			{!noTitleCloseButton && handleClose && (
				<StyledIconButton onClick={() => handleClose(DialogAction.CANCEL)}>
					<CloseIcon />
				</StyledIconButton>
			)}
		</StyledModalTitle>
	);
};

export default ModalTitle;
