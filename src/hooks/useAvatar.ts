import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useVESSLoading } from './useVESSLoading'
import { useVESSUserProfile } from './useVESSUserProfile'
import { AddAvatarRequest, Avatar, UpdateAvatarRequest } from '@/@types/user'
import { updateAvatar, addAvatar, deleteAvatar, getAvatarList, getAvatar } from '@/lib/vessApi'

export const useAvatar = (did?: string, canvasId?: string) => {
  const { showLoading, closeLoading } = useVESSLoading()
  const queryClient = useQueryClient()
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false)
  const { vsUser } = useVESSUserProfile(did)

  const { data: avatars, isInitialLoading } = useQuery<Avatar[]>(
    ['avatars', did],
    () => getAvatarList(did),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const { data: avatar, isInitialLoading: isLoadingAvatar } = useQuery<Avatar | null>(
    ['avatar', canvasId],
    () => getAvatar(canvasId),
    {
      enabled: !!canvasId && canvasId !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const { mutateAsync: add } = useMutation<Response, unknown, AddAvatarRequest>(
    (param) => addAvatar(param),
    {
      onMutate: async (variables) => {
        showLoading()
        setIsUpdatingAvatar(true)
        // ootimistic mutation
        await queryClient.cancelQueries(['vsUser', did])
        await queryClient.cancelQueries(['avatars', did])
        if (variables.isProfilePhoto) {
          const optimistic = {
            ...vsUser,
            avatar: variables.avatarUrl,
          }
          queryClient.setQueryData(['vsUser', did], () => optimistic)
          return { optimistic }
        }
      },
      onSuccess: async (data, v, _) => {
        console.log('addAvatar result: ', data)
        if (data.status === 200) {
          closeLoading()
          setIsUpdatingAvatar(false)
          if (v.isProfilePhoto) {
            const optimistic = {
              ...vsUser,
              avatar: v.avatarUrl,
            }
            queryClient.setQueryData(['vsUser', did], () => optimistic)
            queryClient.invalidateQueries(['avatars', did])
          }
          const resJson = await data.json()
          return resJson
        } else {
          closeLoading()
          setIsUpdatingAvatar(false)
        }
      },
      onError(error) {
        console.error('error', error)
        queryClient.invalidateQueries(['avatars', did])
        closeLoading()
        setIsUpdatingAvatar(false)
      },
    },
  )

  const { mutateAsync: update } = useMutation<Response, unknown, UpdateAvatarRequest>(
    (param) => updateAvatar(param),
    {
      onMutate: async (variables) => {
        showLoading()
        setIsUpdatingAvatar(true)
        // ootimistic mutation
        await queryClient.cancelQueries(['vsUser', did])
        await queryClient.cancelQueries(['avatars', did])
        if (variables.isProfilePhoto) {
          const optimistic = {
            ...vsUser,
            avatar: variables.avatarUrl,
          }
          queryClient.setQueryData(['vsUser', did], () => optimistic)
          return { optimistic }
        }
      },
      onSuccess(data, v, _) {
        console.log('update profile result: ', data)
        if (data.status === 200) {
          closeLoading()
          setIsUpdatingAvatar(false)
        } else {
          closeLoading()
          setIsUpdatingAvatar(false)
        }
        if (v.isProfilePhoto) {
          const optimistic = {
            ...vsUser,
            avatar: v.avatarUrl,
          }
          queryClient.setQueryData(['vsUser', did], () => optimistic)
          queryClient.invalidateQueries(['avatars', did])
          return { optimistic }
        }
      },
      onError(error) {
        console.error('error', error)
        queryClient.invalidateQueries(['avatars', did])
        closeLoading()
        setIsUpdatingAvatar(false)
      },
    },
  )

  const { mutateAsync: deleteCanvas } = useMutation<Response, unknown, string>(
    (param) => deleteAvatar(param),
    {
      onSuccess(data, v, _) {
        if (data.status === 200) {
          closeLoading()
          setIsUpdatingAvatar(false)
        } else {
          closeLoading()
          setIsUpdatingAvatar(false)
        }
        queryClient.invalidateQueries(['avatars', did])
      },
      onError(error) {
        console.error('error', error)
        queryClient.invalidateQueries(['avatars', did])
        closeLoading()
        setIsUpdatingAvatar(false)
      },
    },
  )

  const profileAvatar = useMemo(() => {
    return avatars?.find((avatar) => avatar.isProfilePhoto)
  }, [avatars])

  return {
    add,
    update,
    deleteCanvas,
    isUpdatingAvatar,
    avatars,
    isInitialLoading,
    avatar,
    isLoadingAvatar,
    profileAvatar,
  }
}
