import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useVESSLoading } from './useVESSLoading'
import { AddPostRequest, PostWithUser } from '@/@types/user'
import { addPost, deletePost, getPostById } from '@/lib/vessApi'

export const usePost = (id?: string) => {
  const { showLoading, closeLoading } = useVESSLoading()
  const queryClient = useQueryClient()

  const { data: post, isInitialLoading } = useQuery<PostWithUser | null>(
    ['fetchPost', id],
    () => fetchPost(id),
    {
      enabled: !!id && id !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const fetchPost = async (id?: string) => {
    if (!id) {
      return null
    }
    try {
      return await getPostById(id)
    } catch (error) {
      throw error
    }
  }

  const { mutateAsync: addItem } = useMutation<Response, unknown, AddPostRequest>(
    (param) => addPost(param),
    {
      onMutate: async () => {
        showLoading()
      },
      onSuccess: async (data, v, _) => {
        console.log('addItem: ', v)
        queryClient.invalidateQueries(['userCredentialItems', v.userId])
        queryClient.invalidateQueries(['credItem', v.credentialItemId])
        if (data.status === 200) {
          closeLoading()
        } else {
          closeLoading()
        }
      },
      onError(error, v) {
        console.error('error', error)
        queryClient.invalidateQueries(['userCredentialItems', v.userId])
        queryClient.invalidateQueries(['credItem', v.credentialItemId])
        closeLoading()
      },
    },
  )

  const { mutateAsync: deleteItem } = useMutation<
    Response,
    unknown,
    { postId: string; userId: string; credentialItemId: string }
  >((param) => deletePost(param.postId, param.userId), {
    onMutate: async () => {
      showLoading()
    },
    onSuccess(data, v, _) {
      console.log('deleteItem: ', v)
      queryClient.invalidateQueries(['userCredentialItems', v.userId])
      queryClient.invalidateQueries(['credItem', v.credentialItemId])
      queryClient.invalidateQueries(['fetchPost', v.postId])
      if (data.status === 200) {
        closeLoading()
      } else {
        closeLoading()
      }
    },
    onError(error, v) {
      console.error('error', error)
      queryClient.invalidateQueries(['userCredentialItems', v.userId])
      queryClient.invalidateQueries(['credItem', v.credentialItemId])
      queryClient.invalidateQueries(['fetchPost', v.postId])
      closeLoading()
    },
  })

  return {
    post,
    isInitialLoading,
    addItem,
    deleteItem,
  }
}
