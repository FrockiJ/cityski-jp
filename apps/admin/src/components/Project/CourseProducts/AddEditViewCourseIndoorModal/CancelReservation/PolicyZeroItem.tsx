import React from 'react';

import * as Components from '@/components/Project/shared/Components';

const PolicyZeroItem: React.FC = () => {
	return (
		<Components.Row>
			<Components.StyledCell width='260px'>課程當日</Components.StyledCell>
			<Components.StyledCell width='430px'>臨時請假需出示醫師證明或報案三聯單。</Components.StyledCell>
			<Components.StyledCell width='60px'></Components.StyledCell>
		</Components.Row>
	);
};

export default PolicyZeroItem;
