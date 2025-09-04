
/**
 * FormData will convert boolean into strings, and this method will convert them back
 * @param value form data boolean
 * @returns boolean
 */
export function transformBoolean(value: boolean | string): boolean {
  console.log('transformBoolean',value);
  if (typeof value === 'boolean') {
    return value;
  } else if (typeof value === 'string' && value.toLowerCase() === 'true') {
    return true;
  } else {
    // You can decide how to handle other cases
    return false;
  }
}