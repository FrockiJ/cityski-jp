// ref: https://stackoverflow.com/questions/18681788/how-to-get-a-youtube-thumbnail-from-a-youtube-iframe
// ref: https://gist.github.com/visualkom/daec5a214814c3329446
// ref: https://stackoverflow.com/questions/3717115/regular-expression-for-youtube-links
// ref: https://stackoverflow.com/questions/71000139/javascript-regex-for-youtube-video-and-shorts-id
import { useEffect, useState } from 'react';

enum ThumbnailQuality {
	DEFAULT = 'default', // 120x90
	MQ_DEFAULT = 'mqdefault', // 380x180
	HQ_DEFAULT = 'hqdefault', // 480x360
	SD_DEFAULT = 'sddefault', // 640x480
	MAX_DEFAULT = 'maxresdefault', // 1280x720
}

// detect the image url is youtube link
export const youtubeRegex =
	/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed|shorts)(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v|\/)))([-a-zA-Z0-9_]{11,})/;

function useGetYoutubeImage({
	url,
	quality = ThumbnailQuality.DEFAULT,
}: {
	url?: string | number | null;
	quality?: ThumbnailQuality;
}) {
	const [videoThumbnail, setVideoThumbnail] = useState<string>('');
	const [videoHtml, setVideoHtml] = useState<string>('');
	const [videoTitle, setVideoTitle] = useState<string>('');
	const [videoLoading, setVideoLoading] = useState<boolean>(false);
	const [videoValid, setVideoValid] = useState<boolean>(false);

	useEffect(() => {
		if (typeof url === 'string' && youtubeRegex.test(url)) {
			const videoId = youtubeRegex.exec(url)?.[1];

			setVideoLoading(true);
			setVideoValid(true);
			setVideoThumbnail(`https://img.youtube.com/vi/${videoId}/${quality}.jpg`);
			fetch(`https://www.youtube.com/oembed?url=${url}&format=json`)
				.then((res) => res.json())
				.then((data) => {
					setVideoTitle(data.title);
					setVideoHtml(data.html);
				})
				.catch(() => {
					setVideoThumbnail('');
					setVideoHtml('');
					setVideoTitle('');
					setVideoValid(false);
				})
				.finally(() => setVideoLoading(false));
		} else {
			setVideoThumbnail('');
			setVideoHtml('');
			setVideoTitle('');
			setVideoValid(false);
		}
	}, [quality, url]);

	return { videoThumbnail, videoHtml, videoTitle, videoLoading, videoValid };
}

export default useGetYoutubeImage;
