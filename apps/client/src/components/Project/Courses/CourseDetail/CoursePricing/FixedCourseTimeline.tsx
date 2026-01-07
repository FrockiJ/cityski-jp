import React from 'react';
import { CoursePlanResponseDTO } from '@repo/shared';

import { TimelineItem } from './TimelineItem';

interface FixedCourseTimelineProps {
	coursePlans: CoursePlanResponseDTO[];
}

const FixedCourseTimeline: React.FC<FixedCourseTimelineProps> = ({ coursePlans }) => {
	if (!coursePlans || coursePlans.length === 0) {
		return (
			<div className='mt-4 text-center text-neutral-40 py-8'>
				<p>暫無方案</p>
			</div>
		);
	}

	return (
		<div className='mt-4 relative'>
			{/* Timeline vertical line - drawn independently */}
			<div className='absolute left-[6px] top-0 bottom-0 w-[2px] bg-[#d7d7d7]' />

			{/* Timeline items */}
			<div className='space-y-6'>
				{coursePlans.map((plan, index) => (
					<TimelineItem key={plan.id} plan={plan} isFirst={index === 0} isLast={index === coursePlans.length - 1} />
				))}
			</div>
		</div>
	);
};

export default FixedCourseTimeline;
