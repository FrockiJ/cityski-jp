import { TabProps, Tabs, TabsProps } from '@mui/material';

import { StyledTab } from './styles';

export const CoreTab = (props: TabProps) => <StyledTab disableRipple {...props} />;

const CoreTabs = ({ children, ...restProps }: TabsProps) => {
	return <Tabs {...restProps}>{children}</Tabs>;
};

export default CoreTabs;
