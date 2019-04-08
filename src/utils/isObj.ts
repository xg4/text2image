import { PartialOptions } from '../index'

export default function(
  value: string | PartialOptions,
): value is PartialOptions {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}
