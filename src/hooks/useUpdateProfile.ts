import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useVESSLoading } from './useVESSLoading'
import { useVESSUserProfile } from './useVESSUserProfile'
import { UpdateUserInfo } from '@/@types/user'
import { updateUserProfile } from '@/lib/vessApi'
import { formatDID } from '@/utils/did'

export const useUpdateProfile = (did?: string) => {
  const { showLoading, closeLoading } = useVESSLoading()
  const queryClient = useQueryClient()
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const { vsUser } = useVESSUserProfile(did)

  const { mutateAsync: update } = useMutation<Response, unknown, UpdateUserInfo>(
    (param) => updateProfile(param),
    {
      onMutate: async (variables) => {
        showLoading()
        setIsUpdatingProfile(true)
        // ootimistic mutation
        await queryClient.cancelQueries(['vsUser', did])
        await queryClient.cancelQueries(['avatars', did])
        const optimistic = {
          ...vsUser,
          avatar: variables.avatar || '',
          name: variables.name || (!!did ? formatDID(did, 12) : ''),
          description: variables.description || '',
          vessId: variables.vessId || '',
          socialLink: variables?.socialLink || [],
        }
        queryClient.setQueryData(['vsUser', did], () => optimistic)
        return { optimistic }
      },
      onSuccess(data, v, _) {
        console.log('update profile result: ', data)
        if (data.status === 200) {
          closeLoading()
          setIsUpdatingProfile(false)
        } else {
          closeLoading()
          setIsUpdatingProfile(false)
        }
        const optimistic = {
          ...vsUser,
          avatar: v.avatar || '',
          name: v.name || (!!did ? formatDID(did, 12) : ''),
          description: v.description || '',
          vessId: v.vessId || '',
          socialLink: v?.socialLink || [],
        }
        queryClient.setQueryData(['vsUser', did], () => optimistic)
        queryClient.invalidateQueries(['avatars', did])
        return { optimistic }
      },
      onError(error) {
        console.error('error', error)
        queryClient.invalidateQueries(['vsUser', did])
        closeLoading()
        setIsUpdatingProfile(false)
      },
    },
  )

  const updateProfile = async (params: UpdateUserInfo): Promise<Response> => {
    //update vess auth user
    // const orbisPromise = updateOrbisProfile({
    //   did: params.did,
    //   content: {
    //     username: params.name || '',
    //     pfp: params.avatar || '',
    //     description: params.description || '',
    //   },
    // })
    // const res = await Promise.all([vessAuthPromise, orbisPromise])
    const vessAuthPromise = updateUserProfile(params)
    const res = await Promise.all([vessAuthPromise])
    return res[0]
  }

  return {
    update,
    isUpdatingProfile,
  }
}
