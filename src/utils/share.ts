export const shareOnX = (str: string, imageUrl?: string, url?: string) => {
  // Share on X
  const text = encodeURIComponent(str)
  const image = encodeURIComponent(imageUrl || '')
  const URL = encodeURIComponent(url || '')
  return `https://twitter.com/intent/tweet?text=${text}&url=${URL}`
}
