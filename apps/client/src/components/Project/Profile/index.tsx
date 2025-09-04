import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import ProfileImage from './ProfileImage';
import UserProfileCard from './UserProfileCard';

interface ProfileProps {
	onLogout: () => void;
	src?: string;
	name?: string;
	memberNo?: string;
}

const Profile: React.FC<ProfileProps> = ({ onLogout, src, name, memberNo }) => {
	const [isCardVisible, setIsCardVisible] = useState(false);
	const profileRef = useRef<HTMLDivElement>(null);
	const currentPath = usePathname();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
				setIsCardVisible(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleNavigation = (newPath: string) => {
		if (currentPath !== newPath) {
			setIsCardVisible(false);
		}
	};

	return (
		<div className='relative' ref={profileRef}>
			<button onClick={() => setIsCardVisible(!isCardVisible)}>
				<ProfileImage src={src || '/image/profile/default-avatar.png'} alt='User profile' />
			</button>

			{isCardVisible && (
				<div className='absolute right-0 top-[53px] z-10'>
					<UserProfileCard
						name={name}
						memberNo={memberNo}
						avatarSrc={src}
						onLogout={onLogout}
						onNavigate={handleNavigation}
					/>
				</div>
			)}
		</div>
	);
};

export default Profile;
