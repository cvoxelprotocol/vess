export const shareOnX = (str: string, imageUrl?: string, url?: string) => {
  // Share on X
  const text = encodeURIComponent(str)
  const image = encodeURIComponent(imageUrl || '')
  const URL = encodeURIComponent(url || '')
  return `https://twitter.com/intent/tweet?text=${text}&url=${URL}`
}

export const shareLink = (url: string) => {
  void (async () => {
    if (navigator.share) {
      // Web share API
      await navigator.share({
        url,
      })
    } else {
      // Web Share APIが使えないブラウザの処理
      await global.navigator.clipboard.writeText(url)
      alert('URLをコピーしました')
    }
  })()
}
