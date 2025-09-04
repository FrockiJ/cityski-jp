import HTMLReactParser from 'html-react-parser';

import CoreModalContent from '@/CIBase/CoreModal/ModalContent';

const FullExampleModal = ({ content }: { content: string; onClick?: () => void }) => {
	return (
		<>
			<CoreModalContent>{content && HTMLReactParser(content)}</CoreModalContent>
		</>
	);
};

export default FullExampleModal;
