import { styled } from '@mui/material';

const ExampleList = styled('div')({
	width: '100%',
	marginTop: 20,
	marginBottom: 20,
	marginLeft: 20,
	display: 'flex',
	flexWrap: 'wrap',
	gap: 20,
});

const ExampleList2 = styled('ul')({
	'& > li': {
		padding: '5px 0',
		width: 'fit-content',
		color: 'black',
	},
});

const KeyPoint = styled('a')(({ theme }) => ({
	color: theme.palette.error.main,
	textDecoration: 'underline',
}));

const StyledLink = styled('a')(({ theme }) => ({
	color: theme.palette.primary.main,
	fontWeight: 500,
	cursor: 'pointer',
	'&:hover': {
		textDecoration: 'underline',
	},
}));

export { ExampleList, ExampleList2, KeyPoint, StyledLink };
