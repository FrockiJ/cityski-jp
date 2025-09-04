import React from 'react';

import { FaqSection } from '@/components/Project/Overseas/FaqSection';
import { FeatureSection } from '@/components/Project/Overseas/FeatureSection';
import { LandingSection } from '@/components/Project/Overseas/LandingSection';
import { SkiResortSection } from '@/components/Project/Overseas/SkiResortSection';

const OverseasCoursesPage = () => {
	return (
		<div>
			<LandingSection />
			<FeatureSection />
			<SkiResortSection />
			<FaqSection />
		</div>
	);
};

export default OverseasCoursesPage;
