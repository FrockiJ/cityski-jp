import { MessageType } from '@repo/shared';

import CoreSwitch from '@/CIBase/CoreSwitch';
import useModalProvider from '@/hooks/useModalProvider';
import { showToast } from '@/utils/ui/general';

const AccountSwitch = ({ mutate, onClick: close }: { row: any; mutate: any; onClick?: () => void }) => {
	const modal = useModalProvider();

	const handleSwitchModal = (checked: boolean) => {
		if (checked) {
			showToast('已開通', 'success');
			mutate();
			close?.();
			return;
		}
		modal.openMessageModal({
			type: MessageType.ERROR,
			title: '停用人員',
			content: '請確認是否停用該人員',
			confirmLabel: '停用',
			onClose: () => {
				showToast('已停權', 'success');
				mutate();
				close?.();
			},
		});
	};

	return (
		<CoreSwitch
			color='primary'
			label='啟用/停用'
			onChange={({ target: { checked } }) => {
				handleSwitchModal(checked);
			}}
			// checked
			// disabled
		/>
	);
};

export default AccountSwitch;
