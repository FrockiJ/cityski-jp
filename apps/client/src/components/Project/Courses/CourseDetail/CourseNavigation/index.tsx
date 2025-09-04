import * as React from 'react';

type NavigationItem = {
	label: string;
	isActive: boolean;
	sectionId: string;
};

type CourseNavigationProps = {
	onNavigationChange?: (index: number) => void;
};

function CourseNavigation({ onNavigationChange }: CourseNavigationProps) {
	const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

	const navigationItems: NavigationItem[] = [
		{ label: '方案詳情', isActive: activeIndex === 0, sectionId: 'course-summary' },
		{ label: '課程資訊', isActive: activeIndex === 1, sectionId: 'course-info' },
		{ label: '注意事項', isActive: activeIndex === 2, sectionId: 'course-notes' },
		{ label: '請假辦法', isActive: activeIndex === 3, sectionId: 'leave-policy' },
		{ label: '取消辦法', isActive: activeIndex === 4, sectionId: 'cancellation-policy' },
	];

	const handleScroll = React.useCallback(() => {
		const simpleBarElement = document.querySelector('.simplebar-content-wrapper');
		if (!simpleBarElement) return;

		const scrollPosition = simpleBarElement.scrollTop;
		const headerOffset = 100;

		const lastSection = document.getElementById('cancellation-policy');
		if (lastSection) {
			const lastSectionBottom = lastSection.offsetTop + lastSection.offsetHeight - headerOffset;
			if (scrollPosition > lastSectionBottom) {
				setActiveIndex(null);
				return;
			}
		}

		let foundActive = false;
		for (let i = navigationItems.length - 1; i >= 0; i--) {
			const section = document.getElementById(navigationItems[i].sectionId);
			if (section) {
				const sectionTop = section.offsetTop - headerOffset;
				const sectionBottom = sectionTop + section.offsetHeight;

				if (i === 4) {
					if (scrollPosition >= sectionTop - 20) {
						setActiveIndex(i);
						foundActive = true;
						break;
					}
				} else if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
					setActiveIndex(i);
					foundActive = true;
					break;
				}
			}
		}

		if (!foundActive) {
			setActiveIndex(null);
		}
	}, [navigationItems]);

	React.useEffect(() => {
		const simpleBarElement = document.querySelector('.simplebar-content-wrapper');
		if (simpleBarElement) {
			handleScroll(); // Initial check
			simpleBarElement.addEventListener('scroll', handleScroll, { passive: true });
			return () => simpleBarElement.removeEventListener('scroll', handleScroll);
		}
	}, [handleScroll]);

	const handleItemClick = (index: number, sectionId: string) => {
		onNavigationChange?.(index);

		const element = document.getElementById(sectionId);
		if (element) {
			const simpleBarElement = document.querySelector('.simplebar-content-wrapper');
			if (simpleBarElement) {
				const headerOffset = 100;
				const elementPosition = element.getBoundingClientRect().top;
				const offsetPosition = elementPosition + simpleBarElement.scrollTop - headerOffset;

				simpleBarElement.removeEventListener('scroll', handleScroll);

				simpleBarElement.scrollTo({
					top: offsetPosition,
					behavior: 'smooth',
				});

				setTimeout(() => {
					setActiveIndex(index);
					simpleBarElement.addEventListener('scroll', handleScroll, { passive: true });
				}, 300);
			}
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'ArrowLeft') {
			const newIndex = activeIndex > 0 ? activeIndex - 1 : activeIndex;
			setActiveIndex(newIndex);
			onNavigationChange?.(newIndex);
		} else if (event.key === 'ArrowRight') {
			const newIndex = activeIndex < navigationItems.length - 1 ? activeIndex + 1 : activeIndex;
			setActiveIndex(newIndex);
			onNavigationChange?.(newIndex);
		}
	};

	return (
		<nav
			className='flex items-center text-sm leading-6 whitespace-nowrap bg-white text-zinc-800 max-xs:px-5 max-w-[1280px] overflow-x-auto scrollbar-none'
			role='tablist'
			aria-label='課程導航'
			onKeyDown={handleKeyDown}
		>
			<div className='flex items-center self-stretch my-auto min-w-[240px] max-xs:min-w-0 max-xs:gap-x-5'>
				{navigationItems.map((item, index) => (
					<button
						key={item.label}
						className={`self-stretch px-4 pt-1.5 pb-3 my-auto relative focus:outline-none transition-colors duration-300 whitespace-nowrap ${
							item.isActive ? 'font-medium text-red-400' : ''
						} max-xs:px-0`}
						onClick={() => handleItemClick(index, item.sectionId)}
						aria-current={item.isActive ? 'page' : undefined}
						role='tab'
						aria-selected={item.isActive}
						tabIndex={item.isActive ? 0 : -1}
						aria-controls={`panel-${index}`}
						id={`tab-${index}`}
					>
						<span className='relative z-10'>{item.label}</span>
						{item.isActive && (
							<div
								className='flex absolute bottom-0 inset-x-4 z-0 w-14 bg-red-400 fill-red-400 h-[3px] min-h-[3px] transition-all duration-300 max-xs:inset-x-0'
								aria-hidden='true'
							/>
						)}
					</button>
				))}
			</div>
		</nav>
	);
}

export default CourseNavigation;
