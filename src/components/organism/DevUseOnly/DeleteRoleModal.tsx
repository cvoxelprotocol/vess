import { FC } from 'react'
import { VESSModal, VESSModalContainer } from '..//Modal/VESSModal'
import { DeleteRoleForm } from './DeleteRoleForm'
import { useStateDevModal } from '@/jotai/ui'

type Props = {
  did: string
}

export const DeleteRoleModal: FC<Props> = ({ did }) => {
  const [show, setshow] = useStateDevModal()

  return (
    <VESSModalContainer open={show} onOpenChange={setshow}>
      <VESSModal>
        <DeleteRoleForm did={did} />
      </VESSModal>
    </VESSModalContainer>
  )
}
