import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ValidateInvitationResponseDto } from '@repo/shared';

import api from '@/lib/api';

interface InvitationInfo {
	courseName: string;
	orderId: string;
	inviterName: string;
}

interface UseInvitationResult {
	invitationInfo: InvitationInfo | null;
	loading: boolean;
	validateInvitation: (token: string) => Promise<boolean>;
	redeemInvitation: (token: string, accessToken: string) => Promise<string | null>;
}

export const useInvitation = (): UseInvitationResult => {
	const [invitationInfo, setInvitationInfo] = useState<InvitationInfo | null>(null);
	const [loading, setLoading] = useState(false);

	const validateInvitation = useCallback(async (token: string): Promise<boolean> => {
		if (!token) return false;

		setLoading(true);
		try {
			const response = await api.get<{ result: ValidateInvitationResponseDto }>(
				`/api/order-invitations/validate/${token}`
			);
			const data = response.data.result;

			if (data.valid) {
				setInvitationInfo({
					courseName: data.order?.coursePlan?.course?.name || '課程',
					orderId: data.order?.id || '',
					inviterName: data.inviter?.name || '朋友',
				});
				return true;
			}
			return false;
		} catch (error: any) {
			console.error('驗證邀請碼失敗:', error);
			toast.error('邀請連結無效或已過期');
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	const redeemInvitation = useCallback(
		async (token: string, accessToken: string): Promise<string | null> => {
			if (!token || !invitationInfo) return null;

			try {
				await api.post(
					`/api/order-invitations/redeem/${token}`,
					{},
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				toast.success(`成功加入 ${invitationInfo.courseName} 課程！`);
				return invitationInfo.orderId;
			} catch (error: any) {
				console.error('兌換邀請失敗:', error);
				toast.error(error.response?.data?.message || '加入課程失敗');
				return null;
			}
		},
		[invitationInfo]
	);

	return {
		invitationInfo,
		loading,
		validateInvitation,
		redeemInvitation,
	};
};
