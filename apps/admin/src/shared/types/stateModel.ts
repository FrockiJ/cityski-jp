import { ReactElement } from 'react';
import { Department, DialogAction, MenuDTO, OrderByType, UserInfoDTO } from '@repo/shared';

import { Permissions } from '@/shared/types/auth';

import { MessageModalProps, ModalProps } from '../core/Types/modal';

export type SliceState = {
	userInfo: UserInfoDTO | null;
	departments: Department[];
};

export type ActiveNavInfo = {
	activeParent: string;
	activeCurrentNav: string;
};

export type LayoutSliceState = {
	layoutTransition: boolean;
	pageTitle: string;
	activeNav: ActiveNavInfo;
	modalList: ModalProps[];
	messageModalList: MessageModalProps[];
	themeMode: 'dark' | 'light';
};

export type AuthSliceState = {
	accessToken: string;
	navList: MenuDTO[];
	permissions?: Permissions;
};

export type PaginationData = {
	current_page: number;
	total_pages: number;
	current_page_value_from: number;
	current_page_value_to: number;
	num_values: number;
};

export type TablePageManager = {
	[key: string]: {
		currentPage: number;
		currentPerPage: number;
	};
};

export type TableSliceState = {
	tablePageManager: TablePageManager;
	tablePageManager2: {
		[key: string]: number;
	};
	tableDataPerPage: number;
	tableSort: {
		order: OrderByType | null;
		orderBy: string;
	};
	tablePagination?: PaginationData | null;
};

export type DynamicTablePageManager = {
	[key: string]: {
		currentPage: number;
		currentPerPage: number;
	};
};

export type DynamicTableSliceState = {
	tablePageManager: DynamicTablePageManager;
	tableDataPerPage: number;
	tableSort: {
		order: OrderByType | null;
		orderBy: string;
	};
	tablePagination?: PaginationData | null;
};

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
