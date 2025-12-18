export function normalizeErrorObject(errorObj: string | object | null): object {
  return typeof errorObj === 'object' && errorObj !== null
    ? errorObj
    : { message: errorObj };
}
