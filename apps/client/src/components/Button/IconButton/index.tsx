import AgreementIcon from '@/components/Icon/AgreementIcon';
import DownloadIcon from '@/components/Icon/DownloadIcon';
import HistoryIcon from '@/components/Icon/HistoryIcon';
import LogoutIcon from '@/components/Icon/LogoutIcon';
import OrderIcon from '@/components/Icon/OrderIcon';
import PasswordIcon from '@/components/Icon/PasswordIcon';
import ProfileIcon from '@/components/Icon/ProfileIcon';
import ShieldIcon from '@/components/Icon/ShieldIcon';
import SuccessIcon from '@/components/Icon/SuccessIcon';

export default function IconButton({ icon, title, onClick, isActive }) {
	const iconClass = 'fill-[#818181] hover:fill-[#2B2B2B] active:fill-white';
	return (
		<button
			className={
				'py-2.5 px-3 flex gap-2 hover:bg-[#EDEDED] active:bg-[#2B2B2B] text-sm leading-6	 hover:text-[#2B2B2B] active:text-white items-center rounded-lg	' +
				(isActive ? 'bg-[#2B2B2B] text-white' : 'bg-white text-[#818181]')
			}
			onClick={onClick}
		>
			{icon === 'agreement' && <AgreementIcon width='20' height='20' className={iconClass} />}
			{icon === 'download' && <DownloadIcon width='20' height='20' className={iconClass} />}
			{icon === 'history' && <HistoryIcon width='20' height='20' className={iconClass} />}
			{icon === 'logout' && <LogoutIcon width='20' height='20' className={iconClass} />}
			{icon === 'order' && <OrderIcon width='20' height='20' className={iconClass} />}
			{icon === 'password' && <PasswordIcon width='20' height='20' className={iconClass} />}
			{icon === 'profile' && <ProfileIcon width='20' height='20' className={iconClass} />}
			{icon === 'shield' && <ShieldIcon width='20' height='20' className={iconClass} />}
			{icon === 'success' && <SuccessIcon width='20' height='20' className={iconClass} />}
			{title}
		</button>
	);
}
