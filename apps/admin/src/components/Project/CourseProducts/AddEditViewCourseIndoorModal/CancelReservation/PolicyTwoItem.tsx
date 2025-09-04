import React from 'react';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import * as Components from '@/components/Project/shared/Components';

import { StableInput } from './StableInput';

interface Props {
	id: string;
	beforeDay?: string;
	withinDay?: string;
	price?: string;
	onBeforeDayChange?: (value: string) => void;
	onWithinDayChange?: (value: string) => void;
	onPriceChange?: (value: string) => void;
	onRemove?: () => void;
	showRemoveButton?: boolean;
	isBeforeDayDisabled?: boolean;
	hasSubmitted?: boolean;
	isSavingDraft?: boolean;
	isDisabled?: boolean;
}

const PolicyTwoItem: React.FC<Props> = ({
	id,
	beforeDay = '',
	withinDay = '',
	price = '',
	onBeforeDayChange,
	onWithinDayChange,
	onPriceChange,
	onRemove,
	showRemoveButton = true,
	isBeforeDayDisabled = false,
	hasSubmitted = false,
	isSavingDraft = false,
	isDisabled = false,
}) => {
	return (
		<Components.Row>
			<Components.StyledCell width='260px'>
				課程前
				<StableInput
					name={`beforeDay-${id}`}
					placeholder=''
					width='55px'
					margin='0 10px'
					isRequired
					isNumberOnly
					value={beforeDay}
					onChange={onBeforeDayChange}
					hasSubmitted={hasSubmitted}
					isSavingDraft={isSavingDraft}
					isDisabled={isDisabled || isBeforeDayDisabled}
				/>
				至
				<StableInput
					name={`withinDay-${id}`}
					placeholder=''
					width='55px'
					margin='0 10px'
					isRequired
					isNumberOnly
					value={withinDay}
					onChange={onWithinDayChange}
					hasSubmitted={hasSubmitted}
					isSavingDraft={isSavingDraft}
					isDisabled={isDisabled}
				/>
				日內
			</Components.StyledCell>
			<Components.StyledCell width='430px'>
				更改時段酌收時段費
				<StableInput
					name={`price-${id}`}
					placeholder=''
					width='125px'
					margin='0 10px'
					isRequired
					isNumberOnly
					value={price}
					onChange={onPriceChange}
					startAdornment={<Components.StyledAdornment type='start'>NT$</Components.StyledAdornment>}
					hasSubmitted={hasSubmitted}
					isSavingDraft={isSavingDraft}
					isDisabled={isDisabled}
				/>
				/ 人，於上課當日繳交
			</Components.StyledCell>
			{!isDisabled && (
				<Components.StyledCell width='60px'>
					<CoreButton
						color='error'
						variant='text'
						label='移除'
						onClick={onRemove}
						margin='0 12px 0 0'
						sx={{ fontWeight: 400 }}
					/>
				</Components.StyledCell>
			)}
		</Components.Row>
	);
};

export default PolicyTwoItem;
