'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
	footer?: React.ReactNode;
	closeOnOutsideClick?: boolean;
}

const Modal = ({ isOpen, onClose, children, title, footer, closeOnOutsideClick = true }: ModalProps) => {
	if (!isOpen) return null;

	return createPortal(
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			<div className='fixed inset-0 bg-black bg-opacity-50' onClick={closeOnOutsideClick ? onClose : undefined} />
			<div
				className='relative z-50 flex flex-col bg-white overflow-hidden mx-5'
				style={{
					borderRadius: '20px',
					boxShadow: '0px 10px 26px 0px rgba(0, 0, 0, 0.13)',
				}}
			>
				{title && (
					<header className='flex justify-between items-center pt-2 pr-2 pb-5 pl-8 w-full text-xl font-medium leading-snug bg-white text-zinc-800'>
						<h1 className='mt-3'>{title}</h1>
						<button onClick={onClose} className='cursor-pointer'>
							<X
								size={24}
								color='#565656'
								className='object-contain shrink-0 w-10 aspect-square hover:opacity-100 transition-opacity opacity-70'
							/>
						</button>
					</header>
				)}
				{children}
				{footer && (
					<footer className='flex gap-2 justify-end items-center px-8 py-5 w-full text-sm leading-6 text-center bg-white border-t border-solid border-t-zinc-300'>
						{footer}
					</footer>
				)}
			</div>
		</div>,
		document.body,
	);
};

export default Modal;
