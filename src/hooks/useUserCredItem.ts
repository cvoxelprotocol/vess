import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useVESSLoading } from './useVESSLoading'
import {
  ICreateHolderContentsRequest,
  IIssueCredentialItemByUserRequest,
  VSCredentialItemFromBuckup,
} from '@/@types/credential'
import {
  addHolderContent,
  createCredentialItem,
  deleteCredentialItem,
  deleteHolderContent,
  getUserCredentialItem,
} from '@/lib/vessApi'

export const useUserCredItem = (userId?: string) => {
  const { showLoading, closeLoading } = useVESSLoading()
  const queryClient = useQueryClient()

  const { data: userCredentialItems, isInitialLoading } = useQuery<
    VSCredentialItemFromBuckup[] | null
  >(['userCredentialItems', userId], () => fetchCredItem(userId), {
    enabled: !!userId && userId !== '',
    staleTime: Infinity,
    cacheTime: 300000,
  })

  const fetchCredItem = async (userId?: string) => {
    if (!userId) {
      return null
    }
    try {
      return await getUserCredentialItem(userId)
    } catch (error) {
      throw error
    }
  }

  const { mutateAsync: create, isLoading: isCreating } = useMutation<
    Response,
    unknown,
    IIssueCredentialItemByUserRequest
  >((param) => createCredentialItem(param), {
    onMutate: async () => {
      showLoading()
    },
    onSuccess(data, v, _) {
      queryClient.invalidateQueries(['userCredentialItems', userId])
      if (data.status === 200) {
        closeLoading()
      } else {
        closeLoading()
      }
    },
    onError(error) {
      console.error('error', error)
      queryClient.invalidateQueries(['userCredentialItems', userId])
      closeLoading()
    },
  })

  const { mutateAsync: deleteitem } = useMutation<Response, unknown, string>(
    (itemId) => deleteCredentialItem(itemId),
    {
      onMutate: async () => {
        showLoading()
      },
      onSuccess(data, v, _) {
        console.log('deleteCredentialItem: ', v)
        queryClient.invalidateQueries(['userCredentialItems', userId])
        if (data.status === 200) {
          closeLoading()
        } else {
          closeLoading()
        }
      },
      onError(error) {
        console.error('error', error)
        queryClient.invalidateQueries(['userCredentialItems', userId])
        closeLoading()
      },
    },
  )

  const { mutateAsync: addContent } = useMutation<Response, unknown, ICreateHolderContentsRequest>(
    (param) => addHolderContent(param),
    {
      onMutate: async () => {
        showLoading()
      },
      onSuccess(data, v, _) {
        console.log('addHolderContent: ', v)
        queryClient.invalidateQueries(['userCredentialItems', userId])
        if (data.status === 200) {
          closeLoading()
        } else {
          closeLoading()
        }
      },
      onError(error) {
        console.error('error', error)
        queryClient.invalidateQueries(['userCredentialItems', userId])
        closeLoading()
      },
    },
  )

  const { mutateAsync: deleteContent } = useMutation<Response, unknown, string>(
    (itemId) => deleteHolderContent(itemId),
    {
      onMutate: async () => {
        showLoading()
      },
      onSuccess(data, v, _) {
        console.log('deleteCredentialItem: ', v)
        queryClient.invalidateQueries(['userCredentialItems', userId])
        if (data.status === 200) {
          closeLoading()
        } else {
          closeLoading()
        }
      },
      onError(error) {
        console.error('error', error)
        queryClient.invalidateQueries(['userCredentialItems', userId])
        closeLoading()
      },
    },
  )

  return {
    userCredentialItems,
    isInitialLoading,
    create,
    isCreating,
    deleteitem,
    addContent,
    deleteContent,
  }
}
