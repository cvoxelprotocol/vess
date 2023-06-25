import {
  useStateUploadedCID,

  useStateUploadedIconName,
  useStateUploadedIconUrl,
  
  useStateUploadStatus,
} from '@/jotai/file'

const DWEB_LINK = '.ipfs.w3s.link/'
const TRIM_REGEXP = /\s+/g

export const useFileUpload = () => {
  const [status, setStatus] = useStateUploadStatus()
  const [cid, setCID] = useStateUploadedCID()
  const [icon, setIcon] = useStateUploadedIconUrl()
  const [name, setName] = useStateUploadedIconName()


  const upload = async (files: File[]) => {
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
      const res = await fetch('/api/web3StorageUploader', options)
      const data = await res.json()
      if (data.cid) {
        setCID(data.cid)
        setStatus('completed')
        return data.cid as string
      } else {
        setStatus('failed')
        return
      }
    } catch (e) {
      console.error(e)
      setStatus('failed')
    }
  }

  const uploadIcon = async (icon: File) => {
    if (!icon) return
    setStatus('uploading')
    const fileName = icon.name.replace(TRIM_REGEXP, '_')
    const cid = await upload([icon])
    setName(fileName)
    setIcon(`https://ipfs.io/${cid}/${fileName}`)
  }
  

  const resetUploadStatus = () => {
    setCID(undefined)
    setStatus(undefined)
  }

  return {
    status,
    cid,
    resetUploadStatus,
    uploadIcon,
    setIcon,
    icon,
    setName,
    name,
  }
}
