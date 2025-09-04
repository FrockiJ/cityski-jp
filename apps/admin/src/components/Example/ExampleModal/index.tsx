import { Box } from '@mui/material';

import CoreButton from '@/CIBase/CoreButton';
import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import useModalProvider from '@/hooks/useModalProvider';

interface ExampleModalProps {
	onClick?: () => void;
}

const ExampleModal = ({ onClick: _close }: ExampleModalProps) => {
	const modal = useModalProvider();

	const handleOpenModal2 = () => {
		modal.openModal({
			title: 'Modal Layer 2',
			width: 500,
			children: (
				<CoreModalContent>
					Hi! This is modal 2! This modal is currently not styled tho...
					<p>You can open modal infinitely.</p>
				</CoreModalContent>
			),
		});
	};

	// const onConfirm = () => {
	// 	close?.();
	// };

	// const onCancel = () => {
	// 	close?.();
	// };

	return (
		<>
			<CoreModalContent>
				<Box>
					<CoreButton
						variant='contained'
						color='primary'
						label='Open Modal 2'
						width={120}
						onClick={() => handleOpenModal2()}
					/>
				</Box>
				{[...new Array(50)]
					.map(
						() => `Cras mattis consectetur purus sit amet fermentum.
									 Cras justo odio, dapibus ac facilisis in, egestas eget quam.
									 Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
									 Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
					)
					.join('\n')}
			</CoreModalContent>
		</>
	);
};

export default ExampleModal;
