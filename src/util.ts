export function isObj(value: any) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

export function isSrc(url: string) {
  return /^(((blob:)?https?:)?\/\/|data:image)/.test(url)
}
