'use client';

import Spinner from '../Project/Shared/Common/Spinner';

function LoadingSkeleton({ loadingText }: { loadingText?: string }) {
	return (
		<div className='fixed inset-0 flex items-center justify-center'>
			{loadingText || <Spinner size={40} stroke={5} speed={0.9} color='black' />}
		</div>
	);
}

export default LoadingSkeleton;
