import { useQuery } from '@tanstack/react-query'
import {
  ImageWithSize,
  loadImageWithoutCache,
  loadImageWithoutCacheWithMetadata,
} from '@/utils/objectUtil'

export const useImage = (url?: string) => {
  const { data: image, isInitialLoading } = useQuery<HTMLImageElement | undefined>(
    ['loadedImage', url],
    () => loadImageWithoutCache(url),
    {
      enabled: !!url && url !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const { data: imageWithSize } = useQuery<ImageWithSize | undefined>(
    ['loadedImageWIthSize', url],
    () => loadImageWithoutCacheWithMetadata(url),
    {
      enabled: !!url && url !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  return { image, isInitialLoading, imageWithSize }
}
