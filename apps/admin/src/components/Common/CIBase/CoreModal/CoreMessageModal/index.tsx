import { MessageModalProps } from '@/shared/core/Types/modal';
import { useAppSelector } from '@/state/store';

import Modal from './Wrapper';

/**
 * You can open an unlimited number of message modals with redux, and they will stack on top of each other.
 */
const CoreMessageModal = () => {
	const messageModalList: MessageModalProps[] = useAppSelector((state) => state.layout.messageModalList);

	return (
		<>
			{messageModalList.map((option: MessageModalProps) => (
				<Modal key={option.id} {...option} />
			))}
		</>
	);
};

export default CoreMessageModal;
