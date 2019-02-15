/**
 * Is image source
 */
export default function(url: string) {
  return /^(https?:)?\/\/|data:image|^blob:|^\//.test(url)
}
