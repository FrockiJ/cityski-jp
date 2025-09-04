import { Box } from '@mui/material';
import { DialogAction, MessageType } from '@repo/shared';
import PropsLink from 'src/template-only/components/PropsLink';

import CoreButton from '@/CIBase/CoreButton';
import CoreLabel from '@/CIBase/CoreLabel';
import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import PageControl from '@/components/PageControl';
import ExampleModal from '@/Example/ExampleModal';
import FullExampleModal from '@/Example/ExampleModal/FullExampleModal';
import Intro from '@/Example/Intro';
import useModalProvider from '@/hooks/useModalProvider';
import { SizeBreakPoint } from '@/shared/types/general';
import { showToast } from '@/utils/ui/general';

const Demo = ({ text }: { text: string }) => <p>{text}</p>;

const ModalDocs = () => {
	const modal = useModalProvider();

	const handleOpenModal = () => {
		modal.openModal({
			title: 'Modal',
			children: <Demo text='Modal' />,
			center: false,
		});
	};

	const handleOpenHideActionModal = () => {
		modal.openModal({
			title: 'Hide Action',
			noAction: true,
			children: <Demo text='using noAction: boolean to Hide action' />,
		});
	};

	const handleOpenDynamicModal = () => {
		modal.openModal({
			title: 'Dynamic modal',
			noAction: true,
			children: <ExampleModal />,
		});
	};
	const handleDisabledbackAndEscModal = () => {
		modal.openModal({
			title: 'disabled backdrop And Esc modal',
			noEscAndBackdrop: true,
			children: <ExampleModal />,
		});
	};

	const handleOpenModalMessage = () => {
		modal.openMessageModal({
			type: MessageType.CONFIRM,
			title: 'Modal Message confirm',
			content: 'This is confirm message modal',
			confirmLabel: '確認',
		});
	};

	const handleOpenModalDeleteMessage = () => {
		modal.openMessageModal({
			type: MessageType.ERROR,
			title: '一但刪除，將會從後台移除',
			content: '一但刪除，將會從後台移除',
			confirmLabel: '刪除',
			onClose(action: DialogAction) {
				if (action === DialogAction.CONFIRM) {
					showToast('已成功刪除', 'success');
				}
			},
		});
	};

	const handleOpenModalWarningMessage = () => {
		modal.openMessageModal({
			type: MessageType.WARNING,
			title: 'Modal Message warning',
			content: 'This is warning message modal',
			confirmLabel: '確認',
		});
	};
	const handleOpenModalInfoMessage = () => {
		modal.openMessageModal({
			type: MessageType.INFO,
			title: 'Modal Message info',
			content: 'This is info message modal',
			confirmLabel: '確認',
		});
	};

	const handleOpenModalWithSize = (size: SizeBreakPoint) => {
		modal.openModal({
			title: `${size}`,
			children: <CoreModalContent>This is {size} modal</CoreModalContent>,
			size: size,
		});
	};

	const handleOpenModalWithWidth = (width: string) => {
		modal.openModal({
			title: 'Custom width',
			children: <CoreModalContent>This is width: {width} modal</CoreModalContent>,
			width: width,
		});
	};

	const handleOpenModalWithFullScreen = () => {
		modal.openModal({
			title: 'Full Screen',
			children: <FullExampleModal content='This is fullScreen modal' />,
			fullScreen: true,
		});
	};

	return (
		<>
			<PageControl title='modal' hasNav />

			<PropsLink url={'/docs/props/modal'} />
			<Intro
				title='How to use the Modal component'
				content='First import useModalProvider which support openModal and openMessageModal method to create modal, then create your own modal template and pass the template to as children to the redux modal state (along with additional props like width and size...etc) when dispatching the openModal action. See code for better understanding'
			/>
			<Box sx={{ '& button': { m: 2, ml: 0, mb: 1 } }}>
				<CoreButton label='Open Modal' onClick={() => handleOpenModal()} />
				<CoreButton label='Hide action Modal' onClick={() => handleOpenHideActionModal()} />
				<CoreButton label='Dynamic Modal' onClick={() => handleOpenDynamicModal()} />
				<CoreButton label='disabled backdrop and esc Modal' onClick={() => handleDisabledbackAndEscModal()} />
			</Box>
			<Intro
				title='Message Modal'
				content={
					<>
						You only need to set a <CoreLabel color='info'>content</CoreLabel> to{' '}
						<CoreLabel color='primary'>openMessageModal</CoreLabel> to custom message modal
					</>
				}
			/>
			<Box sx={{ '& button': { m: 2, ml: 0, mb: 1 } }}>
				<CoreButton label='Open confirm Modal' onClick={() => handleOpenModalMessage()} />
				<CoreButton iconType='delete' label='Open delete Modal' onClick={() => handleOpenModalDeleteMessage()} />
				<CoreButton iconType='warning' label='Open warning Modal' onClick={() => handleOpenModalWarningMessage()} />
				<CoreButton
					variant='contained'
					color='info'
					label='Open info Modal'
					onClick={() => handleOpenModalInfoMessage()}
				/>
			</Box>
			<Intro
				title='Size Modal'
				content={
					<>
						You can set the <CoreLabel color='info'>size</CoreLabel> on <CoreLabel color='primary'>openModal</CoreLabel>
						, and the allowed values are: <CoreLabel color='info'>small</CoreLabel> (480px, default),{' '}
						<CoreLabel color='info'>medium</CoreLabel> (720px), and <CoreLabel color='info'>large</CoreLabel> (1000px).
						<br />
						If you want to customize the width, you can set the value of <CoreLabel color='info'>
							width
						</CoreLabel> on <CoreLabel color='primary'>openModal</CoreLabel>.
					</>
				}
			/>
			<Box sx={{ '& button': { m: 2, ml: 0, mb: 1 } }}>
				<CoreButton label='Open Small Modal' onClick={() => handleOpenModalWithSize('small')} />
				<CoreButton label='Open Medium Modal' onClick={() => handleOpenModalWithSize('medium')} />
				<CoreButton label='Open Large Modal' onClick={() => handleOpenModalWithSize('large')} />
				<CoreButton label='Open Custom Width Modal' onClick={() => handleOpenModalWithWidth('900px')} />
			</Box>
			<Intro
				title='FullScreen Modal'
				content={
					<>
						You can set the <CoreLabel color='info'>fullScreen: true</CoreLabel> on{' '}
						<CoreLabel color='primary'>openModal</CoreLabel>
					</>
				}
			/>
			<CoreButton label='Open Custom Width Modal' onClick={() => handleOpenModalWithFullScreen()} />
		</>
	);
};

export default ModalDocs;
