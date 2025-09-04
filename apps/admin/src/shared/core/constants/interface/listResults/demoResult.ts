// import { UserDto } from '../../dto';

import { DemoDto } from '@/shared/core/dto';

import { ListResultI } from './baseResult';

export interface DemoListResultI extends ListResultI {
	id: string;

	name: string;

	email: string;

	role: string[];

	status: string;

	createdDate: string;
}

export interface DemoDetailResultI {
	demoProfile?: DemoDto;
}

export interface DemoProfileResultI {
	email: string;
	permission: string;
	status: string;
	hostPermission: string;
	avatar: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	country: string;
	city: string;
	zipCode: string;
	address: string;
	noOfPoolsOwned: string;
	poolName: string;
	disableReason: string;
	inactiveReason: string;
}
