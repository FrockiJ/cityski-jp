import React from 'react';

interface ProfileImageProps {
	src: string;
	alt: string;
}

const ProfileImage = ({ src, alt }: ProfileImageProps) => {
	return (
		<div className='flex flex-col max-w-[42px]'>
			<div className='flex flex-col justify-center p-1 w-full rounded-full stroke-[2px] stroke-red-400'>
				<img loading='lazy' src={src} alt={alt} className='object-contain w-full aspect-square rounded-[99px]' />
			</div>
		</div>
	);
};

export default ProfileImage;
