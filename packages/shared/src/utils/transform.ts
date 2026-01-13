export function toNumberArray(value: string | string[]): number[] | undefined {
  if (Array.isArray(value)) {
    return value.map((v) => Number(v)).filter((v) => !isNaN(v));
  }
  const num = Number(value);
  return isNaN(num) ? undefined : [num];
}

export function toStringArray(value: string | string[]): string[] | undefined {
  if (Array.isArray(value)) {
    return value.filter((v) => v !== "");
  }
  return value ? [value] : undefined;
}
