import { useSnackbar } from 'kai-kit'
import type { SnackbarProps } from 'kai-kit'
import { useCallback } from 'react'

type UseShareLinkProps = {
  snackbarOptions?: Omit<SnackbarProps, 'text'>
}

export const useShareLink = (props: UseShareLinkProps | undefined) => {
  const { openSnackbar } = useSnackbar({
    id: 'shareProfileLink',
    text: 'プロフィールURLをコピーしました。',
    ...props,
  })

  const shareLink = useCallback((url: string, text?: string) => {
    ;(async () => {
      try {
        if (navigator.share) {
          const data = {
            text,
            url,
          }
          await navigator.share(data)
        } else {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(url)
            openSnackbar()
          }
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return { shareLink }
}
