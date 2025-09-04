export type EnumValues<T> = T[keyof T];

/** Auth Enums ******/

export const JwtUserType = {
  MEMBER: "member",
  USER: "user",
} as const;
export type JwtUserTypeEnum = EnumValues<typeof JwtUserType>;

/****** End Auth Enums **/

/** User Enums ******/

export const UserStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
  DELETE: 9,
} as const;
export type UserStatus = EnumValues<typeof UserStatus>;

export const UserIsDefPassword = {
  YES: "Y",
  NO: "N",
} as const;
export type UserIsDefPassword = EnumValues<typeof UserIsDefPassword>;

/****** End User Enums **/

/** Role Enums ******/

/**
 * NOTE: DO NOT USE except when initializing the application with Super Admin role.
 * Creation of Super admin accounts is restricted in this application.
 **/
export const Roles = {
  SUPER_ADMIN: "系統管理員",
} as const;
export type Roles = (typeof Roles)[keyof typeof Roles];

export const RoleStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
} as const;
export type RoleStatus = EnumValues<typeof RoleStatus>;

export const IsSuperAdmin = {
  NO: 0,
  YES: 1,
} as const;
export type IsSuperAdmin = EnumValues<typeof IsSuperAdmin>;

/****** End Role Enums **/

/** Start Menu Enums ******/

export const MenuStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
};
export type MenuStatus = EnumValues<typeof MenuStatus>;

/****** End Menu Enums **/

/** Start Department Enums ******/

export const DepartmentStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
};
export type DepartmentStatus = EnumValues<typeof DepartmentStatus>;

/****** End Department Enums **/

/** Start Attachment Enums ******/

export const AttachmentDeviceType = {
  DESKTOP: "D",
  MOBILE: "M",
};
export type AttachmentDeviceType = EnumValues<typeof AttachmentDeviceType>;

/****** End Attachment Enums **/

/** Start Content Management Enums ******/

/**
 * HomeArea Type
 */
export const HomeAreaType = {
  BANNER: 1,
  VIDEO: 2,
};
export type HomeAreaType = EnumValues<typeof HomeAreaType>;

/****** End Content Management Enums **/

/** Start Member Enums ******/

export const MemberStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
  NOT_YET_VERIFIED: 2,
} as const;
export type MemberStatus = EnumValues<typeof MemberStatus>;

export const MemberLinkedLineOA = {
  TRUE: "true",
  FALSE: "false",
} as const;
export type MemberLinkedLineOAEnum = EnumValues<typeof MemberLinkedLineOA>;

export const LineWebhookType = {
  FOLLOW: "follow",
  UNFOLLOW: "unfollow",
  MESSAGE: "message",
} as const;
export type LineWebhookTypeEnum = EnumValues<typeof LineWebhookType>;

export const MemberType = {
  L: "L", // line
  E: "E", // email
} as const;
export type MemberTypeEnum = EnumValues<typeof MemberType>;

export const SkiAndSnowboardLevel = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "10": "10",
  "11": "11",
  "12": "12",
  "13": "13",
  "14": "14",
  "15": "15",
  "16": "16",
  "17": "17",
  "18": "18",
  "19": "19",
  "20": "20",
} as const;
export type SkiAndSnowboardLevelEnum = EnumValues<typeof SkiAndSnowboardLevel>;

/******* End Member Enums **/

/** Start Discount Enums ******/

/** discount type */
export const DiscountType = {
  AMOUNT: "A",
  PERCENT: "P",
};
export type DiscountType = EnumValues<typeof DiscountType>;

/** discount status for ui */
export const DiscountStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
  EXPIRED: 9,
};
export type DiscountStatus = EnumValues<typeof DiscountStatus>;

/** discount status for db */
export const DiscountStatusDB = {
  INACTIVE: 0,
  ACTIVE: 1,
};
export type DiscountStatusDB = EnumValues<typeof DiscountStatusDB>;

/****** End Discount Enums **/

/** Start Course Enums ******/

/**
 * Course's type, GROUP: "G" 團體課, PRIVATE: "P" 私人課, INDIVIDUAL: "I" 個人練習
 */
export const CourseType = {
  GROUP: "G",
  PRIVATE: "P",
  INDIVIDUAL: "I",
};
export type CourseType = EnumValues<typeof CourseType>;

/**
 * Course's teaching type NONE: 0 無教練授課, COACH: 1 教練授課
 */
export const CourseTeachingType = {
  NONE: 0,
  COACH: 1,
};
export type CourseTeachingType = EnumValues<typeof CourseTeachingType>;

/**
 * 課程狀態, DRAFT: 0 草稿, SCHEDULED: 1 排程, PUBLISHED: 2 已上架, UNPUBLISHED: 3 已下架
 */
export const CourseStatusType = {
  DRAFT: 0,
  SCHEDULED: 1,
  PUBLISHED: 2,
  UNPUBLISHED: 3,
};
export type CourseStatusType = EnumValues<typeof CourseStatusType>;

/**
 * 滑板類型 type, BOTH: 0 單板和雙板, SNOWBOARD: 1 單板, SKI: 2 雙板
 */
export const CourseSkiType = {
  BOTH: 0,
  SNOWBOARD: 1,
  SKI: 2,
};
export type CourseSkiType = EnumValues<typeof CourseSkiType>;

/**
 * 預約類型, FLEXIBLE: 1 預約, FIXED: 2 指定
 */
export const CourseBkgType = {
  FLEXIBLE: 1,
  FIXED: 2,
};
export type CourseBkgType = EnumValues<typeof CourseBkgType>;

/**
 * 預約後可預約到多久之後的課程, UNLIMITED: 0 無限制, CUSTOM: 1 自訂
 */
export const BkgAfterCourseType = {
  UNLIMITED: 0,
  CUSTOM: 1,
};
export type BkgAfterCourseType = EnumValues<typeof BkgAfterCourseType>;

/**
 * 預約後可預約到多久之後的課程, HOUR: 'H' 小時, DAY: 'D' 天
 */
export const BkgAfterCourseTypeUnit = {
  HOUR: "H",
  DAY: "D",
};
export type BkgAfterCourseTypeUnit = EnumValues<typeof BkgAfterCourseTypeUnit>;

/**
 * Course suggest
 */
export const CourseSuggestType = {
  NONE: 0,
  SUGGEST: 1,
  OTHERS: 9,
};
export type CourseSuggestType = EnumValues<typeof CourseSuggestType>;

/**
 * Course info type
 */
export const CourseInfoType = {
  TARGET: "T",
  CONTENT: "C",
  PRICE: "P",
};

export type CourseInfoType = EnumValues<typeof CourseInfoType>;

/**
 * 人數限制類別, SAME: "S", 平日遇週末相同, DIFFERENT: "D", 平日與週末不同
 */
export const CoursePaxLimitType = {
  SAME: "S",
  DIFFERENT: "D",
};

export type CoursePaxLimitType = EnumValues<typeof CoursePaxLimitType>;

/**
 * 課程上架類別, DESIGNATE: "D" 指定時間, IMMEDIATE: "I" 立即上架,
 */
export const CourseReleaseType = {
  DESIGNATE: "D",
  IMMEDIATE: "I",
};

export type CourseReleaseType = EnumValues<typeof CourseReleaseType>;

/**
 * 課程下架類別, DESIGNATE: "D" 指定時間, ULIMIT: "U" 無期限
 */
export const CourseRemovalType = {
  DESIGNATE: "D",
  ULIMIT: "U",
};

export type CourseRemovalType = EnumValues<typeof CourseRemovalType>;

/**
 * 時間單位, HOUR: "H" 小時, MONTH: "M" 月
 */
export const CourseDayUnit = {
  HOUR: "H",
  MONTH: "M",
};

export type CourseDayUnit = EnumValues<typeof CourseDayUnit>;

/**
 * 時間, EVERYDAY: 0 每天, WEEK: 1 平日, WEEKEND: 2 週末
 */
export const CoursePeopleType = {
  EVERYDAY: 0,
  WEEKDAYS: 1,
  WEEKEND: 2,
};

export type CoursePeopleType = EnumValues<typeof CoursePeopleType>;

/**
 * Course Plan Type -
 * 0: 無
 * 1: 單堂體驗
 * 2: 固定堂數(每人)
 * 3: 共用堂數
 * 4: 一般私人課
 */

export const CoursePlanType = {
  NONE: 0,
  SINGLE_SESSION: 1,
  FIXED_SESSION: 2,
  SHARED_GROUP: 3,
  PRIVATE_SESSION: 4,
} as const;

export type CoursePlanTypeEnum = EnumValues<typeof CoursePlanType>;

/**
 * Course cancel policy Type -
 * 1: 期限內取消需要付場地費
 * 2: 期限前可免費改期，期限後只能取消
 */

export const CourseCancelPolicyType = {
  CANCEL_WITHIN_DEADLINE_PAY: 1,
  BEFORE_FREE_OR_AFTER_DEADLINE_CANCEL: 2,
} as const;

export type CourseCancelPolicyTypeEnum = EnumValues<
  typeof CourseCancelPolicyType
>;

/****** End Course Enums **/

/****** Start Order Enums **/

/**
 * Order status type -
 * PENDING_DEPOSIT: 0 待付訂金,
 * WAITING_FOR_CONFIRMATION: 1 等待確認,
 * ORDER_SUCCESSFUL: 2 訂購成功,
 * ORDER_COMPLETED: 3 訂單完成,
 * ORDER_CANCELED: 9 訂單取消,
 */
export const OrderStatus = {
  PENDING_DEPOSIT: 0,
  WAITING_FOR_CONFIRMATION: 1,
  ORDER_SUCCESSFUL: 2,
  ORDER_COMPLETED: 3,
  ORDER_CANCELED: 9,
};
export type OrderStatusEnum = EnumValues<typeof OrderStatus>;

/**
 * order channel -
 * LINE: "L",
 * WEB: "W",
 */
export const OrderChannel = {
  LINE: "L",
  WEB: "W",
};
export type OrderChannelEnum = EnumValues<typeof OrderChannel>;

/****** End Order Enums **/

/****** Start Transaction Enums **/

/**
 * Transaction status -
 * PENDING_DEPOSIT: 0 "待付訂金",
 * DEPOSIT_PAID: 1 "已付訂金",
 * PENDING_FULL_PAYMENT: 2 "待結清",
 * FULLY_PAID: 3 "已結清"
 */
export const TransactionStatus = {
  PENDING_DEPOSIT: 0,
  DEPOSIT_PAID: 1,
  PENDING_FULL_PAYMENT: 2,
  FULLY_PAID: 3,
};
export type TransactionStatusEnum = EnumValues<typeof TransactionStatus>;

/****** End Transaction Enums **/

/****** Start Venue Enums **/

/** discount status for db */
export const VenueStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
};
export type VenueStatus = EnumValues<typeof VenueStatus>;

/****** End Venue Enums **/

/** Start CI Module Enums ******/

export enum FilterType {
  SELECT,
  SELECT_MULTI,
  RADIO,
  CHECKBOX,
  DATETIME,
  DATETIME_END,
  TEXT,
}

export const BtnActionType = {
  DELETE: "delete",
  ADD: "add",
  BASIC: "basic",
  WARNING: "warning",
  MANAGE: "manage",
  OUTLINE: "outline",
  TABLE_FILTER: "tableFilter",
  FILTER_CLEAR: "filterClear",
  LINK: "link",
} as const;
export type BtnActionTypeEnum = EnumValues<typeof BtnActionType>;

export const OptionNames = {
  DATETIME: "Date Time",
  USER_STATUS: "User Status",
  TEST: "test",
  USER_ROLE: "User Role",
  DISCOUNT_STATUS: "Discount Status",
  MEMBER_NO: "Member No",
  MEMBER_SNOWBOARD: "Member Snowboard",
  MEMBER_SKIS: "Member Skis",
  MEMBER_EMAIL: "Member Email",
  MEMBER_TYPE: "Member Type",
  MEMBER_STATUS: "Member Status",
  COURSE_STATUS: "Course Status",
  COURSE_TYPE: "Course Type",
  COURSE_BOOKING_TYPE: "Course Booking Type",
} as const;
export type OptionNames = EnumValues<typeof OptionNames>;

/**
 * @deprecated use OrderByType instead
 */
export const OrderType = {
  ASC: "asc",
  DESC: "desc",
} as const;
/**
 * @deprecated use OrderByType instead
 */
export type OrderType = EnumValues<typeof OrderType>;

export const OrderByType = {
  asc: "ASC",
  desc: "DESC",
} as const;
export type OrderByType = EnumValues<typeof OrderByType>;

export enum MediaType {
  LOGO,
  COVER,
  BACKGROUND,
  SCREENSHOT,
}

export enum NavIconName {
  HOME,
  PIE,
  ALERT,
  ANALYZER,
  DEVICE,
  SETTINGS,
  CLIPBOARD,
}

export enum ColumnType {
  INDEX = "index",
  CONTENT = "content",
  IMAGE = "image",
  SWITCH = "switch",
  BLANK = "blank",
  DELETE = "delete",
  TAG = "tag",
  MEDIA = "media",
  EDIT = "edit",
  EMPTY = "empty",
  LIST_AND_TOOLTIP = "listAndTooltip",
  MANAGEMENT = "management",
}

export enum TableType {
  TDemo = "TableDemo", // example
  TRole = "TableRole",
  TSheets = "Google Sheets",
  T1 = "Table 1",
  T2 = "Table 2",
  T3 = "Table 3",
  TAccount = "Table Account 1",
  TSelectSort = "Table Select Sort",
}

export const ModalType = {
  ADD: "ADD",
  EDIT: "EDIT",
  VIEW: "VIEW",
} as const;
export type ModalType = EnumValues<typeof ModalType>;

export const MessageType = {
  ERROR: "ERROR",
  WARNING: "WARNING",
  CONFIRM: "CONFIRM",
  INFO: "INFO",
} as const;
export type MessageType = EnumValues<typeof MessageType>;

export const DialogAction = {
  CONFIRM: "CONFIRM",
  CANCEL: "CANCEL",
};
export type DialogAction = EnumValues<typeof DialogAction>;

/****** End CI Module Enums **/
