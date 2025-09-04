export function formatCurrency(value: number, currency: 'USD' | 'TWD') {
  const options = {
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0
  };

  return value.toLocaleString(undefined, options);
}