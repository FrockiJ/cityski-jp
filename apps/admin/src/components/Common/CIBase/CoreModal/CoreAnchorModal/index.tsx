import React, { isValidElement, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { FormikProps } from 'formik';

import AlertIcon from '@/Icon/AlertIcon';

import {
	StyledAlert,
	StyledAnchorItem,
	StyledAnchorNavWrapper,
	StyledBlock,
	StyledBlockWrapper,
	StyledCheckedAnchorItem,
	StyledContentWrapper,
	StyledMain,
} from './styles';

interface CoreAnchorModalProps {
	children: ReactNode;
	rightContent?: ReactNode;
	anchorItems: AnchorItem[];
	formikHelpers?: FormikProps<any>;
}

export interface AnchorItem {
	id: string;
	label: string;
	requireFields: string[];
}
const CoreAnchorModal = ({ children, rightContent, anchorItems, formikHelpers }: CoreAnchorModalProps) => {
	const [currentAnchor, setCurrentAnchor] = useState(0);

	const [componentHeight, setComponentHeight] = useState<number | string>(0);

	const childRefs = useRef<any[]>([]);

	const [checkedAnchors, setCheckedAnchors] = useState<boolean[]>([]);

	const ErrorSection = () => {
		const sectionNames = anchorItems.filter((item, index) => !checkedAnchors[index]).map((item) => item.label);
		if (sectionNames.length > 0) {
			return (
				<StyledAlert icon={<AlertIcon color={'#FF5630'} />} severity='error'>
					Please fill in all required fields in {sectionNames.join(', ')}.
				</StyledAlert>
			);
		} else {
			return <></>;
		}
	};

	useEffect(() => {
		if (!formikHelpers) return;
		const tempAnchors: boolean[] = [];
		anchorItems.forEach((item) => {
			// item.requireFields.forEach(f => {
			//   console.log(formikHelpers.values[f] === undefined);
			//   console.log(formikHelpers.errors[f]);
			// });
			// Any field error, isChecked false.
			const isChecked = !item.requireFields.some(
				(field) =>
					formikHelpers?.values?.[field] === undefined ||
					formikHelpers?.values?.[field]?.length === 0 ||
					formikHelpers?.errors?.[field] !== undefined,
			);
			tempAnchors.push(isChecked);
		});
		setCheckedAnchors(tempAnchors);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formikHelpers?.values, formikHelpers?.errors]);

	// anchor smooth animation
	const handleClickAnchor = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, index: number) => {
		let anchor = childRefs.current[index];
		e.preventDefault(); // Stop Page Reloading
		anchor && anchor.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
	};

	const handleSetAnchor = (index: number) => {
		setCurrentAnchor(index);
	};

	useLayoutEffect(() => {
		const getHeight = () => {
			const lastChildHeight = childRefs.current[childRefs.current.length - 1].current.getBoundingClientRect().height;
			const totalHeight = childRefs.current.reduce(
				(acc, item) => acc + item.current?.getBoundingClientRect().height,
				0,
			);

			const viewHeight = window.innerHeight - 120;
			if (lastChildHeight > viewHeight) {
				setComponentHeight(viewHeight + totalHeight - (lastChildHeight % viewHeight));
			} else {
				const tempHeight = viewHeight + totalHeight - (viewHeight % lastChildHeight);
				setComponentHeight(tempHeight);
			}
		};

		const checkRenderComplete = setInterval(() => {
			const allRendered = childRefs.current.every((ref) => ref.current);
			if (allRendered) {
				clearInterval(checkRenderComplete);
				getHeight();
			}
		}, 100);

		return () => {
			clearInterval(checkRenderComplete);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [children, anchorItems, childRefs.current]);

	// scroll event, watch every blocks
	useEffect(() => {
		// Wait for modal to be fully rendered
		setTimeout(() => {
			const target = document.querySelector('.MuiDialogContent-root');
			if (!target) return;

			const handleScroll = () => {
				childRefs.current.forEach((ref, index) => {
					if (!ref.current) return;
					const rect = ref.current.getBoundingClientRect();
					if (rect.top >= 0 && rect.top <= 150) {
						setCurrentAnchor(index);
					}
				});
			};

			// Initial check
			handleScroll();

			// Add scroll listener
			target.addEventListener('scroll', handleScroll);

			return () => {
				target.removeEventListener('scroll', handleScroll);
			};
		}, 500); // Give enough time for modal to render
	}, []); // Run once on mount

	return (
		<StyledContentWrapper height={componentHeight}>
			{/* <StyledContentWrapper height={`${componentHeight + 630}px`}> */}
			<StyledBlockWrapper>
				<StyledAnchorNavWrapper width='220px'>
					<StyledBlock>
						{anchorItems.map((item, index) => (
							<StyledAnchorItem
								key={item.id}
								href={`#${item.id}`}
								active={index === currentAnchor}
								// isChecked={checkedAnchors[index]}
								onClick={(e) => handleClickAnchor(e, index)}
							>
								<StyledCheckedAnchorItem isChecked={checkedAnchors[index]} />
								{/* {item.isChecked && <AnimatedCheckedAnchorItem style={fadeIn} />} */}
								{item.label}
							</StyledAnchorItem>
						))}
					</StyledBlock>
				</StyledAnchorNavWrapper>
				<StyledMain id='wrap' infoRight={rightContent ? true : false}>
					<Stack>
						<Stack direction='column' width='800px'>
							{formikHelpers && formikHelpers.submitCount > 0 && !formikHelpers?.isValid && <ErrorSection />}
							{React.Children.map(children, (child, index) => {
								if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
									return null; // Return null or appropriate default value if child is a primitive value
								}

								if (!isValidElement(child)) {
									return null; // Return null or appropriate default value if child is not a valid element
								}

								// eslint-disable-next-line react-hooks/rules-of-hooks
								const ref = useRef(null);
								childRefs.current[index] = ref;
								return React.cloneElement(child as React.ReactElement<any>, { ref });
							})}
						</Stack>
						{rightContent && (
							<Box position='absolute' ml='824px'>
								{rightContent}
							</Box>
						)}
					</Stack>
				</StyledMain>
			</StyledBlockWrapper>
		</StyledContentWrapper>
	);
};

export default CoreAnchorModal;
