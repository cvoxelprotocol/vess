import heic2any from 'heic2any'

export const checkAndConvertImageType = async (file: File): Promise<File> => {
  console.log('checkAndConvertImageType | file.type:', file.type)
  if (file.type === 'image/heic') {
    try {
      const convertedBlob = (await heic2any({
        blob: file,
        toType: 'image/jpeg',
      })) as Blob
      return new File([convertedBlob], file.name.replace('.heic', '.jpeg'), {
        type: 'image/jpeg',
      })
    } catch (error) {
      console.error('HEIC to JPEG conversion failed:', error)
    }
  }
  return file
}
