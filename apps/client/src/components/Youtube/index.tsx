import React from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';

import './styles.css';

type Props = {
	videoId: string;
	autoPlay?: boolean;
	loop?: boolean;
	size: 'sm' | 'lg';
};

const YoutubeVideo = ({ videoId, autoPlay, loop, size = 'sm' }: Props) => {
	// console.log('videoId', videoId);
	// const [player, setPlayer] = useState(null);
	const onReady = (event: YouTubeEvent<any>) => {
		autoPlay;
		// autoPlay && event.target.mute();
		// autoPlay && event.target.playVideo();
		// setPlayer(event.target);
		// event.target.playVideo();
		// event.target.seekTo(5, true);
		// event.target.pauseVideo();
	};

	const onPlayerStateChange = (event: YouTubeEvent<any>) => {
		// console.log('event.target', event.target.playerInfo.playerState);
		if (loop && event.target.playerInfo.playerState === 0) {
			// 0 is video end state
			event.target.playVideo(); // when end play again
		}
	};

	const opts = {
		height: '100%',
		width: '100%',
		playerVars: {
			// https://developers.google.com/youtube/player_parameters
			disablekb: 1,
			autoplay: autoPlay ? 1 : 0,
			controls: 1, // hide control
			fs: 1, // disabled fullscreen
		},
	};

	return (
		<div className={`yt-wrapper-${size}`}>
			<YouTube
				videoId={videoId}
				className='youtube-video [&>iframe]:rounded-2xl'
				opts={opts}
				onReady={onReady}
				onStateChange={onPlayerStateChange}
			/>
		</div>
	);
};

export default YoutubeVideo;
