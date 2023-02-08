import { IconsType } from '@/components/atom/Icons/Icon'
import { BaseToastProps } from '@/components/atom/Toasts/BaseToast'
import { useStateOpenToast, useStateVessToastProps } from '@/jotai/ui'

export const useToast = () => {
  const [open, setOpen] = useStateOpenToast()
  const [props, setProps] = useStateVessToastProps()

  const show = (
    text: string,
    tailIcon?: IconsType,
    actionTitle?: string,
    onClickAction?: () => void,
  ) => {
    const props: BaseToastProps = {
      text,
      tailIcon,
      actionTitle,
      onClickAction,
    }
    setProps(props)
    setOpen(true)
  }

  return {
    showToast: (
      text: string,
      tailIcon?: IconsType,
      actionTitle?: string,
      onClickAction?: () => void,
    ) => show(text, tailIcon, actionTitle, onClickAction),
    isOpen: open,
    props,
  }
}
