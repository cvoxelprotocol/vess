import { useQuery } from '@tanstack/react-query'
import { PostFeed } from '@/@types/user'
import { getPostFeedByDID } from '@/lib/vessApi'

export const usePostFeed = (did?: string) => {
  const { data: postFeed, isInitialLoading } = useQuery<PostFeed[] | null>(
    ['fetchPostFeed', did],
    () => fetchPostFeed(did),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const fetchPostFeed = async (did?: string) => {
    if (!did) {
      return null
    }
    try {
      return await getPostFeedByDID(did)
    } catch (error) {
      throw error
    }
  }

  return {
    postFeed,
    isInitialLoading,
  }
}
