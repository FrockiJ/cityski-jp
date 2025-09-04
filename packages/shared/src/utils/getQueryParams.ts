export function getQueryParams(url: string) {
  const paramArr = url.slice(url.indexOf('?') + 1).split('&');
  const params: { [key: string]: string } = {};
  paramArr.map(param => {
    const [key, val] = param.split('=');
    params[key] = decodeURI(val);
  })
  return params;
}