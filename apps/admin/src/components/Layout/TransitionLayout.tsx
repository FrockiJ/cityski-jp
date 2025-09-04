import { alpha, Box, Skeleton } from '@mui/material';

import { useAnimations } from '@/hooks/useAnimations';

interface TransitionLayoutProps {}

/**
 * Transition Layout
 * @description for unauthenticated users, add a transition effect using Skeleton.
 */
const TransitionLayout = ({}: TransitionLayoutProps) => {
	const { animate, fadeIn } = useAnimations({ delay: 150 });
	const AnimatedBox = animate(Box);

	return (
		<AnimatedBox style={fadeIn} display='flex' width='100%'>
			<Box sx={{ flexShrink: 0, width: 280, padding: '22px 32px', borderRight: '1px solid #212b361c' }}>
				<Skeleton animation='wave' variant='rounded' width={200} height={30} sx={{ mb: 4 }} />

				<Skeleton animation='wave' variant='circular' width={24} height={24} sx={{ display: 'inline-block', mr: 2 }} />
				<Skeleton animation='wave' variant='rectangular' width={175} height={24} sx={{ display: 'inline-block' }} />

				<Skeleton animation='wave' variant='rectangular' width={44} height={18} sx={{ margin: '24px 16px 16px 8px' }} />

				<Skeleton
					animation='wave'
					variant='circular'
					width={24}
					height={24}
					sx={{ display: 'inline-block', mr: 2, mb: 2 }}
				/>
				<Skeleton
					animation='wave'
					variant='rectangular'
					width={175}
					height={24}
					sx={{ display: 'inline-block', mb: 2 }}
				/>

				<Skeleton
					animation='wave'
					variant='circular'
					width={24}
					height={24}
					sx={{ display: 'inline-block', mr: 2, mb: 2 }}
				/>
				<Skeleton
					animation='wave'
					variant='rectangular'
					width={175}
					height={24}
					sx={{ display: 'inline-block', mb: 2 }}
				/>

				<Skeleton
					animation='wave'
					variant='circular'
					width={24}
					height={24}
					sx={{ display: 'inline-block', mr: 2, mb: 2 }}
				/>
				<Skeleton
					animation='wave'
					variant='rectangular'
					width={175}
					height={24}
					sx={{ display: 'inline-block', mb: 2 }}
				/>

				<Skeleton
					animation='wave'
					variant='circular'
					width={24}
					height={24}
					sx={{ display: 'inline-block', mr: 2, mb: 2 }}
				/>
				<Skeleton
					animation='wave'
					variant='rectangular'
					width={175}
					height={24}
					sx={{ display: 'inline-block', mb: 2 }}
				/>

				<Skeleton animation='wave' variant='rectangular' width={44} height={18} sx={{ margin: '24px 16px 16px 8px' }} />

				<Skeleton
					animation='wave'
					variant='circular'
					width={24}
					height={24}
					sx={{ display: 'inline-block', mr: 2, mb: 2 }}
				/>
				<Skeleton
					animation='wave'
					variant='rectangular'
					width={175}
					height={24}
					sx={{ display: 'inline-block', mb: 2 }}
				/>

				<Skeleton
					animation='wave'
					variant='circular'
					width={24}
					height={24}
					sx={{ display: 'inline-block', mr: 2, mb: 2 }}
				/>
				<Skeleton
					animation='wave'
					variant='rectangular'
					width={175}
					height={24}
					sx={{ display: 'inline-block', mb: 2 }}
				/>

				<Skeleton
					animation='wave'
					variant='circular'
					width={24}
					height={24}
					sx={{ display: 'inline-block', mr: 2, mb: 2 }}
				/>
				<Skeleton
					animation='wave'
					variant='rectangular'
					width={175}
					height={24}
					sx={{ display: 'inline-block', mb: 2 }}
				/>

				<Skeleton
					animation='wave'
					variant='circular'
					width={24}
					height={24}
					sx={{ display: 'inline-block', mr: 2, mb: 2 }}
				/>
				<Skeleton
					animation='wave'
					variant='rectangular'
					width={175}
					height={24}
					sx={{ display: 'inline-block', mb: 2 }}
				/>
			</Box>
			<Box display='flex' sx={{ flexGrow: '1', flexDirection: 'column', width: `calc(100vw - 280px)` }}>
				<Box
					display='flex'
					height={76}
					sx={(theme) => ({
						flexDirection: 'column',
						padding: '26px 40px',
						borderBottom: `1px solid ${alpha(theme.palette.text.quaternary, 0.24)}`,
					})}
				>
					<Skeleton animation='wave' variant='rounded' width={100} height={24} />
				</Box>
				<Box sx={{ padding: '30px' }}>
					<Skeleton animation='wave' variant='rounded' width={200} height={50} sx={{ mb: 5 }} />
					<Skeleton animation='wave' variant='rounded' width='100%' height={600} />
				</Box>
			</Box>
		</AnimatedBox>
	);
};

export default TransitionLayout;
