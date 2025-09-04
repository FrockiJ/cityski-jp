import { DepartmentStatus, VenueStatus } from '@repo/shared';

export const departmentItems = [
  {
    id: '2e050cd6-a1a2-485b-8f27-a50091a19e60',
    sequence: 1,
    name: '台中店',
    phone: '0423121516',
    address: '台中市西屯區四川路87號B1-38 (115)',
    status: DepartmentStatus.ACTIVE,
    bankCode: '017',
    bankName: '國泰世華',
    bankBranchName: '光華分行',
    bankAccount: '222123456789',
    bankAccountName: '王小明',
    departmentVenues: [
      {
        id: '680e5818-2138-449f-aa42-73c239442ce4',
        name: '大場地',
        status: VenueStatus.ACTIVE,
        openStartTime: '0900',
        openEndTime: '2000',
        courseVenue: {
          group: true,
          private: true,
          individual: true,
        },
      },
      {
        id: 'e7ce6ad8-43a8-4c2d-b12d-4215ba8b6400',
        name: '小場地',
        status: VenueStatus.ACTIVE,
        openStartTime: '0900',
        openEndTime: '2000',
        courseVenue: {
          group: true,
          private: true,
          individual: true,
        },
      },
    ],
  },
  {
    id: '1585de44-57a9-4380-bfaa-add716e43194',
    sequence: 2,
    name: '台北店',
    phone: null,
    address: null,
    status: DepartmentStatus.ACTIVE,
    bankCode: '017',
    bankName: '國泰世華',
    bankBranchName: '光華分行',
    bankAccount: '222123456789',
    bankAccountName: '王小明',
    departmentVenues: [
      {
        id: '18d1199b-4d7a-41cb-bb39-f2fbb4c41888',
        name: '大場地',
        status: VenueStatus.ACTIVE,
        openStartTime: '0900',
        openEndTime: '2000',
        courseVenue: {
          group: true,
          private: true,
          individual: true,
        },
      },
      {
        id: '666e5be8-878e-4f72-ac0a-b63e5daaacea',
        name: '小場地',
        status: VenueStatus.ACTIVE,
        openStartTime: '0900',
        openEndTime: '2000',
        courseVenue: {
          group: true,
          private: true,
          individual: true,
        },
      },
    ],
  },
];
