export default function(value) {
  const type = typeof value
  return value != null && (type == 'object' || type == 'function')
}
