import {
	StyledInfoCardCoreWrap,
	StyledInfoCardImage,
	StyledInfoCardSubtitle,
	StyledInfoCardSubtitleDesc,
	StyledInfoCardSubtitleIcon,
	StyledInfoCardSubtitlePercent,
	StyledInfoCardTitle,
	StyledInfoCardValue,
	StyledInfoCardWrap,
	trendChoice,
} from './styles';

export type CoreInfoCardProps = {
	title: string;
	value: string;
	subtitle: string;
	chart: string;
	width?: string;
	height?: string;
	margin?: string;
	index?: number;
};

function CoreInfoCard({ title, value, subtitle, chart, ...rest }: CoreInfoCardProps) {
	const trend = subtitle.includes('+') ? trendChoice[0] : subtitle.includes('-') ? trendChoice[1] : trendChoice[0];

	const renderSubtitleArea = (subtitle: string) => {
		// Split subtitle between the % value and the description
		const startIndex = trend === trendChoice[0] ? subtitle.indexOf('+') : subtitle.indexOf('-');
		const endIndex = subtitle.indexOf('%') + 1;
		const percent = subtitle.split('').slice(startIndex, endIndex).join('');
		const description = subtitle.split('').slice(endIndex).join('');

		return (
			<StyledInfoCardSubtitle>
				{/* Render trend icon based on value */}
				{trend === trendChoice[0] ? (
					<StyledInfoCardSubtitleIcon trend={trend}>
						<img alt='up-trend-icon' style={{ width: '16px', height: '16px' }} src='/images/demo/up-trend-icon.png' />
					</StyledInfoCardSubtitleIcon>
				) : (
					<StyledInfoCardSubtitleIcon trend={trend}>
						<img
							alt='down-trend-icon'
							style={{ width: '16px', height: '16px' }}
							src='/images/demo/down-trend-icon.png'
						/>
					</StyledInfoCardSubtitleIcon>
				)}
				<StyledInfoCardSubtitlePercent>{percent}</StyledInfoCardSubtitlePercent>
				<StyledInfoCardSubtitleDesc>{description}</StyledInfoCardSubtitleDesc>
			</StyledInfoCardSubtitle>
		);
	};

	return (
		<StyledInfoCardWrap {...rest}>
			<StyledInfoCardTitle>{title}</StyledInfoCardTitle>
			<StyledInfoCardCoreWrap>
				<StyledInfoCardValue>{value}</StyledInfoCardValue>
				<StyledInfoCardImage
					src={
						chart === 'yes' && trend === trendChoice[0]
							? '/images/demo/up-chart.png'
							: chart === 'yes' && trend === trendChoice[1]
								? '/images/demo/down-chart.png'
								: '/images/demo/mid-chart.png'
					}
				/>
			</StyledInfoCardCoreWrap>
			{renderSubtitleArea(subtitle)}
		</StyledInfoCardWrap>
	);
}

export default CoreInfoCard;
