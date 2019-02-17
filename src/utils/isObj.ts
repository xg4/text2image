export default function(value: any) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}
