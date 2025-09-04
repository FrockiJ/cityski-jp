import React from 'react';

import * as Components from '@/components/Project/shared/Components';

import { StableInput } from './StableInput';

interface Props {
	id: string;
	withinDay?: string;
	price?: string;
	onWithinDay2Change?: (value: string) => void;
	onPriceChange?: (value: string) => void;
	onRemove?: () => void;
	showRemoveButton?: boolean;
	hasSubmitted?: boolean;
	isSavingDraft?: boolean;
	isDisabled?: boolean;
}

const PolicyFiveItem: React.FC<Props> = ({
	id,
	withinDay = '',
	onWithinDay2Change,
	hasSubmitted = false,
	isSavingDraft = false,
	isDisabled = false,
}) => {
	return (
		<Components.Row>
			<Components.StyledCell width='260px'>
				課程前
				<StableInput
					name={`withinDay-${id}-2`}
					placeholder=''
					width='55px'
					margin='0 10px'
					isRequired
					isNumberOnly
					value={withinDay}
					onChange={onWithinDay2Change}
					hasSubmitted={hasSubmitted}
					isSavingDraft={isSavingDraft}
					isDisabled={isDisabled}
				/>
				日內
			</Components.StyledCell>
			<Components.StyledCell width='430px'>依取消辦法申請退費</Components.StyledCell>
			<Components.StyledCell width='60px'></Components.StyledCell>
		</Components.Row>
	);
};

export default PolicyFiveItem;
