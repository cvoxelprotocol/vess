import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { VSUser } from '@/@types/credential'
import { CreateUserInfo, CreateUserWithGoogleInfo } from '@/@types/user'
import {
  createUserOnlyWithDid,
  createUserWithEmail,
  createUserWithGoogle,
  getVESSUserByDid,
} from '@/lib/vessApi'
import { isGoodResponse } from '@/utils/http'

export const useVESSUser = (did?: string) => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { showLoading, closeLoading } = useVESSLoading()

  const { data: VsUser, isInitialLoading } = useQuery<VSUser | null>(
    ['VsUser', did],
    () => getVESSUserByDid(did),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const addUserWithEmail = async (
    item: CreateUserInfo,
    displayToast: boolean = false,
  ): Promise<boolean> => {
    showLoading()
    try {
      const res = await createUserWithEmail(item)
      if (isGoodResponse(res.status)) {
        if (displayToast) {
          showToast('User creation succeeded')
        }
        queryClient.invalidateQueries(['VsUser'])
        return true
      }
      if (displayToast) {
        showToast('User creation failed')
      }
      return false
    } catch (error) {
      console.error('error', error)
      closeLoading()
      throw error
    }
  }

  const addUserWithGoogle = async (
    item: CreateUserWithGoogleInfo,
    displayToast: boolean = false,
  ): Promise<boolean> => {
    showLoading()
    try {
      const res = await createUserWithGoogle(item)
      if (isGoodResponse(res.status)) {
        if (displayToast) {
          showToast('User creation succeeded')
        }
        queryClient.invalidateQueries(['VsUser'])
        return true
      }
      if (displayToast) {
        showToast('User creation failed')
      }
      return false
    } catch (error) {
      console.error('error', error)
      closeLoading()
      throw error
    }
  }

  const addUserOnlyWithDid = async (
    item: CreateUserInfo,
    displayToast: boolean = false,
  ): Promise<boolean> => {
    showLoading()
    try {
      const res = await createUserOnlyWithDid(item)
      if (isGoodResponse(res.status)) {
        if (displayToast) {
          showToast('User creation succeeded')
        }
        queryClient.invalidateQueries(['VsUser'])
        return true
      }
      if (displayToast) {
        showToast('User creation failed')
      }
      return false
    } catch (error) {
      console.error('error', error)
      closeLoading()
      throw error
    }
  }
  return {
    addUserWithEmail,
    addUserWithGoogle,
    addUserOnlyWithDid,
    VsUser,
    isInitialLoading,
  }
}
