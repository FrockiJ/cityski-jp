import { useState } from 'react';

import IconButton from '@/components/Button/IconButton';

import Agreement from './Agreement';
import Course from './Course';
import Privacy from './Privacy';

export default function Desktop({ menus }) {
	const [id, setId] = useState(1);
	const menu = menus.find((m) => m.id === id);

	return (
		<section className='hidden xs:flex container flex-col '>
			<div className='mt-10 text-2xl font-medium leading-8 mb-6 xs:text-[32px] xs:mt-[100px] xs:mb-8'>會員條款</div>
			<div className='flex gap-6'>
				<div>
					<div className='flex flex-col p-6 border-[1px] border-[#D7D7D7] rounded-2xl	'>
						{menus.map((menu) => {
							return (
								<IconButton
									key={menu.id}
									icon={menu.icon}
									title={menu.title}
									onClick={() => setId(menu.id)}
									isActive={id === menu.id}
								/>
							);
						})}
					</div>
				</div>
				<div className='flex-1 p-8 pl-11 border-[1px] border-[#D7D7D7] rounded-2xl	'>
					<div className='flex-1 text-[26px] font-medium mb-5'>{menu.title}</div>
					{id === 1 && <Course />}
					{id === 2 && <Agreement />}
					{id === 3 && <Privacy />}
				</div>
			</div>
		</section>
	);
}
