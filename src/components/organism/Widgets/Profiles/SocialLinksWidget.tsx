import styled from '@emotion/styled'
import { FC, useEffect } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Flex } from '@/components/atom/Common/Flex'
import { ICONS } from '@/components/atom/Icons/Icon'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { WorkStyleItem } from '@/components/molecure/Profile/WorkStyleItem'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did: string
  gridRow: string
  gridCol: string
  onClick?: () => void
}

export const SocialLinksWidget: FC<Props> = (props) => {
  const { socialLinks, isFetchingSocialLinks } = useSocialLinks(props.did)
  const { openModal } = useVESSWidgetModal()

  const handleEdit = () => {
    openModal()
  }

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props} editable>
        <Flex flexDirection={'column'}>
          <Flex></Flex>
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
