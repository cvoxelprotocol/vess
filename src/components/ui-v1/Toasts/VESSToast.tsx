import { FC } from 'react'
import { BaseToast } from './BaseToast'
import { useToast } from '@/hooks/useToast'

const VESSToast: FC = () => {
  const { props } = useToast()

  if (!props) return <></>

  return <BaseToast {...props} />
}

export default VESSToast
