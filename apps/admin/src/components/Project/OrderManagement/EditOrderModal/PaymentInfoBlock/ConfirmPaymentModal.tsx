import React from 'react';

type Props = {
	type: 'downPayment' | 'closePayment';
};

const ConfirmPaymentModal = (props: Props) => {
	return props.type === 'downPayment' ? (
		<div>請確認是否收到訂金？一旦確認便無法恢復前一個狀態。</div>
	) : (
		<div>請確認是否結清？一旦確認便無法恢復前一個狀態。</div>
	);
};

export default ConfirmPaymentModal;
