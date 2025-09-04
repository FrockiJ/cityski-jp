import { StyledDataCardValue, StyledDataCardWrap } from './styles';

type CardType = 'Overdue' | 'Processing' | 'Rejected' | 'Draft';
export type CoreDataCardProps = {
	title: string;
	value: string;
	width?: string;
	height?: string;
	margin?: string;
	index?: number;
	colors?: { backgroundColor: string; color: string };
};

function CoreDataCard({ title, value, colors, ...rest }: CoreDataCardProps) {
	const formatColors = (text: CardType) => {
		if (!colors) return;
		const { backgroundColor, color } = colors;
		// console.log('@Card @DataCard backgroundColor, color', backgroundColor, color);

		switch (text) {
			case 'Overdue':
				return {
					backgroundColor: backgroundColor ? backgroundColor : '#FFE9D5',
					color: color ? color : '#7A0916',
				};

			case 'Processing':
				return {
					backgroundColor: backgroundColor ? backgroundColor : '#C8FACD',
					color: color ? color : '#005249',
				};

			case 'Rejected':
				return {
					backgroundColor: backgroundColor ? backgroundColor : '#FFF5CC',
					color: color ? color : '#7A4100',
				};

			case 'Draft':
				return {
					backgroundColor: backgroundColor ? backgroundColor : '#EDEFF2',
					color: color ? color : '#003768',
				};
		}
	};

	// console.log('@Card @DataCard colors', colors);
	return (
		<StyledDataCardWrap colors={formatColors(title as CardType)} {...rest}>
			<StyledDataCardValue>{value}</StyledDataCardValue>
			{title}
		</StyledDataCardWrap>
	);
}

export default CoreDataCard;
