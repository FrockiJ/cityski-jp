import * as React from 'react';

import Button from '@/components/Project/Shared/Common/Button';
import Modal from '@/components/Project/Shared/Common/Modal';

interface EmailAlreadyExistModalProps {
	email: string;
	isOpen: boolean;
	reason: string;
	onClose: () => void;
}

function EmailAlreadyExistModal({ email, isOpen, reason, onClose }: EmailAlreadyExistModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title='無法註冊' footer={<Button onClick={onClose}>我知道了</Button>}>
			<div className='px-8 pt-4 pb-10 w-full max-w-[400px]'>
				{reason === 'line occupied' ? (
					<p>
						我們發現你曾使用過電子郵件 <span className='font-bold'>{email}</span>{' '}
						註冊過CitySki帳號，請使用「LINE快速登入」進入本平台，若有相關疑問，請洽CitySki工作人員，感謝。
					</p>
				) : (
					<p>
						我們發現你曾使用過電子郵件 <span className='font-bold'>{email}</span>{' '}
						註冊過CitySki帳號，請登入會員，若有相關疑問，請洽CitySki工作人員，感謝。
					</p>
				)}
			</div>
		</Modal>
	);
}

export default EmailAlreadyExistModal;
