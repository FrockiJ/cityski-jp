'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { AuthGuard } from '@/components/Layout/AuthGuard';
import ChangePassword from '@/components/Project/Member/ChangePassword';
import CurrentOrders from '@/components/Project/Member/CurrentOrders';
import PersonalInfo from '@/components/Project/Member/PersonalInfo';
import Sidebar from '@/components/Project/Member/Sidebar';
import Terms from '@/components/Project/Member/Terms';

interface Props {
	params: { id: string };
	searchParams: { section?: string };
}

const MemberPage = ({ params, searchParams }: Props) => {
	const router = useRouter();
	const urlSearchParams = useSearchParams();
	const [currentSection, setCurrentSection] = useState(searchParams.section || 'personal-info');

	// Handle section changes
	useEffect(() => {
		const section = urlSearchParams.get('section');
		if (section) {
			setCurrentSection(section);
		}
	}, [urlSearchParams]);

	const handleSectionChange = (section: string) => {
		setCurrentSection(section);
		router.replace(`/member?section=${section}`, { scroll: false });
	};

	const renderSection = () => {
		switch (currentSection) {
			case 'personal-info':
				return <PersonalInfo />;
			case 'change-password':
				return <ChangePassword />;
			case 'current-orders':
				return <CurrentOrders />;
			case 'order-history':
				return <div>Order History Component</div>;
			case 'terms':
				return <Terms />;
			default:
				return <PersonalInfo />;
		}
	};

	return (
		<div className='flex overflow-hidden flex-col bg-white pt-1'>
			<div className='flex flex-col self-center mt-20 w-full max-w-[1200px] max-xs:mt-0 max-xs:max-w-full'>
				<h1 className='self-start text-3xl font-medium tracking-tighter leading-none text-zinc-800 max-xs:hidden'>
					會員專區
				</h1>
				<div className='mt-6 max-xs:max-w-full max-xs:mt-0'>
					<div className='flex gap-5 max-xs:flex-col'>
						<div className='max-xs:hidden'>
							<Sidebar memberId={params.id} activeSection={currentSection} onSectionChange={handleSectionChange} />
						</div>
						<div className='flex-1'>{renderSection()}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthGuard(MemberPage);
