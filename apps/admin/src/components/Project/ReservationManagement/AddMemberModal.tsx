import React from 'react';
import { Stack } from '@mui/material';

import SearchBar from '@/components/Common/CIBase/CoreDynamicTable/SearchBar';

type Props = {};

const AddMemberModal = (props: Props) => {
	return (
		<Stack py={3}>
			<SearchBar title='搜尋會員帳號' value='' onChange={() => {}} placeholder='搜尋姓名、手機或是Email' />
		</Stack>
	);
};

export default AddMemberModal;
