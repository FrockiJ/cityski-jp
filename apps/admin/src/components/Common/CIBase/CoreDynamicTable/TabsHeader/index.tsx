import React, { useState } from 'react';
import { Box, SxProps, Tab, Tabs, Theme, useTheme } from '@mui/material';

import { StyledTabCount, StyledTabLabel } from './styles';

interface TabsHeaderProps {
	tabs: string[] | {};
	counts?: (number | null)[];
	children?: React.ReactNode;
	sx?: SxProps<Theme> | undefined;
	onChange?: (event: React.SyntheticEvent, newValue: number) => void;
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index } = props;

	return <div hidden={value !== index}>{value === index && <>{children}</>}</div>;
}

const TabsHeader = ({ children, tabs, counts, sx, onChange }: TabsHeaderProps) => {
	const theme = useTheme();
	const [value, setValue] = useState(0);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
		if (onChange) onChange(event, newValue);
	};
	const tabArr = Array.isArray(tabs) ? tabs : Object.values(tabs);

	return (
		<>
			<Box sx={{ background: '#f7f8f9', width: '100%', padding: '0 8px', ...sx }}>
				<Tabs
					value={value}
					onChange={handleChange}
					textColor='primary'
					TabIndicatorProps={{
						style: { background: theme.palette.background.default },
					}}
				>
					{tabArr.map((tab, index) => (
						<Tab
							value={index}
							label={
								<StyledTabLabel>
									<>
										{counts && counts?.[index] !== null && <StyledTabCount>{counts?.[index]}</StyledTabCount>}
										{tab}
									</>
								</StyledTabLabel>
							}
							key={index}
						/>
					))}
				</Tabs>
			</Box>
			{React.Children.map(children, (child, index) => (
				<CustomTabPanel key={index} value={value} index={index}>
					{child}
				</CustomTabPanel>
			))}
		</>
	);
};
export default TabsHeader;
