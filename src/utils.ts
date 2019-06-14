export function isObj<T>(x: any): x is T {
  const type = typeof x
  return x != null && (type === 'object' || type === 'function')
}

export const isSrc = (x: any): x is string =>
  /^(((blob:)?https?:)?\/\/|data:image|\/)/.test(x)
