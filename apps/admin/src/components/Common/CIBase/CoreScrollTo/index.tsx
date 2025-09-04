import ChevronIcon from '@/Icon/ChevronIcon';

import { ToTop } from './styles';

export interface CoreScrollToProps {
	click: () => void;
}

const CoreScrollTo = ({ click }: CoreScrollToProps) => {
	return (
		<ToTop aria-label='to top' onClick={click}>
			<ChevronIcon direction='up' />
		</ToTop>
	);
};

export default CoreScrollTo;
