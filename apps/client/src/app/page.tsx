import BannerSection from '@/components/Project/Home/BannerSection';
import CoachSection from '@/components/Project/Home/CoachSection';
import CourseSection from '@/components/Project/Home/CourseSection';
import VideoSection from '@/components/Project/Home/VideoSection';
import EnableLineLoginModal from '@/components/Project/Line/EnableLineLoginModal';
import JoinLineOaModal from '@/components/Project/Line/JoinLineOaModal';

export default function Home() {
	return (
		<div>
			{/* show this modal when user is logged in and has not enabled line login */}
			<EnableLineLoginModal />
			{/* show this modal when user is logged in, has line enabled, but has not joined line oa */}
			<JoinLineOaModal />
			{/* below are the main content of the page */}
			<BannerSection />
			<CourseSection />
			<CoachSection />
			<VideoSection />
		</div>
	);
}
