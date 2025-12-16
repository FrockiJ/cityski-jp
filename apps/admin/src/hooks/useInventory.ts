import { useState, useEffect, useCallback } from 'react';
import { getInventory } from '@/utils/http/api/inventory';
import { GetInventoryRequestDTO, InventoryItemDTO } from '@repo/shared';

interface UseInventoryResult {
  data: InventoryItemDTO[];
  loading: boolean;
  error: string | null;
  summary: {
    totalCount: number;
    totalAmount: number;
    totalBalance: number;
  };
  dateRange: {
    from: string;
    to: string;
  };
  refetch: (params?: GetInventoryRequestDTO) => Promise<void>;
}

export const useInventory = (initialParams?: GetInventoryRequestDTO): UseInventoryResult => {
  const [data, setData] = useState<InventoryItemDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState({
    totalCount: 0,
    totalAmount: 0,
    totalBalance: 0,
  });
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });

  const fetchData = useCallback(async (params?: GetInventoryRequestDTO) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInventory(params);
      if (response && response.result) {
        setData(response.result.items);
        setSummary(response.result.summary);
        setDateRange(response.result.dateRange);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory data');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(initialParams);
  }, []);

  return {
    data,
    loading,
    error,
    summary,
    dateRange,
    refetch: fetchData,
  };
};
