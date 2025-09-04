'use client';
import React from 'react';

import CloseIcon from '@/components/Icon/CloseIcon';

import { DialogAction } from '../../../../../shared/core/constants/enum';
import { StyledModalTitle } from '../styles';

import { StyledIconButton } from './styles';

interface ModalTitleProps {
	title?: string;
	noTitleBorder?: boolean;
	handleClose?: (action: DialogAction) => void;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ title, noTitleBorder, handleClose }) => {
	return (
		<StyledModalTitle noTitleBorder={noTitleBorder}>
			<div>{title}</div>
			{handleClose && (
				<StyledIconButton onClick={() => handleClose(DialogAction.CANCEL)}>
					<CloseIcon />
				</StyledIconButton>
			)}
		</StyledModalTitle>
	);
};

export default ModalTitle;
