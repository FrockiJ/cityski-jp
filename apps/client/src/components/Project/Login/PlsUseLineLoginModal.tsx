import * as React from 'react';

import Button from '@/components/Project/Shared/Common/Button';
import Modal from '@/components/Project/Shared/Common/Modal';

import LineLoginButton from './LineLoginButton';

interface PlsUseLineLoginModalProps {
	isOpen: boolean;
	onClose: () => void;
}

function PlsUseLineLoginModal({ isOpen, onClose }: PlsUseLineLoginModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='請使用LINE帳號登入'
			footer={
				<>
					<Button variant='secondary' onClick={onClose}>
						返回
					</Button>
					<LineLoginButton theme='dark' />
				</>
			}
		>
			<div className='px-8 pt-4 pb-10 w-full max-w-[400px]'>
				<p>
					您原先是使用 LINE 登入的會員，請點擊「透過LINE登入」進行快速登入。若有相關疑問，請洽CitySki工作人員，感謝。
				</p>
			</div>
		</Modal>
	);
}

export default PlsUseLineLoginModal;
