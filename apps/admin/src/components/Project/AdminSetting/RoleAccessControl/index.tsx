import React, { Fragment, useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Collapse, Stack, Typography } from '@mui/material';
import { ModalType } from '@repo/shared';

import CoreButton from '@/CIBase/CoreButton';
import { CoreCheckbox } from '@/CIBase/CoreCheckboxGroup';

import * as Components from '../../shared/Components';
import { MenuCheckedDTO } from '../AddEditRoleModal';

import { StyledMsg, StyledToolBar, StyledWrapper, StyleLine } from './styles';

const tableHeader = [{ name: '選單名稱' }];

type RowLoopProps = {
	rootNav: MenuCheckedDTO;
	nav: MenuCheckedDTO;
	isExpand: boolean;
	level: number;
	modalType: ModalType;
	handleCheck: (rootNav: MenuCheckedDTO, id: string, checked: boolean) => void;
	isSuperAdm: boolean;
};

const RowLoop = ({ rootNav, nav, isExpand, level, handleCheck, modalType, isSuperAdm }: RowLoopProps) => {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(isExpand);
	}, [isExpand]);

	return (
		<Fragment>
			<Components.Row>
				<Components.StyledCell>
					<StyledWrapper marginLeft={(level - 1) * 30 + 'px'}>
						{nav.subPages && nav.subPages.length > 0 ? (
							<Box onClick={() => setOpen((prev) => !prev)} sx={{ cursor: 'pointer', display: 'inherit' }}>
								<KeyboardArrowDownIcon
									sx={{
										color: 'text.secondary',
										transition: '300ms',
										transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
									}}
									direction={open ? 'down' : 'right'}
								/>
							</Box>
						) : (
							<Box width={24}></Box>
						)}
						{/* root level */}
						<CoreCheckbox
							checked={nav.checked}
							indeterminate={
								nav.subPages &&
								nav.subPages.length > 0 &&
								!nav.subPages.every((x) => x.checked) &&
								nav.subPages?.some((x) => x.checked)
							}
							onChange={({ target: { checked } }) => {
								handleCheck(rootNav, nav.id, checked);
							}}
							disabled={modalType === ModalType.VIEW || isSuperAdm || nav.path === '/dashboard'}
							disableRipple
							sx={{ padding: 0, marginRight: '10px' }}
						/>
						{nav.name}
					</StyledWrapper>
				</Components.StyledCell>
			</Components.Row>

			{nav.subPages && nav.subPages.length > 0 && (
				<Collapse in={open}>
					{nav.subPages.map((x) => {
						if (x.subPages && x.subPages.length > 0) {
							return (
								<RowLoop
									key={x.id}
									rootNav={rootNav}
									nav={x}
									isExpand={isExpand}
									level={level + 1}
									modalType={modalType}
									isSuperAdm={isSuperAdm}
									handleCheck={handleCheck}
								/>
							);
						}

						return (
							<Components.Row key={x.id}>
								<Components.StyledCell>
									<StyledWrapper marginLeft={level * 30 + 24 + 'px'}>
										<CoreCheckbox
											checked={x.checked}
											onChange={({ target: { checked } }) => {
												handleCheck(rootNav, x.id, checked);
											}}
											disabled={modalType === ModalType.VIEW || isSuperAdm}
											disableRipple
											sx={{ padding: 0, marginRight: '10px' }}
										/>
										{x.name}
									</StyledWrapper>
								</Components.StyledCell>
							</Components.Row>
						);
					})}
				</Collapse>
			)}
		</Fragment>
	);
};

interface RoleAccessControlDetailProps {
	menu: MenuCheckedDTO;
	handleCheck: (rootNav: MenuCheckedDTO, id: string, checked: boolean) => void;
	isExpand: boolean;
	modalType: ModalType;
	level: number;
	isSuperAdm: boolean;
}

const RoleAccessControlDetail = ({
	menu,
	handleCheck,
	isExpand,
	modalType,
	level,
	isSuperAdm,
}: RoleAccessControlDetailProps) => {
	const [, setOpen] = useState(false);

	useEffect(() => {
		setOpen(isExpand);
	}, [isExpand]);

	return (
		<RowLoop
			rootNav={menu}
			nav={menu}
			isExpand={isExpand}
			level={level}
			handleCheck={handleCheck}
			modalType={modalType}
			isSuperAdm={isSuperAdm}
		/>
	);
};

interface RoleAccessControlProps {
	menus: MenuCheckedDTO[];
	title?: string;
	showAtLeastMsg?: string;
	handleCheck: (menu: MenuCheckedDTO, menuId: string, checked: boolean) => void;
	modalType?: ModalType;
	isSuperAdm: boolean;
}

const RoleAccessControl = ({
	menus,
	handleCheck,
	modalType = ModalType.VIEW,
	title,
	showAtLeastMsg,
	isSuperAdm = false,
}: RoleAccessControlProps) => {
	const [isExpand, setIsExpand] = useState(false);

	return (
		<>
			<StyledToolBar>
				<Typography variant='h6'>
					{title}
					{showAtLeastMsg && <StyledMsg>{showAtLeastMsg}</StyledMsg>}
				</Typography>
				<Stack alignItems='center' direction='row' divider={<StyleLine />} spacing={1}>
					<CoreButton label='收合全部' sx={{ fontWeight: 400 }} onClick={() => setIsExpand(false)} />
					<CoreButton label='展開全部' sx={{ fontWeight: 400 }} onClick={() => setIsExpand(true)} />
				</Stack>
			</StyledToolBar>
			<Box>
				<Components.Row header>
					{tableHeader.map(({ name }) => (
						<Components.StyledCell header key={name}>
							{name}
						</Components.StyledCell>
					))}
				</Components.Row>

				{Array.isArray(menus) &&
					menus.map((menu) => (
						<RoleAccessControlDetail
							key={menu.id}
							menu={menu}
							level={1}
							handleCheck={handleCheck}
							isExpand={isExpand}
							modalType={modalType}
							isSuperAdm={isSuperAdm}
						/>
					))}
			</Box>
		</>
	);
};

export default RoleAccessControl;
