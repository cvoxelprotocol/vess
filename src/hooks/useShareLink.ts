import { url } from 'inspector'
import { useSnackbar } from 'kai-kit'
import type { SnackbarProps } from 'kai-kit'
import React, { useCallback } from 'react'

type UseShareLinkProps = {
  snackbarOptions?: Omit<SnackbarProps, 'text'>
}

export const useShareLink = (props: UseShareLinkProps | undefined) => {
  const { openSnackbar } = useSnackbar({
    id: 'shareProfileLink',
    text: 'プロフィールURLをコピーしました。',
    ...props,
  })

  const shareLink = useCallback((url: string) => {
    void (async () => {
      if (navigator.share) {
        await navigator.share({
          url,
        })
      } else {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url)
          openSnackbar()
        }
      }
    })()
  }, [])

  return { shareLink }
}
