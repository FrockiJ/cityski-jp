import Calendar from '@/components/Project/Calendar';
import { PermissionsProps } from '@/shared/types/auth';

interface DashboardProps extends PermissionsProps {}

const Dashboard = ({}: DashboardProps) => {
	return <Calendar />;
};

export default Dashboard;
