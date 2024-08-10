import imageCompression from 'browser-image-compression'

export const compressImage = async (
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1080,
  useWebWorker: boolean = false,
): Promise<File> => {
  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: maxWidthOrHeight,
      useWebWorker: useWebWorker,
    })
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`)
    return new File([compressedFile], file.name, { type: file.type })
  } catch (error) {
    console.error('Error during image compression:', error)
    throw error
  }
}

export const unescapeHtml = (text: string) => {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

export const isBase64Image = (image: string) => {
  return image.startsWith('data:image/')
}
