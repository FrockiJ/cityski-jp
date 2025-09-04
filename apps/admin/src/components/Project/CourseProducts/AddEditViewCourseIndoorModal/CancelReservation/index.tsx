import React, { useEffect } from 'react';
import { CourseBkgType, CourseStatusType, DialogAction } from '@repo/shared';
import { useFormikContext } from 'formik';
import { Field } from 'formik';

import CoreButton from '@/components/Common/CIBase/CoreButton';
import FormikRadio from '@/components/Common/CIBase/Formik/FormikRadio';
import * as Components from '@/components/Project/shared/Components';

import PolicyFiveItem from './PolicyFiveItem';
import PolicyFourItem from './PolicyFourItem';
import { calculatePolicy2BeforeDay, calculatePolicy3Value } from './policyHelperFunctions';
import PolicyOneItem from './PolicyOneItem';
import PolicySixItem from './PolicySixItem';
import PolicyThreeItem from './PolicyThreeItem';
import PolicyTwoItem from './PolicyTwoItem';
import PolicyZeroItem from './PolicyZeroItem';

// Define the policy type
// 1: Simple policy (課程前日內)
// 2: Complex policy (課程前至日內)
// 3: Free change (課程前日以上)
export type PolicyType = 1 | 2 | 3;

// Define the policy interface
export interface CancelPolicy {
	id: string;
	type: CourseBkgType;
	policyType?: PolicyType;
	withinDay?: string;
	beforeDay?: string;
	price?: string;
	sequence: number;
}

interface CancelReservationProps {
	handleCloseModal?: (action: DialogAction) => void;
	// Props for policy management - these are now optional since we'll handle internally
	hasCancelPolicy?: string;
	policies?: CancelPolicy[];
	daysBeforeFree?: string;
	hasSubmitted?: boolean;
	isSavingDraft?: boolean;
	courseStatusType?: CourseStatusType;
}

interface FormValues {
	bkgType: string;
	courseCancelPolicies: any;
	hasCancelPolicy?: string;
	policies?: CancelPolicy[];
	daysBeforeFree?: string;
	policyFiveDays?: string;
	policySixDays?: string;
}

const tableHeaderCancelCourse = [
	{ label: '取消預約條件', width: '200px' },
	{ label: '取消費用', width: '150px' },
	{ label: '', width: '100px' },
];

const CancelReservation: React.FC<CancelReservationProps> = ({
	hasCancelPolicy: externalHasCancelPolicy,
	policies: externalPolicies,
	daysBeforeFree: externalDaysBeforeFree,
	hasSubmitted = false,
	isSavingDraft = false,
	courseStatusType,
}) => {
	const { values, setFieldValue } = useFormikContext<FormValues>();

	// Use the external values if provided, otherwise use the form values
	const hasCancelPolicy = externalHasCancelPolicy || values.hasCancelPolicy;
	const policies = externalPolicies || values.policies || [];
	const daysBeforeFree = externalDaysBeforeFree || values.daysBeforeFree;
	const isCourseBkgTypeTwo = Number(values.bkgType) === CourseBkgType.FIXED;

	// Add a flag to determine if the form should be disabled
	const isDisabled =
		courseStatusType === CourseStatusType.PUBLISHED || courseStatusType === CourseStatusType.UNPUBLISHED;

	// Update form values when external props change
	useEffect(() => {
		if (externalHasCancelPolicy) {
			setFieldValue('hasCancelPolicy', externalHasCancelPolicy);
		}

		if (externalPolicies && externalPolicies.length > 0) {
			setFieldValue('policies', externalPolicies);

			// Special handling for FIXED type (bkgType 2)
			if (Number(values.bkgType) === CourseBkgType.FIXED) {
				// Check if we have exactly 2 policies with the expected structure
				if (externalPolicies.length === 2) {
					const policy1 = externalPolicies[0];
					const policy2 = externalPolicies[1];

					// Extract the values for policy5 and policy6
					if (policy1.withinDay && policy2.beforeDay) {
						// Set the policyFiveDays and policySixDays values
						setFieldValue('policyFiveDays', policy1.withinDay);
						setFieldValue('policySixDays', policy2.beforeDay);

						// Also update courseCancelPolicies
						const fixedPolicies = [
							{
								type: CourseBkgType.FIXED,
								withinDay: Number(policy1.withinDay),
								sequence: 1,
							},
							{
								type: CourseBkgType.FIXED,
								beforeDay: Number(policy2.beforeDay),
								sequence: 2,
							},
						];

						setFieldValue('courseCancelPolicies', fixedPolicies);
					}
				}
			}
		}

		if (externalDaysBeforeFree) {
			setFieldValue('daysBeforeFree', externalDaysBeforeFree);
		}
	}, [externalHasCancelPolicy, externalPolicies, externalDaysBeforeFree, setFieldValue, values.bkgType]);

	// Add a new useEffect to clean courseCancelPolicies when bkgType changes
	useEffect(() => {
		// When bkgType changes, clean up the policies based on the new type
		if (Number(values.bkgType) === CourseBkgType.FIXED) {
			// For FIXED type, we only want policies 5 and 6
			if (hasCancelPolicy === 'Y') {
				// Only create policies if values exist
				if (values.policyFiveDays && values.policySixDays) {
					// Create the fixed policies array with only the two required items
					const fixedPolicies = [
						{
							type: CourseBkgType.FIXED,
							withinDay: Number(values.policyFiveDays),
							sequence: 1,
						},
						{
							type: CourseBkgType.FIXED,
							beforeDay: Number(values.policySixDays),
							sequence: 2,
						},
					];

					// Update courseCancelPolicies with only these two items
					setFieldValue('courseCancelPolicies', fixedPolicies);

					// Also update the policies array for the parent component
					const policiesForParent = [
						{
							id: 'policy-five-' + Math.random().toString(36).substring(2, 5),
							type: CourseBkgType.FIXED,
							policyType: 1, // Use policyType 1 for the first policy
							withinDay: values.policyFiveDays,
							sequence: 1,
						},
						{
							id: 'policy-six-' + Math.random().toString(36).substring(2, 5),
							type: CourseBkgType.FIXED,
							policyType: 3, // Use policyType 3 for the second policy
							beforeDay: values.policySixDays,
							sequence: 2,
						},
					];

					setFieldValue('policies', policiesForParent);
				}
			} else {
				// If cancel policy is disabled, clear everything
				setFieldValue('courseCancelPolicies', []);
				setFieldValue('policies', []);
				setFieldValue('policyFiveDays', '');
				setFieldValue('policySixDays', '');
			}
		} else {
			// For FLEXIBLE type, clear the fixed policy fields
			setFieldValue('policyFiveDays', '');
			setFieldValue('policySixDays', '');
			setFieldValue('courseCancelPolicies', []);

			// When switching from FIXED to FLEXIBLE, ensure we have a default policy 3
			if (hasCancelPolicy === 'Y') {
				const existingPolicies = values.policies || [];
				const hasPolicy3 = existingPolicies.some((p) => p.policyType === 3);

				if (!hasPolicy3) {
					// Create a default policy 3 with value "1"
					const defaultPolicy3: CancelPolicy = {
						id: Math.random().toString(36).substring(2, 9),
						policyType: 3,
						type: CourseBkgType.FLEXIBLE,
						sequence: existingPolicies.length + 1,
						beforeDay: '1',
					};

					// Add policy 3 to existing policies
					const updatedPolicies = [...existingPolicies, defaultPolicy3];
					setFieldValue('policies', updatedPolicies);
					setFieldValue('daysBeforeFree', '1');
				}
			}
		}
	}, [values.bkgType, hasCancelPolicy, values.policyFiveDays, values.policySixDays]);

	// Modify the existing useEffect for policyFiveDays/policySixDays to avoid duplication
	useEffect(() => {
		if (isCourseBkgTypeTwo && hasCancelPolicy === 'Y') {
			// Only proceed if policy5 has a value
			if (values.policyFiveDays) {
				// Ensure policy6 is always policy5 + 1
				const policy6Value = String(Number(values.policyFiveDays) + 1);
				if (values.policySixDays !== policy6Value) {
					setFieldValue('policySixDays', policy6Value);
				}

				// Create the fixed policies array for courseCancelPolicies
				const fixedPolicies = [
					{
						type: CourseBkgType.FIXED,
						withinDay: Number(values.policyFiveDays),
						sequence: 1,
					},
					{
						type: CourseBkgType.FIXED,
						beforeDay: Number(policy6Value),
						sequence: 2,
					},
				];

				// Update the courseCancelPolicies field for form submission
				setFieldValue('courseCancelPolicies', fixedPolicies);

				// IMPORTANT: Also update the policies array with the same data
				// This ensures the parent component can process them
				const policiesForParent = [
					{
						id: 'policy-five-' + Math.random().toString(36).substring(2, 5),
						type: CourseBkgType.FIXED,
						policyType: 1, // Use policyType 1 for the first policy
						withinDay: values.policyFiveDays,
						sequence: 1,
					},
					{
						id: 'policy-six-' + Math.random().toString(36).substring(2, 5),
						type: CourseBkgType.FIXED,
						policyType: 3, // Use policyType 3 for the second policy
						beforeDay: policy6Value,
						sequence: 2,
					},
				];

				setFieldValue('policies', policiesForParent);
			} else {
				// If policy5 is empty, clear policy6 and courseCancelPolicies
				setFieldValue('policySixDays', '');
				setFieldValue('courseCancelPolicies', []);
				setFieldValue('policies', []);
			}
		}
	}, [isCourseBkgTypeTwo, hasCancelPolicy, values.policyFiveDays]);

	// Add a useEffect to extract policy values from existing policies when bkgType changes
	useEffect(() => {
		// Only run this when we have policies and the booking type is FIXED
		if (policies.length > 0 && Number(values.bkgType) === CourseBkgType.FIXED && hasCancelPolicy === 'Y') {
			// Look for policies with the right structure
			const policy1 = policies.find((p) => p.policyType === 1 && p.withinDay);
			const policy3 = policies.find((p) => p.policyType === 3 && p.beforeDay);

			if (policy1 && policy1.withinDay) {
				// Set policyFiveDays from policy1's withinDay
				setFieldValue('policyFiveDays', policy1.withinDay);

				// If we have policy3, use its beforeDay for policySixDays
				if (policy3 && policy3.beforeDay) {
					setFieldValue('policySixDays', policy3.beforeDay);
				} else {
					// Otherwise calculate policySixDays as policyFiveDays + 1
					setFieldValue('policySixDays', String(Number(policy1.withinDay) + 1));
				}

				// Update courseCancelPolicies
				const policy6Value = policy3?.beforeDay || String(Number(policy1.withinDay) + 1);
				const fixedPolicies = [
					{
						type: CourseBkgType.FIXED,
						withinDay: Number(policy1.withinDay),
						sequence: 1,
					},
					{
						type: CourseBkgType.FIXED,
						beforeDay: Number(policy6Value),
						sequence: 2,
					},
				];

				setFieldValue('courseCancelPolicies', fixedPolicies);
			}
		}
	}, [values.bkgType, policies, hasCancelPolicy]);

	// Add a useEffect for debugging
	useEffect(() => {
		if (isCourseBkgTypeTwo && hasCancelPolicy === 'Y') {
			console.log('Current state for bkgType 2:');
			console.log('policyFiveDays:', values.policyFiveDays);
			console.log('policySixDays:', values.policySixDays);
			console.log('policies:', values.policies);
			console.log('courseCancelPolicies:', values.courseCancelPolicies);
		}
	}, [
		isCourseBkgTypeTwo,
		hasCancelPolicy,
		values.policyFiveDays,
		values.policySixDays,
		values.policies,
		values.courseCancelPolicies,
	]);

	// Handler for changing the hasCancelPolicy radio value
	const handleCancelPolicyChange = (newValue: string) => {
		// Set the hasCancelPolicy value first
		setFieldValue('hasCancelPolicy', newValue);

		if (isCourseBkgTypeTwo) {
			// For CourseBkgType.FIXED, handle differently
			if (newValue === 'N') {
				// Clear everything if cancel policy is disabled
				setFieldValue('courseCancelPolicies', []);
				setFieldValue('policies', []);
				setFieldValue('policyFiveDays', '');
				setFieldValue('policySixDays', '');
			} else {
				// When enabling cancel policy for FIXED type, set default values
				// But only if policyFiveDays doesn't already have a value
				if (!values.policyFiveDays) {
					// Set default value for policyFiveDays
					const policy5Value = '1';
					const policy6Value = '2';

					setFieldValue('policyFiveDays', policy5Value);
					setFieldValue('policySixDays', policy6Value);

					// Create the fixed policies
					const fixedPolicies = [
						{
							type: CourseBkgType.FIXED,
							withinDay: Number(policy5Value),
							sequence: 1,
						},
						{
							type: CourseBkgType.FIXED,
							beforeDay: Number(policy6Value),
							sequence: 2,
						},
					];

					// Update courseCancelPolicies
					setFieldValue('courseCancelPolicies', fixedPolicies);

					// Also update the policies array for the parent component
					const policiesForParent = [
						{
							id: 'policy-five-' + Math.random().toString(36).substring(2, 5),
							type: CourseBkgType.FIXED,
							policyType: 1,
							withinDay: policy5Value,
							sequence: 1,
						},
						{
							id: 'policy-six-' + Math.random().toString(36).substring(2, 5),
							type: CourseBkgType.FIXED,
							policyType: 3,
							beforeDay: policy6Value,
							sequence: 2,
						},
					];

					setFieldValue('policies', policiesForParent);
				} else {
					// If policyFiveDays already has a value, just clear other values to ensure clean state
					setFieldValue('courseCancelPolicies', []);
					setFieldValue('policies', []);
				}
			}
			// Don't create policies here - let the useEffect handle it
			return;
		}

		// Original logic for non-FIXED type
		if (newValue === 'N') {
			// If set to "N", reset policies to only have Policy 3 with value "1"
			const bkgType = (Number(values.bkgType) as CourseBkgType) || CourseBkgType.FLEXIBLE;

			// Create a single Policy 3 with value "1"
			const defaultPolicy3: CancelPolicy = {
				id: Math.random().toString(36).substring(2, 9),
				policyType: 3,
				type: bkgType,
				sequence: 1,
				beforeDay: '1',
			};

			// Update the form values
			setFieldValue('policies', [defaultPolicy3]);
			setFieldValue('daysBeforeFree', '1');
		} else {
			// If set to "Y", ensure there's at least a Policy 3
			const bkgType = (Number(values.bkgType) as CourseBkgType) || CourseBkgType.FLEXIBLE;

			// Check if there are any existing policies
			const existingPolicies = values.policies || [];

			// Check if Policy 3 already exists
			const hasPolicy3 = existingPolicies.some((p) => p.policyType === 3);

			if (!hasPolicy3) {
				// Create a default Policy 3 with value "1"
				const defaultPolicy3: CancelPolicy = {
					id: Math.random().toString(36).substring(2, 9),
					policyType: 3,
					type: bkgType,
					sequence: existingPolicies.length + 1,
					beforeDay: '1',
				};

				// Add Policy 3 to existing policies
				const updatedPolicies = [...existingPolicies, defaultPolicy3];

				// Update form values
				setFieldValue('policies', updatedPolicies);
				setFieldValue('daysBeforeFree', '1');
			}
		}
	};

	// Handler for adding a new policy
	const handleAddPolicy = () => {
		// Create a copy of the policies array
		const updatedPolicies = [...policies];

		// Determine the policy type to add
		const policyType: PolicyType = updatedPolicies.some((p) => p.policyType === 1) ? 2 : 1;

		// Create a new policy with default values
		const newPolicy: CancelPolicy = {
			id: Math.random().toString(36).substring(2, 9),
			type: Number(values.bkgType),
			policyType: policyType,
			sequence: updatedPolicies.length + 1,
			beforeDay: '0',
			withinDay: '0',
			price: '0',
		};

		// Set default values based on policy type and existing policies
		if (policyType === 1) {
			// For Policy1, set withinDay to 2
			newPolicy.withinDay = '2';
			newPolicy.price = '0';
		} else if (policyType === 2) {
			// For Policy2, first input (beforeDay) should be previous item's last input + 1
			const previousPolicies = updatedPolicies.filter((p) => p.policyType !== 3); // Exclude policy3

			if (previousPolicies.length > 0) {
				const lastPolicy = previousPolicies[previousPolicies.length - 1];

				// Determine the last input value of the previous policy
				let lastInputValue = '1';
				if (lastPolicy.policyType === 1 && lastPolicy.withinDay) {
					lastInputValue = lastPolicy.withinDay;
				} else if (lastPolicy.policyType === 2 && lastPolicy.withinDay) {
					lastInputValue = lastPolicy.withinDay;
				}

				// Set beforeDay to lastInputValue + 1
				const beforeDayValue = String(Number(lastInputValue) + 1);
				newPolicy.beforeDay = beforeDayValue;

				// Set withinDay to beforeDay + 1
				newPolicy.withinDay = String(Number(beforeDayValue) + 1);
			} else {
				// Default values if no previous policies
				newPolicy.beforeDay = '2';
				newPolicy.withinDay = '3';
			}
		}

		// Find policy 3 if it exists
		const policy3Index = updatedPolicies.findIndex((p) => p.policyType === 3);

		if (policy3Index !== -1) {
			// If policy 3 exists, remove it first
			const policy3 = updatedPolicies.splice(policy3Index, 1)[0];

			// Add the new policy
			updatedPolicies.push(newPolicy);

			// Add policy 3 back at the end
			updatedPolicies.push(policy3);
		} else {
			// If policy 3 doesn't exist, just add the new policy
			updatedPolicies.push(newPolicy);
		}

		// Update sequences to ensure correct order
		updatedPolicies.forEach((policy, index) => {
			policy.sequence = index + 1;
		});

		// Update policy 3's value based on the rules
		const newPolicy3Index = updatedPolicies.findIndex((p) => p.policyType === 3);
		if (newPolicy3Index !== -1) {
			// Calculate policy 3's value based on the rules
			let policy3Value = '';

			// If there's a policy 2, use the last policy 2's withinDay + 1
			const policy2Items = updatedPolicies.filter((p) => p.policyType === 2);
			if (policy2Items.length > 0) {
				const lastPolicy2 = policy2Items[policy2Items.length - 1];
				policy3Value = String(Number(lastPolicy2.withinDay || '0') + 1);
			}
			// Otherwise, if there's a policy 1, use policy 1's withinDay + 1
			else if (updatedPolicies.some((p) => p.policyType === 1)) {
				const policy1 = updatedPolicies.find((p) => p.policyType === 1);
				policy3Value = String(Number(policy1?.withinDay || '0') + 1);
			}
			// Default to 1 if no other policies
			else {
				policy3Value = '1';
			}

			// Update policy 3
			updatedPolicies[newPolicy3Index] = {
				...updatedPolicies[newPolicy3Index],
				beforeDay: policy3Value,
			};

			// Update daysBeforeFree
			setFieldValue('daysBeforeFree', policy3Value);
		}

		// Update the form values
		setFieldValue('policies', updatedPolicies);
	};

	// Update the calculatePolicy3Value function to follow the rules
	const calculatePolicy3ValueBasedOnRules = (policies: CancelPolicy[]): string => {
		// Filter out policy 3 itself
		const nonPolicy3Items = policies.filter((p) => p.policyType !== 3);

		if (nonPolicy3Items.length === 0) {
			return '1'; // Default value if no other policies
		}

		// If there's a policy 2, use the last policy 2's withinDay + 1
		const policy2Items = nonPolicy3Items.filter((p) => p.policyType === 2);
		if (policy2Items.length > 0) {
			const lastPolicy2 = policy2Items[policy2Items.length - 1];
			return String(Number(lastPolicy2.withinDay || '0') + 1);
		}

		// Otherwise, if there's a policy 1, use policy 1's withinDay + 1
		const policy1 = nonPolicy3Items.find((p) => p.policyType === 1);
		if (policy1) {
			return String(Number(policy1.withinDay || '0') + 1);
		}

		return '1'; // Default fallback
	};

	// Handler for updating a policy
	const handleUpdatePolicy = (id: string, field: keyof CancelPolicy, value: string) => {
		const updatedPolicies = [...policies];
		const policyIndex = updatedPolicies.findIndex((p) => p.id === id);

		if (policyIndex !== -1) {
			updatedPolicies[policyIndex] = {
				...updatedPolicies[policyIndex],
				[field]: value,
			};

			if (field === 'policyType' && Number(value) === 3) {
				const policy3 = updatedPolicies.splice(policyIndex, 1)[0];
				updatedPolicies.push(policy3);
				updatedPolicies.forEach((policy, index) => {
					policy.sequence = index + 1;
				});
			}

			if (field === 'policyType' && Number(value) === 2) {
				// If changing to policy 2, set beforeDay based on previous policy
				const previousPolicies = updatedPolicies.slice(0, policyIndex).filter((p) => p.policyType !== 3);

				if (previousPolicies.length > 0) {
					const lastPolicy = previousPolicies[previousPolicies.length - 1];

					// Determine the last input value of the previous policy
					let lastInputValue = '1';
					if (lastPolicy.policyType === 1 && lastPolicy.withinDay) {
						lastInputValue = lastPolicy.withinDay;
					} else if (lastPolicy.policyType === 2 && lastPolicy.withinDay) {
						lastInputValue = lastPolicy.withinDay;
					}

					// Set beforeDay to lastInputValue + 1
					const beforeDayValue = String(Number(lastInputValue) + 1);
					updatedPolicies[policyIndex].beforeDay = beforeDayValue;

					// Set withinDay to beforeDay + 1
					updatedPolicies[policyIndex].withinDay = String(Number(beforeDayValue) + 1);
				} else {
					// Default values if no previous policies
					updatedPolicies[policyIndex].beforeDay = '2';
					updatedPolicies[policyIndex].withinDay = '3';
				}
			}

			if (field === 'beforeDay' && updatedPolicies[policyIndex].policyType === 2) {
				// When beforeDay changes for policy 2, update its withinDay to be beforeDay + 1
				if (value && value.trim() !== '') {
					updatedPolicies[policyIndex].withinDay = String(Number(value) + 1);
				}
			}

			if (field === 'withinDay') {
				// If this is policy 1 or policy 2, update the next policy 2's beforeDay if it exists
				if (updatedPolicies[policyIndex].policyType === 1 || updatedPolicies[policyIndex].policyType === 2) {
					// Find the next policy 2 after this one
					for (let i = policyIndex + 1; i < updatedPolicies.length; i++) {
						if (updatedPolicies[i].policyType === 2) {
							// Update its beforeDay to be this policy's withinDay + 1
							updatedPolicies[i].beforeDay = String(Number(value) + 1);

							// Also update its withinDay to be its beforeDay + 1
							updatedPolicies[i].withinDay = String(Number(updatedPolicies[i].beforeDay) + 1);
							break;
						}
					}
				}

				// Always update policy 3 when any withinDay changes
				const type3PolicyIndex = updatedPolicies.findIndex((p) => p.policyType === 3);
				if (type3PolicyIndex !== -1) {
					const calculatedValue = calculatePolicy3ValueBasedOnRules(updatedPolicies);
					updatedPolicies[type3PolicyIndex].beforeDay = calculatedValue;
					setFieldValue('daysBeforeFree', calculatedValue);
				}
			}
		}

		setFieldValue('policies', updatedPolicies);
	};

	// Handler for removing a policy
	const handleRemovePolicy = (id: string) => {
		// Find the policy to be removed
		const policyToRemove = policies.find((p) => p.id === id);

		// We'll keep this check as a safety measure, but the button should already be hidden
		if (policyToRemove?.policyType === 1 && policies.some((p) => p.policyType === 2)) {
			// Don't allow removing Policy One when Policy Two exists
			return;
		}

		const filteredPolicies = policies.filter((p) => p.id !== id);

		// Ensure correct sequence order after removal
		filteredPolicies.forEach((policy, index) => {
			policy.sequence = index + 1;
		});

		// If we have a type 3 policy, make sure it's at the end
		const type3PolicyIndex = filteredPolicies.findIndex((p) => p.policyType === 3);
		if (type3PolicyIndex !== -1 && type3PolicyIndex !== filteredPolicies.length - 1) {
			// Remove the type 3 policy
			const type3Policy = filteredPolicies.splice(type3PolicyIndex, 1)[0];
			// Add it back at the end
			filteredPolicies.push(type3Policy);
			// Update sequences again
			filteredPolicies.forEach((policy, index) => {
				policy.sequence = index + 1;
			});
		}

		// Recalculate beforeDay values for all type 2 policies
		filteredPolicies.forEach((policy, index) => {
			if (policy.policyType === 2) {
				const calculatedBeforeDay = calculatePolicy2BeforeDay(filteredPolicies, index);
				policy.beforeDay = calculatedBeforeDay;
			}
		});

		// Recalculate Policy 3's beforeDay value if it exists
		if (type3PolicyIndex !== -1) {
			// Calculate the appropriate value using the helper function
			const calculatedValue = calculatePolicy3Value(filteredPolicies);

			// Update Policy 3's beforeDay value
			const updatedType3PolicyIndex = filteredPolicies.findIndex((p) => p.policyType === 3);
			if (updatedType3PolicyIndex !== -1) {
				filteredPolicies[updatedType3PolicyIndex] = {
					...filteredPolicies[updatedType3PolicyIndex],
					beforeDay: calculatedValue,
				};
			}

			// Update both policies and daysBeforeFree
			setFieldValue('policies', filteredPolicies);
			setFieldValue('daysBeforeFree', calculatedValue);
		} else {
			// Just update policies if no Policy 3
			setFieldValue('policies', filteredPolicies);
		}
	};

	// Handler for updating daysBeforeFree
	const handleDaysBeforeFreeChange = () => {
		// Create a copy of the policies array
		const newPolicies = [...policies];
		const type3PolicyIndex = newPolicies.findIndex((p) => p.policyType === 3);

		// Calculate the appropriate value using the new rules
		const calculatedValue = calculatePolicy3ValueBasedOnRules(newPolicies);

		// Update or add the type 3 policy
		if (type3PolicyIndex !== -1) {
			// Update existing type 3 policy
			newPolicies[type3PolicyIndex] = {
				...newPolicies[type3PolicyIndex],
				beforeDay: calculatedValue,
			};
		} else if (calculatedValue !== '') {
			// Only add a new type 3 policy if we have a valid calculated value
			const maxSequence = newPolicies.length > 0 ? Math.max(...newPolicies.map((p) => p.sequence || 0)) : 0;

			// Get the booking type as CourseBkgType
			const bkgType = (Number(values.bkgType) as CourseBkgType) || CourseBkgType.FLEXIBLE;

			const newPolicy: CancelPolicy = {
				id: Math.random().toString(36).substring(2, 9),
				policyType: 3,
				type: bkgType,
				sequence: maxSequence + 1,
				beforeDay: calculatedValue,
			};

			newPolicies.push(newPolicy);

			// Ensure policy3 is the last item by updating all sequences
			newPolicies.forEach((policy, index) => {
				policy.sequence = index + 1;
			});
		}

		// Update both daysBeforeFree and policies
		setFieldValue('daysBeforeFree', calculatedValue);
		setFieldValue('policies', newPolicies);
	};

	return (
		<div>
			{/* Hidden field to ensure courseCancelPolicies is included in form submission */}
			{isCourseBkgTypeTwo && hasCancelPolicy === 'Y' && <Field type='hidden' name='courseCancelPolicies' />}

			<FormikRadio
				name='hasCancelPolicy'
				title='是否可以取消課程預約或改期'
				isRequired
				margin='0 0 24px 0'
				width='100%'
				radios={[
					{ label: '是', value: 'Y' },
					{ label: '否', value: 'N' },
				]}
				value={hasCancelPolicy}
				onChange={(e) => {
					// Call the handler which now has separate logic for each booking type
					handleCancelPolicyChange(e.target.value);
				}}
				disabled={isDisabled}
			/>

			{hasCancelPolicy === 'Y' && (
				<>
					<Components.Row header tableHeader={tableHeaderCancelCourse}>
						<Components.StyledCell header width='260px'>
							日期
						</Components.StyledCell>
						<Components.StyledCell header width='430px'>
							預約取消規則
						</Components.StyledCell>
						<Components.StyledCell header width='60px'></Components.StyledCell>
					</Components.Row>
					{isCourseBkgTypeTwo ? (
						<>
							<PolicyFourItem />
							<PolicyFiveItem
								id='policy-five'
								withinDay={values.policyFiveDays}
								onWithinDay2Change={(value) => {
									console.log('PolicyFiveItem value changed to:', value);

									// Update policy5 value
									setFieldValue('policyFiveDays', value);

									// Automatically update policy6 value to be policy5 + 1
									if (value) {
										const policy6Value = String(Number(value) + 1);
										setFieldValue('policySixDays', policy6Value);

										// Also update courseCancelPolicies to ensure it's always in sync
										const fixedPolicies = [
											{
												type: CourseBkgType.FIXED,
												withinDay: Number(value),
												sequence: 1,
											},
											{
												type: CourseBkgType.FIXED,
												beforeDay: Number(policy6Value),
												sequence: 2,
											},
										];

										console.log('Setting courseCancelPolicies to:', fixedPolicies);
										setFieldValue('courseCancelPolicies', fixedPolicies);

										// Also update the policies array for the parent component
										const policiesForParent = [
											{
												id: 'policy-five-' + Math.random().toString(36).substring(2, 5),
												type: CourseBkgType.FIXED,
												policyType: 1,
												withinDay: value,
												sequence: 1,
											},
											{
												id: 'policy-six-' + Math.random().toString(36).substring(2, 5),
												type: CourseBkgType.FIXED,
												policyType: 3,
												beforeDay: policy6Value,
												sequence: 2,
											},
										];

										console.log('Setting policies to:', policiesForParent);
										setFieldValue('policies', policiesForParent);
									} else {
										// If policy5 is cleared, clear policy6 as well
										setFieldValue('policySixDays', '');
										setFieldValue('courseCancelPolicies', []);
										setFieldValue('policies', []);
									}
								}}
								hasSubmitted={hasSubmitted}
								isSavingDraft={isSavingDraft}
								isDisabled={isDisabled}
							/>
							<PolicySixItem
								id='policy-six'
								beforeDay={values.policySixDays}
								onBeforeDayChange={(value) => setFieldValue('policySixDays', value)}
								isDisabled={true} // Make policy6 input disabled since it's automatically calculated
								hasSubmitted={hasSubmitted}
								isSavingDraft={isSavingDraft}
							/>
						</>
					) : (
						<>
							<PolicyZeroItem key='policy-zero' />
							{policies.map((policy) => {
								if (policy.policyType === 1) {
									const hasPolicy2 = policies.some((p) => p.policyType === 2);
									return (
										<PolicyOneItem
											key={policy.id}
											id={policy.id}
											withinDay={policy.withinDay}
											price={policy.price}
											onWithinDayChange={(value) => handleUpdatePolicy(policy.id, 'withinDay', value)}
											onPriceChange={(value) => handleUpdatePolicy(policy.id, 'price', value)}
											onRemove={() => handleRemovePolicy(policy.id)}
											showRemoveButton={!hasPolicy2}
											hasSubmitted={hasSubmitted}
											isSavingDraft={isSavingDraft}
											isDisabled={isDisabled}
										/>
									);
								} else if (policy.policyType === 2) {
									console.log('is disabled', isDisabled);
									return (
										<PolicyTwoItem
											key={policy.id}
											id={policy.id}
											beforeDay={policy.beforeDay}
											withinDay={policy.withinDay}
											price={policy.price}
											onBeforeDayChange={(value) => handleUpdatePolicy(policy.id, 'beforeDay', value)}
											onWithinDayChange={(value) => handleUpdatePolicy(policy.id, 'withinDay', value)}
											onPriceChange={(value) => handleUpdatePolicy(policy.id, 'price', value)}
											onRemove={() => handleRemovePolicy(policy.id)}
											isBeforeDayDisabled={true}
											hasSubmitted={hasSubmitted}
											isSavingDraft={isSavingDraft}
											isDisabled={isDisabled}
										/>
									);
								} else if (policy.policyType === 3) {
									return (
										<PolicyThreeItem
											key={policy.id}
											id={policy.id}
											beforeDay={policy.beforeDay}
											onBeforeDayChange={(value) => {
												handleUpdatePolicy(policy.id, 'beforeDay', value);
												handleDaysBeforeFreeChange();
											}}
											isDisabled={true}
											hasSubmitted={hasSubmitted}
											isSavingDraft={isSavingDraft}
										/>
									);
								}
								return null;
							})}
							{!policies.some((policy) => policy.policyType === 3) && (
								<PolicyThreeItem
									key='default-policy-3'
									id='default-policy-3'
									beforeDay={daysBeforeFree}
									onBeforeDayChange={(value) => {
										const bkgType = (Number(values.bkgType) as CourseBkgType) || CourseBkgType.FLEXIBLE;
										const newPolicy3: CancelPolicy = {
											id: Math.random().toString(36).substring(2, 9),
											policyType: 3,
											type: bkgType,
											sequence: policies.length + 1,
											beforeDay: value,
										};
										const updatedPolicies = [...policies, newPolicy3];
										setFieldValue('policies', updatedPolicies);
										setFieldValue('daysBeforeFree', value);
										handleDaysBeforeFreeChange();
									}}
									isDisabled={true}
									hasSubmitted={hasSubmitted}
									isSavingDraft={isSavingDraft}
								/>
							)}
							<Components.Row>
								{!isDisabled && (
									<CoreButton
										iconType='add'
										variant='outlined'
										label='新增規則'
										onClick={handleAddPolicy}
										margin='8px'
									/>
								)}
							</Components.Row>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default CancelReservation;
