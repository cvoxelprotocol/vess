export const checkAndConvertImageType = async (file: File): Promise<File> => {
  console.log('checkAndConvertImageType | file.type:', file.type)
  if (!file.type.includes('heic') && !file.type.includes('heif')) {
    return file
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')

        if (ctx) {
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            if (blob) {
              const newFile = new File([blob], `${file.name}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(newFile)
            } else {
              reject(new Error('Failed to create blob from canvas'))
            }
          }, 'image/jpeg')
        } else {
          reject(new Error('Failed to get canvas context'))
        }
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}
