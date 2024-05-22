export const checkAndConvertImageType = async (file: File): Promise<File> => {
  if (typeof window == 'undefined') {
    return file
  }
  if (file.type !== 'image/heic' && file.type !== 'image/heif') {
    return file
  }
  try {
    const heic2any = (await import('heic2any')).default
    console.log('checkAndConvertImageType | file.type:', file.type)
    const convertedBlob = (await heic2any({
      blob: file,
      toType: 'image/jpeg',
    })) as Blob
    return new File([convertedBlob], file.name.replace('.heic', '.jpeg'), {
      type: 'image/jpeg',
    })
  } catch (error) {
    console.error('HEIC to JPEG conversion failed:', error)
    throw error
  }
}
