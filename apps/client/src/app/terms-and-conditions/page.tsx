'use client';

import Desktop from '@/components/Project/TermsAndConditions/Desktop';
import Mobile from '@/components/Project/TermsAndConditions/Mobile';

export default function Membership() {
	const menus = [
		{ id: 1, title: '課程約定事項', icon: 'download' },
		{ id: 2, title: '使用者同意書', icon: 'success' },
		{ id: 3, title: '隱私權政策', icon: 'shield' },
	];

	return (
		<>
			<Mobile menus={menus} />
			<Desktop menus={menus} />
		</>
	);
}
