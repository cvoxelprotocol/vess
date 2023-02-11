import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { WorkStatusSlider } from '@/components/atom/Slider/WorkStatusSlider'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { isWorkStatus, WorkStatus } from '@/constants/businessProfile'
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
}

type StatusInput = {
  [key in WorkStatus]: {
    icon: string
    color: string
    num: number
  }
}

const input: StatusInput = {
  ask: { icon: '/profile/little_busy.png', color: '#BFB237', num: 1 },
  available: { icon: '/profile/available.png', color: '#4ABF37', num: 20 },
  'a little busy': { icon: '/profile/little_busy.png', color: '#BFB237', num: 60 },
  busy: { icon: '/profile/little_busy.png', color: '#BFB237', num: 100 },
}

export const WorkStatusWidget: FC<Props> = (props) => {
  const { businessProfile } = useBusinessProfile(props.did)
  const { currentTheme } = useVESSTheme()
  const { openModal } = useVESSWidgetModal()

  const statusKey = useMemo(() => {
    if (!businessProfile?.workStatus) return 'ask'
    return isWorkStatus(businessProfile?.workStatus) ? businessProfile?.workStatus : 'ask'
  }, [businessProfile?.workStatus])

  const statusValue = useMemo(() => {
    return input[statusKey]
  }, [statusKey])

  const handleEdit = () => {
    openModal()
  }
  const Container = styled.div`
    padding: 16px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `

  return (
    <BaseWidget onClickEdit={handleEdit} {...props}>
      <Container>
        <Flex height={'100%'} flexDirection={'column'} rowGap={'12px'} flexWrap={'noWrap'}>
          <WorkStatusSlider {...statusValue} />
          <Chip
            text={statusKey}
            variant={'filled'}
            solo
            mainColor={currentTheme.primary}
            textColor={currentTheme.onPrimary}
          />
        </Flex>
      </Container>
    </BaseWidget>
  )
}
