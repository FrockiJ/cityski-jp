'use client';
import { useAppSelector } from '@/state/store';

import { ModalProps } from '../../../../../shared/core/Types/modal';

import Modal from './Wrapper';

/**
 * You can open an unlimited number of modals with redux, and they will stack on top of each other.
 */
const CoreBasicModal = () => {
	const modalList: ModalProps[] = useAppSelector((state) => state.layout.modalList);

	return (
		<>
			{modalList.map((option: ModalProps) => (
				<Modal key={option.id} {...option} />
			))}
		</>
	);
};

export default CoreBasicModal;
