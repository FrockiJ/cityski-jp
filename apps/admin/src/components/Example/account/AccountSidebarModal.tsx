import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import CoreDatePickerRange from '@/CIBase/CoreDatePickerRange';
import { StyledTitle } from '@/CIBase/CoreFilterSidebar/styles';
import CoreRadioGroup from '@/CIBase/CoreRadioGroup';
import CoreSelect from '@/CIBase/CoreSelect';
import { addFilterItem } from '@/state/slices/searchFilterSlice';
import { useAppDispatch } from '@/state/store';

const StatusRadios = [
	{
		label: '全部',
		value: '',
	},
	{
		label: '啟用',
		value: '1',
	},
	{
		label: '停用',
		value: '0',
	},
	{
		label: '未開通',
		value: '2',
	},
];

interface AccountSidebarModalProps {
	filteredData?: Record<string, any>;
	tableId: string;
}

const AccountSidebarModal = ({ filteredData, tableId }: AccountSidebarModalProps) => {
	const dispatch = useAppDispatch();
	// const { roleOptions } = useGetRoleDropdown();

	const check = (matchName: string) => {
		return filteredData?.['modify_date']?.find(({ name }: { name: string }) => name === matchName)?.value;
	};

	const [dateValue, setDateValue] = useState<{
		startDate: Dayjs | null;
		endDate: Dayjs | null;
	}>({
		startDate: check('start_date') ? dayjs(check('start_date')) : null,
		endDate: check('end_date') ? dayjs(check('end_date')) : null,
	});

	return (
		<>
			<StyledTitle>角色</StyledTitle>
			<CoreSelect
				isMulti
				placeholder='選擇角色'
				options={[
					{ label: '超級管理員', value: '1' },
					{ label: '管理員', value: '2' },
					{ label: '編輯員', value: '3' },
				]}
				defaultValue={filteredData?.['role_id']}
				onChange={(option) => {
					dispatch(addFilterItem({ tableId, key: 'role_id', option }));
				}}
				size='medium'
				margin='0'
				width='100%'
			/>
			<StyledTitle mt={3}>狀態</StyledTitle>
			<CoreRadioGroup
				radios={StatusRadios}
				value={filteredData?.['status']?.value || ''}
				onChange={(_, value) => {
					dispatch(
						addFilterItem({
							tableId,
							key: 'status',
							option: {
								label: StatusRadios.find(({ value: radioValue }) => radioValue === value)?.label || '',
								value: value || '',
							},
						}),
					);
				}}
				direction='column'
			/>
			<StyledTitle mt={3}>修改日期</StyledTitle>
			<CoreDatePickerRange
				width='100%'
				direction='column'
				value={dateValue}
				onChange={(newValue) => {
					setDateValue(newValue);
					const { startDate, endDate } = newValue;
					let result = [];
					startDate &&
						result.push({
							name: 'start_date',
							label: `開始時間${dayjs(startDate).format('YYYY/MM/DD')}`,
							value: dayjs(startDate).format('YYYY/MM/DD'),
						});
					endDate &&
						result.push({
							name: 'end_date',
							label: `結束時間${dayjs(endDate).format('YYYY/MM/DD')}`,
							value: dayjs(endDate).format('YYYY/MM/DD'),
						});

					dispatch(
						addFilterItem({
							tableId,
							key: 'modify_date',
							option: result,
						}),
					);
				}}
				startTitle='開始時間'
				endTitle='結束時間'
				size='medium'
			/>
		</>
	);
};

export default AccountSidebarModal;
