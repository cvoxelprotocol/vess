import { FC } from 'react'
import { BaseToast } from './BaseToast'
import { useToast } from '@/hooks/useToast'

export const VESSToast: FC = () => {
  const { props } = useToast()

  if (!props) return <></>

  return <BaseToast {...props} />
}
