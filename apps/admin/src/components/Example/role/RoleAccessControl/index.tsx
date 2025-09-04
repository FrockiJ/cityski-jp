import React, { Fragment, useEffect, useState } from 'react';
import { Box, Collapse } from '@mui/material';

import { CoreCheckbox } from '@/CIBase/CoreCheckboxGroup';
import ChevronIcon from '@/Icon/ChevronIcon';
import { ModalMode } from '@/shared/types/general';
import { NavWithPermissionModel } from '@/shared/types/roleModel';

import Row from './Row';
import {
	StyledActionWrapper,
	StyledCell as Cell,
	StyledExpand,
	StyledMsg,
	StyledToolBar,
	StyledWrapper,
	StyleLine,
} from './styles';
import { Header } from './tableConfig';

interface RoleAccessControlDetailProps {
	item: NavWithPermissionModel;
	itemIndex: number;
	handleCheck: (rootData: NavWithPermissionModel, id: string, checked: boolean, authType?: AuthType) => void;
	isExpand: boolean;
	mode: ModalMode;
	level: number;
}

type RowLoopProps = {
	rootData: NavWithPermissionModel;
	data: NavWithPermissionModel;
	isExpand: boolean;
	level: number;
	handleCheck: (rootData: NavWithPermissionModel, id: string, checked: boolean, authType?: AuthType) => void;
};
type AuthType = 'edit' | 'view';

const RowLoop = ({ rootData, data, isExpand, level, handleCheck }: RowLoopProps) => {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(isExpand);
	}, [isExpand]);

	return (
		<Fragment>
			<Row>
				<Cell>
					<StyledWrapper marginLeft={(level - 1) * 30 + 'px'}>
						{data.subPages.length > 0 ? (
							<Box onClick={() => setOpen((prev) => !prev)} sx={{ cursor: 'pointer', display: 'inherit' }}>
								<ChevronIcon sx={{ color: 'primary.dark' }} direction={open ? 'down' : 'right'} />
							</Box>
						) : (
							<Box width={24}></Box>
						)}
						<CoreCheckbox
							checked={data.permissions.view && data.permissions.edit}
							indeterminate={
								(data.permissions.view && !data.permissions.edit) || (!data.permissions.view && data.permissions.edit)
							}
							onChange={({ target: { checked } }) => {
								handleCheck(rootData, data.id, checked);
							}}
							// disabled={mode === 'view'}
							disableRipple
							sx={{ padding: 0, marginRight: '10px' }}
						/>
						{data.pageName}
					</StyledWrapper>
				</Cell>
				<Cell>
					<CoreCheckbox
						checked={data.permissions.view}
						// indeterminate={false}
						onChange={({ target: { checked } }) => {
							handleCheck(rootData, data.id, checked, 'view');
						}}
						// disabled={mode === 'view'}
						disableRipple
						sx={{ padding: 0 }}
					/>
				</Cell>
				<Cell>
					<CoreCheckbox
						checked={data.permissions.edit}
						// indeterminate={false}
						onChange={({ target: { checked } }) => {
							handleCheck(rootData, data.id, checked, 'edit');
						}}
						// disabled={mode === 'view'}
						disableRipple
						sx={{ padding: 0 }}
					/>
				</Cell>
			</Row>
			{data.subPages.length > 0 && (
				<Collapse in={open}>
					{data.subPages.map((page) => {
						if (page.subPages.length > 0) {
							return (
								<RowLoop
									rootData={rootData}
									key={page.id}
									data={page}
									isExpand={isExpand}
									level={level + 1}
									handleCheck={handleCheck}
								/>
							);
						}
						return (
							<Row key={page.id}>
								<Cell>
									<StyledWrapper marginLeft={level * 30 + 24 + 'px'}>
										<CoreCheckbox
											checked={page.permissions.view && page.permissions.edit}
											indeterminate={
												(page.permissions.view && !page.permissions.edit) ||
												(!page.permissions.view && page.permissions.edit)
											}
											onChange={({ target: { checked } }) => {
												handleCheck(rootData, page.id, checked);
											}}
											// disabled={mode === 'view'}
											disableRipple
											sx={{ padding: 0, marginRight: '10px' }}
										/>
										{page.pageName}
									</StyledWrapper>
								</Cell>
								<Cell>
									<CoreCheckbox
										checked={page.permissions.view}
										// indeterminate={false}
										onChange={({ target: { checked } }) => {
											handleCheck(rootData, page.id, checked, 'view');
										}}
										// disabled={mode === 'view'}
										disableRipple
										sx={{ padding: 0 }}
									/>
								</Cell>
								<Cell>
									<CoreCheckbox
										checked={page.permissions.edit}
										// indeterminate={false}
										onChange={({ target: { checked } }) => {
											handleCheck(rootData, page.id, checked, 'edit');
										}}
										// disabled={mode === 'view'}
										disableRipple
										sx={{ padding: 0 }}
									/>
								</Cell>
							</Row>
						);
					})}
				</Collapse>
			)}
		</Fragment>
	);
};

const RoleAccessControlDetail = ({
	item,
	// itemIndex,
	handleCheck,
	isExpand,
	// mode,
	level,
}: RoleAccessControlDetailProps) => {
	const [, setOpen] = useState(false);

	useEffect(() => {
		setOpen(isExpand);
	}, [isExpand]);

	return <RowLoop rootData={item} data={item} isExpand={isExpand} level={level} handleCheck={handleCheck} />;
};

interface RoleAccessControlProps {
	data?: NavWithPermissionModel[];
	title?: string;
	showAtLeastMsg?: string;
	handleCheck: (rootData: NavWithPermissionModel, id: string, checked: boolean, authType?: AuthType) => void;
	mode?: ModalMode;
}

const RoleAccessControl = ({ data, handleCheck, mode = 'view', title, showAtLeastMsg }: RoleAccessControlProps) => {
	const [isExpand, setIsExpand] = useState(mode === 'add' ? false : true);

	return (
		<>
			<StyledToolBar>
				<Box typography='h6' display={'flex'}>
					{title}
					{showAtLeastMsg && <StyledMsg>{showAtLeastMsg}</StyledMsg>}
				</Box>
				<StyledActionWrapper>
					<StyledExpand onClick={() => setIsExpand(false)}>收合全部</StyledExpand>
					<StyleLine />
					<StyledExpand onClick={() => setIsExpand(true)}>展開全部</StyledExpand>
				</StyledActionWrapper>
			</StyledToolBar>
			<Box>
				<Row header>
					{Header.map(({ name }) => (
						<Cell header key={name}>
							{name}
						</Cell>
					))}
				</Row>

				{data?.map((item, itemIndex) => (
					<RoleAccessControlDetail
						item={item}
						itemIndex={itemIndex}
						level={1}
						key={item.id}
						handleCheck={handleCheck}
						isExpand={isExpand}
						mode={mode}
					/>
				))}
			</Box>
		</>
	);
};

export default RoleAccessControl;
