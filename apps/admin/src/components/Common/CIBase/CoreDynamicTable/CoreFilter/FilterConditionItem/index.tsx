import { FilterConditionCategory, StyledFilterConditionItem } from '../styles';

interface FilterConditionItemProps {
	categoryLabel: string;
	children: React.ReactNode;
}
export const FilterConditionItem = ({ categoryLabel, children }: FilterConditionItemProps) => {
	return (
		<StyledFilterConditionItem>
			{categoryLabel && <FilterConditionCategory>{categoryLabel}</FilterConditionCategory>}
			{children}
		</StyledFilterConditionItem>
	);
};
