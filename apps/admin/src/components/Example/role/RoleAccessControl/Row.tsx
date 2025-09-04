import React from 'react';

import { StyledRow } from './styles';
import { Header } from './tableConfig';

interface RowProps {
	children: React.ReactNode;
	header?: boolean;
}

const Row = ({ children, header = false }: RowProps) => {
	return (
		<StyledRow header={header}>
			{React.Children.map(children, (child, index) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(child as React.ReactElement, {
						...(Header[index].width && { width: `${Header[index].width}px` }),
						hasDiv: index > 0 && Header[index].name,
					});
				}
				return child;
			})}
		</StyledRow>
	);
};

export default Row;
