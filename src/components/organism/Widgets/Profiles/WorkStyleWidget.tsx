import { FC } from 'react'
import { Flex } from '@/components/atom/Common/Flex'
import { ICONS } from '@/components/atom/Icons/Icon'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { WorkStyleItem } from '@/components/molecure/Profile/WorkStyleItem'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'

type Props = {
  did: string
  gridRow: string
  gridCol: string
  editable?: boolean
  onClick?: () => void
}

export const WorkStyleWidget: FC<Props> = (props) => {
  const { businessProfile, isFetchingBusinessProfile } = useBusinessProfile(props.did)
  const { openModal } = useVESSWidgetModal()

  const handleEdit = () => {
    openModal()
  }

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props}>
        <Flex flexDirection={'column'}>
          <WorkStyleItem
            icon={ICONS.DOLLAR}
            content={`${businessProfile?.desiredHourlyFee || '-'}/hr`}
            borderRadius={'40px 0px 0px 0px'}
          />
          <WorkStyleItem
            icon={ICONS.LOCATION}
            content={`${businessProfile?.baseLocation || '-'}`}
          />
          <WorkStyleItem icon={ICONS.CHAT} content={businessProfile?.languages || '-'} />
          <WorkStyleItem icon={ICONS.CARD} content={businessProfile?.paymentMethods || '-'} />
          <WorkStyleItem
            icon={ICONS.PC}
            content={`${businessProfile?.desiredWorkStyle || '-'}`}
            borderRadius={'0 0 0px 40px'}
          />
        </Flex>
      </BaseWidget>
    </>
  )
}
