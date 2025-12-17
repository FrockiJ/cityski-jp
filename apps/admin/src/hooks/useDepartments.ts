import { useEffect, useState } from 'react';
import { getDepartments } from '@/utils/http/api/department';

interface Department {
	id: string;
	name: string;
}

export const useDepartments = () => {
	const [departments, setDepartments] = useState<Department[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchDepartments = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await getDepartments();
			if (response.result && Array.isArray(response.result)) {
				const depts = response.result.map((dept) => ({
					id: dept.id,
					name: dept.name,
				}));
				setDepartments(depts);
			}
		} catch (err) {
			console.error('Failed to fetch departments:', err);
			setError(err instanceof Error ? err : new Error('Failed to fetch departments'));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDepartments();
	}, []);

	return {
		departments,
		loading,
		error,
		refetch: fetchDepartments,
	};
};
