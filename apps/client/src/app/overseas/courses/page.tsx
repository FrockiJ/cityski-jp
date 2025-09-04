'use client';
import React from 'react';

import { CourseFilters } from '@/components/Project/Overseas/Courses/CourseFilters';
import { CourseGrid } from '@/components/Project/Overseas/Courses/CourseGrid';
import { HeroBanner } from '@/components/Project/Overseas/Courses/HeroBanner';

export default function OverseasCoursesPage() {
	return (
		<div className='flex flex-col min-h-screen'>
			<main>
				<HeroBanner />
				<section className='box-border flex gap-8 px-5 py-0 mx-auto my-0 max-w-[1200px] max-md:flex-col max-md:px-10 max-md:py-0 max-sm:px-5 max-sm:py-0'>
					<CourseFilters />
					<CourseGrid />
				</section>
			</main>
		</div>
	);
}
