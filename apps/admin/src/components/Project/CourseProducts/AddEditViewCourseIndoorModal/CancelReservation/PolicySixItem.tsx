import React from 'react';

import * as Components from '@/components/Project/shared/Components';

import { StableInput } from './StableInput';

interface Props {
	id?: string;
	beforeDay?: string;
	onBeforeDayChange?: (value: string) => void;
	isDisabled?: boolean;
	hasSubmitted?: boolean;
	isSavingDraft?: boolean;
}

const PolicySixItem: React.FC<Props> = ({
	id = 'free-change',
	beforeDay = '',
	onBeforeDayChange,
	isDisabled = true, // Default to disabled
	hasSubmitted = false,
	isSavingDraft = false,
}) => {
	// Handle input changes directly
	const handleChange = (value: string) => {
		if (onBeforeDayChange) {
			onBeforeDayChange(value);
		}
	};

	return (
		<Components.Row>
			<Components.StyledCell width='260px'>
				課程前
				<StableInput
					name={`free-change-${id}`}
					placeholder=''
					width='55px'
					margin='0 10px'
					isRequired
					isNumberOnly
					value={beforeDay}
					onChange={handleChange}
					isDisabled={isDisabled}
					hasSubmitted={hasSubmitted}
					isSavingDraft={isSavingDraft}
				/>
				日以上
			</Components.StyledCell>
			<Components.StyledCell width='430px'>在尚有時段/梯次名額下，可免費更改時間。</Components.StyledCell>
			<Components.StyledCell width='60px'></Components.StyledCell>
		</Components.Row>
	);
};

export default PolicySixItem;
