import { useEffect, useState } from 'react';

const useSheetsDataKey = (columnHeaderData: any) => {
	const [keys, setKeys] = useState<(string | number)[]>([]);
	// console.log(keys);

	useEffect(() => {
		if (columnHeaderData !== undefined) {
			const tempKeys = columnHeaderData.map((c: any) => c.key).filter((c: any) => c !== undefined);
			setKeys(tempKeys);
		}
	}, [columnHeaderData]);

	return keys;
};
export default useSheetsDataKey;
