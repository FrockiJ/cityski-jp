import CoreButton, { CoreButtonProps } from '@/CIBase/CoreButton';

import TableBreadcrumbs from '../TableBreadcrumbs';
import TableTitle from '../TableTitle';
import TableWrapper from '../TableWrapper';

import { StyledTitleWrapper } from './styles';

type TablePageLayout = {
	title: string;
	children: React.ReactNode;
	disableBreadcrumbs?: boolean;
	handleAction?: () => void;
	coreButtonProps?: CoreButtonProps;
	handleActionList?: React.ReactNode;
};

/**
 * Wrapper for Rendering Table Layouts for CI Modules.
 *
 * @param title - Title of the entire table page
 * @param children - For rendering the children elements wrapped by this HOC
 * @param handleAction - Callback function for handling the action button
 * @param coreButtonProps - Status for styling the action button, default parameter: { variant: 'contained', iconType: 'add', label: 'Add' }
 * @param disableBreadcrumbs - whether to show breadcrumbs
 * @param handleActionList - For rendering the button elements with callback function wrapped by this HOC
 */
const TablePageLayout = ({
	title,
	children,
	handleAction,
	handleActionList,
	coreButtonProps,
	disableBreadcrumbs = false,
}: TablePageLayout) => {
	return (
		<>
			{/* Table Page Title */}
			<StyledTitleWrapper>
				<TableTitle>{title}</TableTitle>
				{/* Create Button */}
				{handleAction && (
					<CoreButton
						variant={coreButtonProps?.variant ?? 'contained'}
						iconType={coreButtonProps?.iconType ?? 'add'}
						label={coreButtonProps?.label ?? 'Add'}
						onClick={handleAction}
					/>
				)}
				{/* Button List */}
				{handleActionList && handleActionList}
			</StyledTitleWrapper>

			{/* Table Page Breadcrumbs */}
			{!disableBreadcrumbs ? <TableBreadcrumbs /> : <br />}

			{/* Table Content Area */}
			<TableWrapper>{children}</TableWrapper>
		</>
	);
};

export default TablePageLayout;
