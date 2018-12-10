/**
 * Is image source
 */
export default function(url) {
  return /^(https?:)?\/\/|data:image|^blob:|^\//.test(url)
}
