import { MenuStatus } from '@repo/shared';

export const menuItems = [
  {
    groupName: '',
    name: '儀表板', // Dashboard
    path: '/dashboard',
    sequence: 1,
    status: MenuStatus.ACTIVE,
    icon: 1,
  },
  {
    groupName: '功能列表',
    name: '預約管理', // Reservation Management
    path: '/reservation-management',
    sequence: 2,
    status: MenuStatus.ACTIVE,
    icon: 2,
    subPages: [
      {
        groupName: '',
        name: '室內課程', // Indoor Course
        path: '/reservation-management/indoor-course',
        sequence: 21,
        status: MenuStatus.ACTIVE,
      },
      {
        groupName: '',
        name: '海外教學', // Overseas Lesson
        path: '/reservation-management/overseas-lesson',
        sequence: 22,
        status: MenuStatus.ACTIVE,
      },
    ],
  },
  {
    groupName: '功能列表',
    name: '訂單管理', // Order Management
    path: '/order-management',
    sequence: 3,
    status: MenuStatus.ACTIVE,
    icon: 3,
    subPages: [
      {
        groupName: '',
        name: '室內課程', // Indoor Course
        path: '/order-management/indoor-course',
        sequence: 31,
        status: MenuStatus.ACTIVE,
      },
      {
        groupName: '',
        name: '海外教學', // Overseas Lesson
        path: '/order-management/overseas-lesson',
        sequence: 32,
        status: MenuStatus.ACTIVE,
      },
    ],
  },
  {
    groupName: '功能列表',
    name: '課程商品', // Course Products
    path: '/course-products',
    sequence: 4,
    status: MenuStatus.ACTIVE,
    icon: 4,
    subPages: [
      {
        groupName: '',
        name: '室內課程', // Indoor Course
        path: '/course-products/indoor-course',
        sequence: 41,
        status: MenuStatus.ACTIVE,
      },
      {
        groupName: '',
        name: '海外教學', // Overseas Lesson
        path: '/course-products/overseas-lesson',
        sequence: 42,
        status: MenuStatus.ACTIVE,
      },
    ],
  },
  {
    groupName: '功能列表',
    name: '前台會員管理', // Member Management
    path: '/member-management',
    sequence: 5,
    status: MenuStatus.ACTIVE,
    icon: 5,
  },
  {
    groupName: '管理者設定',
    name: '權限與人員', // Permissions and Personnel
    path: '/permissions-personnel',
    sequence: 6,
    status: MenuStatus.ACTIVE,
    icon: 6,
    subPages: [
      {
        groupName: '',
        name: '後台角色管理', // Permissions and Personnel - Role
        path: '/permissions-personnel/role',
        sequence: 61,
        status: MenuStatus.ACTIVE,
      },
      {
        groupName: '',
        name: '後台人員管理', // Permissions and Personnel - User
        path: '/permissions-personnel/user',
        sequence: 62,
        status: MenuStatus.ACTIVE,
      },
    ],
  },
  {
    groupName: '管理者設定',
    name: '折扣碼設定', // Promotion Settings
    path: '/promotion-settings',
    sequence: 7,
    status: MenuStatus.ACTIVE,
    icon: 7,
  },
  {
    groupName: '管理者設定',
    name: '內容管理', // Content Management
    path: '/content-management',
    sequence: 8,
    status: MenuStatus.ACTIVE,
    icon: 8,
    subPages: [
      {
        groupName: '',
        name: '首頁', // Permissions and Personnel - Role
        path: '/content-management/home',
        sequence: 81,
        status: MenuStatus.ACTIVE,
      },
      {
        groupName: '',
        name: '海外教學', // Permissions and Personnel - User
        path: '/content-management/overseas-lesson',
        sequence: 82,
        status: MenuStatus.ACTIVE,
      },
    ],
  },
  {
    groupName: '管理者設定',
    name: '報表', // Reports
    path: '/reports',
    sequence: 9,
    status: MenuStatus.ACTIVE,
    icon: 9,
  },
];
