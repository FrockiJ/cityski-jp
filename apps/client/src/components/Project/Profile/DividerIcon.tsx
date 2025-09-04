const DividerIcon = ({ className = '' }: { className?: string }) => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' width='2' height='16' viewBox='0 0 2 16' fill='none' className={className}>
			<path opacity='0.5' d='M1 0V16' stroke='currentColor' />
		</svg>
	);
};

export default DividerIcon;
