import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { formatDID } from 'vess-kit-web'
import { useVESSLoading } from './useVESSLoading'
import { OrbisBaseResponse, UpdateOrbisProfileParam } from '@/lib/OrbisHelper'
import { updateOrbisProfile } from '@/lib/OrbisUpdateHelper'

export const useUpdateSocialAccount = (did?: string) => {
  const { showLoading, closeLoading } = useVESSLoading()
  const queryClient = useQueryClient()
  const [isUpdatingSocialAccount, setIsUpdatingSocialAccount] = useState(false)

  const { mutateAsync: update } = useMutation<OrbisBaseResponse, unknown, UpdateOrbisProfileParam>(
    (param) => updateOrbisProfile(param),
    {
      onMutate: async (variables) => {
        showLoading()
        setIsUpdatingSocialAccount(true)
        // ootimistic mutation
        await queryClient.cancelQueries(['onChainProfile', did])
        const optimistic = {
          avatarSrc: variables.content?.pfp,
          displayName: variables.content.username || (!!did ? formatDID(did, 12) : ''),
          bio: variables.content.description || '',
        }
        queryClient.setQueryData(['onChainProfile', did], () => optimistic)
        return { optimistic }
      },
      onSuccess(data, v, _) {
        if (data.status === 200) {
          closeLoading()
          setIsUpdatingSocialAccount(false)
        } else {
          closeLoading()
          setIsUpdatingSocialAccount(false)
          console.error(data.result)
        }
        const optimistic = {
          avatarSrc: v.content?.pfp,
          displayName: v.content.username || (!!did ? formatDID(did, 12) : ''),
          bio: v.content.description || '',
        }
        queryClient.setQueryData(['onChainProfile', did], () => optimistic)
      },
      onError(error) {
        console.error('error', error)
        queryClient.invalidateQueries(['onChainProfile', did])
        closeLoading()
        setIsUpdatingSocialAccount(false)
      },
    },
  )

  return {
    update,
    isUpdatingSocialAccount,
  }
}
