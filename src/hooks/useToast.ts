import { BaseToastProps } from '@/components/ui-v1/Toasts/BaseToast'
import { useStateOpenToast, useStateVessToastProps } from '@/jotai/ui'

export const useToast = () => {
  const [_, setOpen] = useStateOpenToast()
  const [props, setProps] = useStateVessToastProps()

  const show = (text: string, actionTitle?: string, onClickAction?: () => void) => {
    const props: BaseToastProps = {
      text,
      actionTitle,
      onClickAction,
    }
    setProps(props)
    setOpen(true)
  }

  return {
    showToast: (text: string, actionTitle?: string, onClickAction?: () => void) =>
      show(text, actionTitle, onClickAction),
    props,
  }
}
