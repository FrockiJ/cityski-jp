import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

import Button from '@/components/Project/Shared/Common/Button';
import Modal from '@/components/Project/Shared/Common/Modal';
import { setAuthToken, setUserInfo } from '@/state/slices/authSlice';

interface ConfirmLogoutModalProps {
	isOpen: boolean;
	onClose: () => void;
}

function ConfirmLogoutModal({ isOpen, onClose }: ConfirmLogoutModalProps) {
	const dispatch = useDispatch();
	const router = useRouter();

	const handleLogout = () => {
		dispatch(setAuthToken(''));
		dispatch(setUserInfo(null));
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('line_auth_state');
		localStorage.removeItem('line_auth_redirect');
		sessionStorage.setItem('isLoggingOut', 'true');
		router.replace('/login');
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title='確認登出' footer={<Button onClick={handleLogout}>確認登出</Button>}>
			<div className='px-8 pt-4 pb-10 w-full max-w-[400px]'>
				<p>一但登出，將不會儲存目前的操作，是否確認要登出？</p>
			</div>
		</Modal>
	);
}

export default ConfirmLogoutModal;
