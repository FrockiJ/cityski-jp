import { Box } from '@mui/material';

import CorePaper from '@/CIBase/CorePaper';
import CoreScrollbar from '@/CIBase/CoreScrollbar';
import PageControl from '@/components/PageControl';
import Intro from '@/Example/Intro';
import { StyledLink } from '@/Example/styles';

const scrollbar = () => {
	return (
		<>
			<PageControl title='Scrollbar' hasNav />
			<Intro title='Normal Scrollbar' content='Support custom style for scrollbar.' />
			<Box
				sx={{
					display: 'flex',
					gap: '24px',
				}}
			>
				<CorePaper card sx={{ padding: '24px', flex: '1 0 50%' }}>
					<Box typography='h4' pb={2}>
						Vertical
					</Box>
					<CoreScrollbar style={{ height: '300px' }}>
						<Box>
							Donec mi odio, faucibus at, scelerisque quis, convallis in, nisi. Quisque ut nisi. Suspendisse nisl elit,
							rhoncus eget, elementum ac, condimentum eget, diam. Vestibulum eu odio. Proin sapien ipsum, porta a,
							auctor quis, euismod ut, mi. Cras ultricies mi eu turpis hendrerit fringilla. Phasellus consectetuer
							vestibulum elit. Phasellus magna. Nullam tincidunt adipiscing enim. Vestibulum volutpat pretium libero.
							Nullam quis ante. Morbi mollis tellus ac sapien. Donec orci lectus, aliquam ut, faucibus non, euismod id,
							nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce
							ac felis sit amet ligula pharetra condimentum. Morbi mattis ullamcorper velit. Vivamus consectetuer
							hendrerit lacus. Nullam quis ante. Praesent turpis. Praesent porttitor, nulla vitae posuere iaculis, arcu
							nisl dignissim dolor, a pretium mi sem ut ipsum. Donec mi odio, faucibus at, scelerisque quis, convallis
							in, nisi. Quisque ut nisi. Suspendisse nisl elit, rhoncus eget, elementum ac, condimentum eget, diam.
							Vestibulum eu odio. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Cras ultricies mi eu turpis
							hendrerit fringilla. Phasellus consectetuer vestibulum elit. Phasellus magna. Nullam tincidunt adipiscing
							enim. Vestibulum volutpat pretium libero. Nullam quis ante. Morbi mollis tellus ac sapien. Donec orci
							lectus, aliquam ut, faucibus non, euismod id, nulla. Pellentesque habitant morbi tristique senectus et
							netus et malesuada fames ac turpis egestas. Fusce ac felis sit amet ligula pharetra condimentum. Morbi
							mattis ullamcorper velit. Vivamus consectetuer hendrerit lacus. Nullam quis ante. Praesent turpis.
							Praesent porttitor, nulla vitae posuere iaculis, arcu nisl dignissim dolor, a pretium mi sem ut ipsum.
						</Box>
					</CoreScrollbar>
				</CorePaper>
				<CorePaper card sx={{ padding: '24px', flex: '1 0 50%' }}>
					<Box typography='h4' pb={2}>
						Horizontal
					</Box>
					<CoreScrollbar>
						<Box sx={{ width: '250%' }}>
							Donec mi odio, faucibus at, scelerisque quis, convallis in, nisi. Quisque ut nisi. Suspendisse nisl elit,
							rhoncus eget, elementum ac, condimentum eget, diam. Vestibulum eu odio. Proin sapien ipsum, porta a,
							auctor quis, euismod ut, mi. Cras ultricies mi eu turpis hendrerit fringilla. Phasellus consectetuer
							vestibulum elit. Phasellus magna. Nullam tincidunt adipiscing enim. Vestibulum volutpat pretium libero.
							Nullam quis ante. Morbi mollis tellus ac sapien. Donec orci lectus, aliquam ut, faucibus non, euismod id,
							nulla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce
							ac felis sit amet ligula pharetra condimentum. Morbi mattis ullamcorper velit. Vivamus consectetuer
							hendrerit lacus. Nullam quis ante. Praesent turpis. Praesent porttitor, nulla vitae posuere iaculis, arcu
							nisl dignissim dolor, a pretium mi sem ut ipsum. Donec mi odio, faucibus at, scelerisque quis, convallis
							in, nisi. Quisque ut nisi. Suspendisse nisl elit, rhoncus eget, elementum ac, condimentum eget, diam.
							Vestibulum eu odio. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Cras ultricies mi eu turpis
							hendrerit fringilla. Phasellus consectetuer vestibulum elit. Phasellus magna. Nullam tincidunt adipiscing
							enim. Vestibulum volutpat pretium libero. Nullam quis ante. Morbi mollis tellus ac sapien. Donec orci
							lectus, aliquam ut, faucibus non, euismod id, nulla. Pellentesque habitant morbi tristique senectus et
							netus et malesuada fames ac turpis egestas. Fusce ac felis sit amet ligula pharetra condimentum. Morbi
							mattis ullamcorper velit. Vivamus consectetuer hendrerit lacus. Nullam quis ante. Praesent turpis.
							Praesent porttitor, nulla vitae posuere iaculis, arcu nisl dignissim dolor, a pretium mi sem ut ipsum.
						</Box>
					</CoreScrollbar>
				</CorePaper>
			</Box>
			<Intro
				title='Reference'
				noBackground
				content={
					<ul>
						<li>
							<StyledLink href='https://www.npmjs.com/package/simplebar-react' rel='noreferrer' target='_blank'>
								https://www.npmjs.com/package/simplebar-react
							</StyledLink>
						</li>
					</ul>
				}
			/>
		</>
	);
};

export default scrollbar;
