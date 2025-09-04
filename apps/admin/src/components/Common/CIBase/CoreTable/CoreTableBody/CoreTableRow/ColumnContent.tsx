import { FormControlLabel, Stack } from '@mui/material';

import CoreButton from '@/CIBase/CoreButton';
import { StyledSuccessSwitch } from '@/CIBase/CoreTable/CoreTableList/styles';
import { ColumnType } from '@/shared/constants/enums';
import { ListResultI, TableColumnType, TagTableColumn } from '@/shared/types/dynamicTable';

import CoreTableCell from '../CoreTableCell';

import { StyledChip, StyledEditCoreTableCell, StyledImg } from './styles';

interface ColumnContentProps<T> {
	row: T;
	column: TableColumnType<T>;
	index: number;
	handleDelete?: (id: string) => void;
	refetch?: () => void;
}

export function ColumnContent<T extends ListResultI>({
	row,
	column,
	index,
	handleDelete,
	refetch,
}: ColumnContentProps<T>) {
	const id = row['id'] ?? '';
	const content = column.key ? row[column.key] : '';
	// console.log('row', row);
	// console.log('content', content);
	// console.log('column', column);
	switch (column.type) {
		case ColumnType.INDEX:
			return (
				<CoreTableCell
					sx={{
						// maxWidth: column.width ?? 200,
						...column.sx,
					}}
				>
					{' '}
					{index + 1}
				</CoreTableCell>
			);
		case ColumnType.CONTENT:
			return column.key ? (
				<CoreTableCell
					sx={{
						// maxWidth: column.width ?? 200,
						...column.sx,
					}}
				>
					{' '}
					{String(content)}
				</CoreTableCell>
			) : null;
		case ColumnType.IMAGE:
			return column.key && typeof content === 'string' ? (
				<CoreTableCell
					sx={{
						// maxWidth: column.width ?? 100,
						...column.sx,
					}}
				>
					<StyledImg src={content ?? ''} alt={column.label} />
				</CoreTableCell>
			) : (
				<CoreTableCell></CoreTableCell>
			);
		case ColumnType.MEDIA:
			return null;
		case ColumnType.SWITCH:
			return column.key ? (
				<CoreTableCell
					sx={{
						// maxWidth: column.width ?? 200,
						...column.sx,
					}}
				>
					<FormControlLabel
						control={<StyledSuccessSwitch defaultChecked={!!content} />}
						label={column.label ?? ''}
						key={id}
						disableTypography={true}
						onChange={(event, checked) => {
							column.handleChange && column.handleChange(event, id, checked, refetch);
						}}
					/>
				</CoreTableCell>
			) : null;
		case ColumnType.DELETE:
			return handleDelete || column.handleChange ? (
				<CoreTableCell>
					<CoreButton
						variant='text'
						label={column.label ?? `Delete`}
						onClick={(e) => {
							column.handleChange?.(e, id, false);
							handleDelete?.(id);
						}}
					/>
				</CoreTableCell>
			) : null;
		case ColumnType.EDIT:
			return column.handleChange ? (
				<StyledEditCoreTableCell
					onClick={(e) => {
						column.handleChange?.(e, id, false);
					}}
				>
					{column.label ?? `Edit`}
				</StyledEditCoreTableCell>
			) : null;
		case ColumnType.TAG:
			const tagColumn = column as TagTableColumn<T>;
			return tagColumn && tagColumn.key && Array.isArray(content) ? (
				<CoreTableCell
					sx={{
						// maxWidth: column.width ?? 200,
						...column.sx,
					}}
				>
					<Stack direction='row' spacing={1}>
						{content.map((c: string) => (
							<StyledChip
								key={c}
								label={c}
								color='primary'
								customColor={tagColumn?.styles?.[c]?.color ?? 'grey'}
								customBackgroundColor={tagColumn?.styles?.[c]?.backgroundColor ?? 'grey'}
							/>
						))}
					</Stack>
				</CoreTableCell>
			) : null;
		case ColumnType.BLANK:
			return null;
		default:
			return (
				<CoreTableCell
					sx={{
						// maxWidth: column.width ?? 200,
						...column.sx,
					}}
				>
					{' '}
				</CoreTableCell>
			);
	}
}
