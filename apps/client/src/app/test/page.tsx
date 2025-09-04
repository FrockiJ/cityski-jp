'use client';

import React from 'react';
import axios from 'axios';
import { isAxiosError } from 'axios';

import Button from '@/components/Project/Shared/Common/Button';

type Props = {};

const Test = (props: Props) => {
	return (
		<>
			<div className='mt-64 ml-16 text-black'>{/* <DatePicker /> */}</div>
			<Button
				onClick={async () => {
					// axios post request
					try {
						await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/smtp/send-example', {
							email: 'michaelnccu@gmail.com',
							// email: 'kranti.nebhwani@cloud-interactive.com',
						});
					} catch (err) {
						console.log('Error when attempting to call line sign-in api.');
						if (isAxiosError(err)) {
							console.log('Error:\n', err.response.data);
						}
						// handle error flow. Redirect? Popup?
						return;
					}
				}}
			>
				Send Email
			</Button>
		</>
	);
};

export default Test;
