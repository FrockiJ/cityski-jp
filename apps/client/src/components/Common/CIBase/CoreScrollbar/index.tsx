'use client';
import React from 'react';
import SimpleBarReact, { Props } from 'simplebar-react';

const CoreScrollbar: React.FC<Props> = (prop) => {
	return <SimpleBarReact {...prop} />;
};

export default CoreScrollbar;
