import { ReactElement } from 'react';
import { MemberDto } from '@repo/shared';

import { LayoutType } from '../constants/enums';
import { DialogAction } from '../core/constants';
import { MessageModalProps, ModalProps } from '../core/Types/modal';

export type LayoutSliceState = {
	modalLayer: number;
	layoutTransition: boolean;
	pageTitle: string;
	menuToggled: boolean;
	layoutType?: LayoutType;
	modalList: ModalProps[];
	messageModalList: MessageModalProps[];
	themeMode: 'dark' | 'light';
};

export interface AuthSliceState {
	userInfo?: MemberDto | null;
	accessToken?: string | null;
}

export interface DialogPrivateProps {
	readonly id: string;
	open: boolean;
}

export interface DialogCustomProps {
	title?: string;
	width?: string | number;
	height?: string | number;
	contentBGColor?: string;
	center?: boolean;
	children?: ReactElement;
	confirmLabel?: string;
	cancelLabel?: string;
	deleteLabel?: string;
	fullScreen?: boolean;
	size?: string;
	noHeader?: boolean;
	noAction?: boolean;
	noCancel?: boolean;
	noDelete?: boolean;
	noEscAndBackdrop?: boolean;
	onClose?: (action: DialogAction) => void;
}

export type MessageType = 'error' | 'warning' | 'confirm' | 'info';
export interface MessageDialogCustomProps {
	type: MessageType;
	title?: string;
	content?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	width?: string | number;
	onClose?: (action: DialogAction) => void;
}

export interface DialogProps extends DialogCustomProps, DialogPrivateProps {}
export interface MessageDialogProps extends MessageDialogCustomProps, DialogPrivateProps {}
