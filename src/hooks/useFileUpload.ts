import {
  useStateUploadedIconName,
  useStateUploadedIconUrl,
  useStateUploadStatus,
} from '@/jotai/file'

const DWEB_LINK = '.ipfs.w3s.link/'
const TRIM_REGEXP = /\s+/g

export const useFileUpload = () => {
  const [status, setStatus] = useStateUploadStatus()
  const [icon, setIcon] = useStateUploadedIconUrl()
  const [name, setName] = useStateUploadedIconName()

  const upload = async (files: File[], dir: 'web3' | 's3' = 's3') => {
    setStatus('uploading')
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('file', file)
    })

    const options = {
      method: 'POST',
      body: formData,
    }

    try {
      if (dir === 'web3') {
        const res = await fetch('/api/web3StorageUploader', options)
        const data = await res.json()
        if (data.cid) {
          setStatus('completed')
          return data.cid as string
        } else {
          setStatus('failed')
          return
        }
      } else {
        const res = await fetch('/api/s3Uploader', options)
        const data = await res.json()
        if (data.url) {
          setStatus('completed')
          return data.url as string
        } else {
          setStatus('failed')
          return
        }
      }
    } catch (e) {
      console.error(e)
      setStatus('failed')
    }
  }

  const uploadIcon = async (icon: File, dir: 'web3' | 's3' = 's3') => {
    if (!icon) return
    setStatus('uploading')
    try {
      const fileName = icon.name.replace(TRIM_REGEXP, '_')
      const res = await upload([icon], dir)
      const iconUrl = dir === 'web3' ? `https://${res}${DWEB_LINK}` : res
      setName(fileName)
      setIcon(iconUrl)
      return iconUrl
    } catch (error) {
      console.error(error)
      setStatus('failed')
    }
  }

  const resetUploadStatus = () => {
    setStatus(undefined)
  }

  return {
    status,
    resetUploadStatus,
    uploadIcon,
    setIcon,
    icon,
    setName,
    name,
  }
}
