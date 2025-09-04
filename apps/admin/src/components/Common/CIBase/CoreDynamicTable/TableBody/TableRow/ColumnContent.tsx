import { Box, FormControlLabel, Stack, Tooltip } from '@mui/material';

import CoreButton from '@/CIBase/CoreButton';
import TableCell from '@/CIBase/CoreDynamicTable/TableBody/TableCell';
import CoreSwitch from '@/CIBase/CoreSwitch';
import Tag from '@/CIBase/Tag';
import { ColumnType } from '@/shared/constants/enums';
import { ListResultI, TableColumnType, TagTableColumn } from '@/shared/types/dynamicTable';

import { StyledCount, StyledCountWrapper, StyledManagementWrapper, StyledTagGroup } from './styles';

interface ColumnContentProps<T> {
	row: T;
	column: TableColumnType<T>;
	index: number;
	handleEdit?: (id: string, rowData: T) => void;
	handleDelete?: (id: string, rowData: T) => void;
	handleSwitch?: (id: string, rowData: T) => void;
}

export default function ColumnContent<T extends ListResultI>({
	row,
	column,
	index,
	handleEdit,
	handleDelete,
	handleSwitch,
}: ColumnContentProps<T>) {
	const id = row['id'] ?? '';
	const content = column.key ? row[column.key] : '';

	switch (column.type) {
		case ColumnType.INDEX:
			return (
				<TableCell
					sx={{
						// maxWidth: column.width ?? 200,
						...column.sx,
					}}
				>
					{' '}
					{index + 1}
				</TableCell>
			);
		case ColumnType.CONTENT:
			return column.key ? (
				<TableCell
					sx={{
						// maxWidth: column.width ?? 200,
						...column.sx,
					}}
				>
					{' '}
					{Array.isArray(content) ? content.map((x, i) => <div key={i}>{x}</div>) : String(content)}
				</TableCell>
			) : null;
		case ColumnType.IMAGE:
			return column.key && typeof content === 'string' ? (
				<TableCell
					sx={{
						// maxWidth: column.width ?? 100,
						...column.sx,
					}}
				>
					<img
						src={content ?? ''}
						style={{
							objectFit: 'contain',
							width: '64px',
							height: '36px',
							borderRadius: '4px',
						}}
						alt={column.label}
					/>
				</TableCell>
			) : (
				<TableCell></TableCell>
			);
		case ColumnType.MEDIA:
			return null;
		case ColumnType.SWITCH:
			return column.key ? (
				<TableCell
					sx={{
						'.MuiFormControlLabel-root': {
							margin: 0,
							'.MuiSwitch-root': {
								marginRight: 1,
							},
						},
						...column.sx,
					}}
				>
					<FormControlLabel
						key={id}
						control={
							<CoreSwitch
								disabled={row.disabled}
								// NOTE: @Kranti Type Guard and Narrowing
								checked={content as boolean}
								onChange={() => handleSwitch?.(id, row)}
							/>
						}
						// NOTE: @Kranti Type Guard and Narrowing
						label={(content as boolean) ? '啟用' : '停用'}
						disableTypography
					/>
				</TableCell>
			) : null;
		case ColumnType.MANAGEMENT:
			return (
				<TableCell>
					<StyledManagementWrapper>
						{handleEdit && (
							<CoreButton
								variant='text'
								color='primary'
								label='編輯'
								sx={{ fontWeight: 400 }}
								onClick={() => handleEdit?.(id, row)}
							/>
						)}
						{handleDelete && (
							<CoreButton
								variant='text'
								color='error'
								label='刪除'
								sx={{ fontWeight: 400 }}
								disabled={row.disabled}
								onClick={() => {
									handleDelete?.(id, row);
								}}
							/>
						)}
					</StyledManagementWrapper>
				</TableCell>
			);
		case ColumnType.TAG:
			const tagColumn = column as TagTableColumn<T>;
			// return tagColumn && tagColumn.key ? (
			return tagColumn && tagColumn.key && Array.isArray(content) ? (
				<TableCell
					sx={{
						// maxWidth: column.width ?? 200,
						...column.sx,
					}}
				>
					<StyledTagGroup>
						{content.map((item, index) => (
							<Stack key={index} direction='row' spacing={1}>
								<Tag
									label={item}
									sx={{
										color: tagColumn?.styles?.[String(item)]?.color ?? 'grey',
										backgroundColor: tagColumn?.styles?.[String(item)]?.backgroundColor ?? 'grey',
									}}
								/>
							</Stack>
						))}
					</StyledTagGroup>
				</TableCell>
			) : tagColumn && tagColumn.key && !Array.isArray(content) ? (
				<TableCell
					sx={{
						// maxWidth: column.width ?? 200,
						...column.sx,
					}}
				>
					<StyledTagGroup>
						<Stack direction='row' spacing={1}>
							<Tag
								label={content}
								sx={{
									color: tagColumn?.styles?.[String(content)]?.color ?? 'grey',
									backgroundColor: tagColumn?.styles?.[String(content)]?.backgroundColor ?? 'grey',
								}}
							/>
						</Stack>
					</StyledTagGroup>
				</TableCell>
			) : null;
		case ColumnType.LIST_AND_TOOLTIP:
			return (
				<TableCell>
					{Array.isArray(content) && (
						<StyledCountWrapper>
							{content[0]}
							{content.length > 1 && (
								<Tooltip title={content.join(', ')} arrow>
									<Box>
										<StyledCount>+{content.length}</StyledCount>
									</Box>
								</Tooltip>
							)}
						</StyledCountWrapper>
					)}
				</TableCell>
			);
		case ColumnType.BLANK:
			return null;
		case ColumnType.EMPTY:
			return <TableCell></TableCell>;
		default:
			return (
				<TableCell
					sx={{
						// maxWidth: column.width ?? 200,
						...column.sx,
					}}
				>
					{'N/A'}
				</TableCell>
			);
	}
}
