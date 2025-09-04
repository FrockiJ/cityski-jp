import { CancelPolicy } from '.';

// Helper function to calculate the appropriate value for Policy 3
export const calculatePolicy3Value = (policies: CancelPolicy[]) => {
	// Default value is empty string if there are no valid reference inputs
	// This will clear Policy 3's value when no valid references exist
	let calculatedValue = '';

	// Check if Policy 3 is the only policy in the list
	const hasOnlyPolicy3 = policies.length === 1 && policies[0].policyType === 3;
	const hasPolicy3 = policies.some((p) => p.policyType === 3);

	// If Policy 3 is the only policy, return "1"
	if (hasOnlyPolicy3 || (hasPolicy3 && policies.length === 1)) {
		return '1';
	}

	// Filter out Policy 3 items
	const otherPolicies = policies.filter((p) => p.policyType !== 3);

	// Check if we have any policies other than Policy 3
	if (otherPolicies.length === 0) {
		// If we only have Policy 3, return "1"
		return hasPolicy3 ? '1' : '';
	}

	// First, try to find Policy 2 items
	const policy2Items = otherPolicies.filter((p) => p.policyType === 2);

	if (policy2Items.length > 0) {
		// Sort Policy 2 items by sequence to find the last one
		const sortedPolicy2Items = [...policy2Items].sort((a, b) => a.sequence - b.sequence);
		const lastPolicy2 = sortedPolicy2Items[sortedPolicy2Items.length - 1];

		// If the last Policy 2 has a valid withinDay value, use it + 1
		if (lastPolicy2.withinDay && lastPolicy2.withinDay.trim() !== '') {
			calculatedValue = String(Number(lastPolicy2.withinDay) + 1);
			return calculatedValue;
		} else {
			// If Policy 2 exists but has no valid withinDay, return empty string
			return '';
		}
	}

	// If no valid Policy 2 items found, fall back to Policy 1
	const policy1Items = otherPolicies.filter((p) => p.policyType === 1);

	if (policy1Items.length > 0) {
		// Get valid withinDay values from Policy 1 items
		const validWithinDayValues = policy1Items
			.filter((p) => p.withinDay && p.withinDay.trim() !== '')
			.map((p) => Number(p.withinDay) || 0);

		if (validWithinDayValues.length > 0) {
			const maxWithinDay = Math.max(...validWithinDayValues);
			calculatedValue = String(maxWithinDay + 1);
		} else {
			// If Policy 1 exists but has no valid withinDay, return empty string
			return '';
		}
	}

	return calculatedValue;
};

// Helper function to calculate the appropriate value for Policy 2's beforeDay
export const calculatePolicy2BeforeDay = (policies: CancelPolicy[], newPolicyIndex: number) => {
	// Default value is empty string if there are no valid reference inputs
	let calculatedValue = '';

	// If this is the first policy in the list, return "1"
	if (newPolicyIndex === 0) {
		return '1';
	}

	// Get the previous policy
	const previousPolicy = policies[newPolicyIndex - 1];

	// If the previous policy has a valid withinDay value, use it + 1
	if (previousPolicy && previousPolicy.withinDay && previousPolicy.withinDay.trim() !== '') {
		calculatedValue = String(Number(previousPolicy.withinDay) + 1);
	}

	return calculatedValue;
};

// Helper function to calculate the default value for Policy 2's withinDay
export const calculatePolicy2WithinDay = (beforeDay: string) => {
	// If beforeDay is empty or not a valid number, return empty string
	if (!beforeDay || beforeDay.trim() === '') {
		return '';
	}

	// Otherwise, return beforeDay + 1
	return String(Number(beforeDay) + 1);
};
