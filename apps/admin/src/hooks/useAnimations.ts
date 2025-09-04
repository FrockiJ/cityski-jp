import { animated, useSpring } from 'react-spring';

type AnimationProps = {
	delay?: number;
	start?: number;
	height?: number;
} | null;

export const useAnimations = (props?: AnimationProps) => {
	let delay = props ? (props.delay ? props.delay : 100) : 100;
	let start = props ? (props.start ? props.start : 0) : 0;
	let height = props ? (props.height ? props.height : 0) : 0;

	const animate = animated;
	const fadeIn = useSpring({
		to: { opacity: 1 },
		from: { opacity: 0 },
		delay,
	});

	const slideIn = useSpring(() => ({
		from: { x: start, opacity: 1 },
	}));

	const fill = useSpring({
		to: { y: height },
		delay,
	});

	return { animate, fadeIn, slideIn, fill };
};
