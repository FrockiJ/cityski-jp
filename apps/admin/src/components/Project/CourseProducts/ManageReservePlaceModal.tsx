import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import {
	DialogAction,
	GetCourseManagementVenuesResponseDTO,
	UpdateCourseManagementVenuesRequestDTO,
} from '@repo/shared';

import CoreModalContent from '@/CIBase/CoreModal/ModalContent';
import CoreButton from '@/components/Common/CIBase/CoreButton';
import CoreSwitch from '@/components/Common/CIBase/CoreSwitch';
import api from '@/utils/http/api';
import { generalErrorHandler } from '@/utils/http/handler';
import { useLazyRequest, useRequest } from '@/utils/http/hooks';
import { showToast } from '@/utils/ui/general';

import * as Components from '../shared/Components';

const tableHeader = [
	{ label: '場地', width: '100px' },
	{ label: '私人課', width: '120px' },
	{ label: '團體課', width: '120px' },
	{ label: '個人練習', width: '120px' },
];

interface ManageReservePlaceModalProps {
	handleCloseModal?: (action: DialogAction) => void;
}

const ManageReservePlaceModal = ({ handleCloseModal }: ManageReservePlaceModalProps) => {
	const [venueList, setVenueList] = useState<GetCourseManagementVenuesResponseDTO[]>([]);
	const [updatedVenues, setUpdatedVenues] = useState<
		Record<string, { private: boolean; group: boolean; individual: boolean }>
	>({});

	// --- API ---

	const { data: getCourseManagementVenuesData, loading: getCourseManagementVenuesDataLoading } = useRequest(
		() => api.getCourseManagementVenues({ departmentId: localStorage.getItem('departmentId') ?? '' }),
		{
			onError: generalErrorHandler,
		},
	);

	const [updateCourseManagementVenues, { loading: isUpdating }] = useLazyRequest(api.updateCourseManagementVenues, {
		onError: generalErrorHandler,
		onSuccess: () => {
			showToast('已更新場地', 'success');
			handleCloseModal?.(DialogAction.CONFIRM);
		},
	});

	useEffect(() => {
		if (getCourseManagementVenuesData && getCourseManagementVenuesData.result) {
			const venues = Array.isArray(getCourseManagementVenuesData.result)
				? getCourseManagementVenuesData.result
				: [getCourseManagementVenuesData.result];
			setVenueList(venues);

			// Initialize updatedVenues with current values
			const initialUpdatedVenues: Record<string, { private: boolean; group: boolean; individual: boolean }> = {};
			venues.forEach((venue) => {
				initialUpdatedVenues[venue.id] = {
					private: venue.private,
					group: venue.group,
					individual: venue.individual,
				};
			});
			setUpdatedVenues(initialUpdatedVenues);

			console.log('Venue list set:', venues);
		}
	}, [getCourseManagementVenuesData]);

	const handleSwitchChange = (venueId: string, field: 'private' | 'group' | 'individual', value: boolean) => {
		setUpdatedVenues((prev) => ({
			...prev,
			[venueId]: {
				...prev[venueId],
				[field]: value,
			},
		}));
	};

	const handleSubmit = () => {
		// Prepare payload for update API
		const payload: UpdateCourseManagementVenuesRequestDTO[] = Object.entries(updatedVenues).map(([id, values]) => ({
			id,
			group: values.group,
			private: values.private,
			individual: values.individual,
		}));

		console.log('Updating venues with payload:', payload);
		updateCourseManagementVenues(payload);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<CoreModalContent padding='24px 0'>
				<Components.Row header tableHeader={tableHeader}>
					{tableHeader.map(({ label, width }) => (
						<Components.StyledCell header key={label} width={width}>
							{label}
						</Components.StyledCell>
					))}
				</Components.Row>

				{getCourseManagementVenuesDataLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
						<CircularProgress size={30} />
					</Box>
				) : (
					venueList.map((venue) => (
						<Box key={venue.id}>
							<Components.Row>
								<Components.StyledCell width='100px'>{venue.name}</Components.StyledCell>
								<Components.StyledCell width='120px'>
									<CoreSwitch
										label='開放'
										checked={updatedVenues[venue.id]?.private ?? venue.private}
										onChange={(e) => handleSwitchChange(venue.id, 'private', e.target.checked)}
									/>
								</Components.StyledCell>
								<Components.StyledCell width='120px'>
									<CoreSwitch
										label='開放'
										checked={updatedVenues[venue.id]?.group ?? venue.group}
										onChange={(e) => handleSwitchChange(venue.id, 'group', e.target.checked)}
									/>
								</Components.StyledCell>
								<Components.StyledCell width='120px'>
									<CoreSwitch
										label='開放'
										checked={updatedVenues[venue.id]?.individual ?? venue.individual}
										onChange={(e) => handleSwitchChange(venue.id, 'individual', e.target.checked)}
									/>
								</Components.StyledCell>
							</Components.Row>
						</Box>
					))
				)}
			</CoreModalContent>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0 24px 24px', gap: '12px' }}>
				<CoreButton
					color='default'
					variant='outlined'
					label='取消'
					onClick={() => handleCloseModal?.(DialogAction.CANCEL)}
				/>
				<CoreButton color='primary' variant='contained' label='確認' onClick={handleSubmit} disabled={isUpdating} />
			</Box>
		</Box>
	);
};

export default ManageReservePlaceModal;
