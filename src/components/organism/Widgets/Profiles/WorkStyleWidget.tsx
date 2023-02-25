import { FC } from 'react'
import { Flex } from '@/components/atom/Common/Flex'
import { ICONS } from '@/components/atom/Icons/Icon'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { WorkStyleItem } from '@/components/molecure/Profile/WorkStyleItem'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did: string
  gridRow: string
  gridCol: string
  gridRowOnSp: string
  gridColOnSp: string
  editable?: boolean
  onClick?: () => void
  EditButtonPosition?: string
}

export const WorkStyleWidget: FC<Props> = (props) => {
  const { businessProfile, isFetchingBusinessProfile } = useBusinessProfile(props.did)
  const { openModal } = useVESSWidgetModal()
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const handleEdit = () => {
    openModal()
  }

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props}>
        <Flex height={'100%'} width={'100%'} flexDirection={'column'} flexWrap={'nowrap'}>
          <WorkStyleItem
            icon={ICONS.DOLLAR}
            content={`${businessProfile?.desiredHourlyFee || 'Wage'}`}
            contentOpacity={`${businessProfile?.desiredHourlyFee ? '1' : '0.3'}`}
            borderRadius={'0px 0px 0px 0px'}
            iconBackground={currentTheme.surface5}
          />
          <WorkStyleItem
            icon={ICONS.LOCATION}
            content={`${businessProfile?.baseLocation || 'Location'}`}
            contentOpacity={`${businessProfile?.baseLocation ? '1' : '0.3'}`}
            iconBackground={currentTheme.surface3}
          />
          <WorkStyleItem
            icon={ICONS.CHAT}
            content={businessProfile?.languages || 'Langs'}
            contentOpacity={`${businessProfile?.languages ? '1' : '0.3'}`}
            iconBackground={currentTheme.surface5}
          />
          <WorkStyleItem
            icon={ICONS.CARD}
            content={businessProfile?.paymentMethods || 'Payment\nMethod'}
            contentOpacity={`${businessProfile?.paymentMethods ? '1' : '0.3'}`}
            iconBackground={currentTheme.surface3}
          />
          <WorkStyleItem
            icon={ICONS.PC}
            content={`${businessProfile?.desiredWorkStyle || 'Work\nStyle'}`}
            contentOpacity={`${businessProfile?.desiredWorkStyle ? '1' : '0.3'}`}
            borderRadius={'0 0 0px 0px'}
            isborder={false}
            iconBackground={currentTheme.surface5}
          />
        </Flex>
      </BaseWidget>
    </>
  )
}
