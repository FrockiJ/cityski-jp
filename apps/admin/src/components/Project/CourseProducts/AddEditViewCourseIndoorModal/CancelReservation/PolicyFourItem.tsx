import React from 'react';

import * as Components from '@/components/Project/shared/Components';

const PolicyFourItem: React.FC = () => {
	return (
		<Components.Row>
			<Components.StyledCell width='260px'>課程當日</Components.StyledCell>
			<Components.StyledCell width='430px'>依取消辦法申請退費</Components.StyledCell>
			<Components.StyledCell width='60px'></Components.StyledCell>
		</Components.Row>
	);
};

export default PolicyFourItem;
