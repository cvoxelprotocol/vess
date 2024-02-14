export const handleShareLink = async (url: string, title: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: 'Check out this link!',
        url: url,
      })
    } catch (error) {
      console.log('Error sharing:', error)
    }
  } else {
    alert('Web Share API not supported')
  }
}
