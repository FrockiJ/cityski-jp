export function getOptionFromEnum(e: any) {
  return Object.values(e).map((value) => ({
    label: value as string,
    value: value as string,
  }));
}