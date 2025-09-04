import { MenuDTO } from '@repo/shared';

/**
 * Confirm we are on the client side
 * @returns
 */
export const isClient = (): boolean => {
	if (typeof window !== 'undefined') {
		return true;
	}
	return false;
};

/**
 * Finds the current parent nav out of the nav list
 */
export const findCurrentParentNav = (navList: MenuDTO[]) => {
	const currentPath = window.location.pathname;
	let parentNav = '';

	if (!navList) return parentNav;

	for (let outerIndex = 0; outerIndex < navList.length; outerIndex++) {
		// we are at the exact parent
		if (currentPath == navList[outerIndex].path) {
			parentNav = navList[outerIndex].path;
			break;
		}
	}

	// only check sub nav if no parent exactly match current nav already
	for (let outerIndex = 0; outerIndex < navList.length; outerIndex++) {
		// check if current path is a sub page of a current parent
		if (navList[outerIndex].subPages) {
			navList[outerIndex].subPages?.forEach((subPage) => {
				if (currentPath == subPage.path) {
					parentNav = navList[outerIndex].path;
				}
			});
		}
	}
	return parentNav;
};

export function getS3MediaUrl(filename: string): string {
	if (!filename) {
		return `${process.env.AWS_S3_URL}empty.png`;
	}
	return `${process.env.AWS_S3_URL}${filename}`;
}
