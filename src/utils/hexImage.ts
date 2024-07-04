export const checkAndConvertImageResolution = async (file: File): Promise<File> => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target?.result as string

        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (ctx) {
            // Calculate maximum pixels to maintain 12 megapixels
            const maxPixels = 12000000 // 12 megapixels
            let targetWidth = img.width
            let targetHeight = img.height

            // Calculate the scaling factor to keep the image within 12 megapixels
            const scalingFactor = Math.sqrt(maxPixels / (targetWidth * targetHeight))

            // Apply the scaling factor if it is less than 1 (image is larger than 12 megapixels)
            if (scalingFactor < 1) {
              targetWidth = Math.floor(targetWidth * scalingFactor)
              targetHeight = Math.floor(targetHeight * scalingFactor)
            }

            // Resize canvas to the target dimensions
            canvas.width = targetWidth
            canvas.height = targetHeight

            ctx.fillStyle = 'rgba(0,0,0,0)' // Set the fill style to transparent
            ctx.fillRect(0, 0, targetWidth, targetHeight) // Fill the canvas with a transparent color

            ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
            canvas.toBlob((blob) => {
              if (blob) {
                const newFile = new File([blob], `${file.name}.png`, {
                  type: 'image/png',
                  lastModified: Date.now(),
                })
                resolve(newFile)
              } else {
                reject(new Error('Failed to create blob from canvas'))
              }
            }, 'image/png')
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
  } catch (error) {
    console.error(error)
    return file
  }
}
