import { ReactElement } from 'react';

import { DialogAction } from '../constants/enum';

export type ModalPrivateProps = {
	readonly id: string;
	open: boolean;
};

export type ModalCustomProps = {
	title?: string;
	width?: string | number;
	height?: string | number;
	contentBGColor?: string;
	center?: boolean;
	children?: ReactElement;
	confirmLabel?: string;
	cancelLabel?: string;
	fullScreen?: boolean;
	size?: string;
	noHeader?: boolean;
	noAction?: boolean;
	noCancel?: boolean;
	noEscAndBackdrop?: boolean;
	marginBottom?: boolean;
	onClose?: (action: DialogAction) => void;
};

export type MessageType = 'error' | 'warning' | 'confirm' | 'info';

export type MessageModalCustomProps = {
	type: MessageType;
	title?: string;
	content?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	width?: string | number;
	onClose?: (action: DialogAction) => void;
};

export type ModalProps = ModalCustomProps & ModalPrivateProps;
export type MessageModalProps = MessageModalCustomProps & ModalPrivateProps;
