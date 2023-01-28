import { FC } from 'react'
import { BaseToast } from './BaseToast'
import { useToast } from '@/hooks/useToast'

export const VESSToast: FC = () => {
  const { props, isOpen } = useToast()

  if (!props) return <></>

  return <>{isOpen && <BaseToast {...props} />}</>
}
