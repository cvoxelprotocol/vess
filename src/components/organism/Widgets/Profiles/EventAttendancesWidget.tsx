import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { isMobileOnly } from 'react-device-detect'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { AvatarPlaceholder } from '@/components/atom/Avatars/AvatarPlaceholder'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { useHeldEventAttendances } from '@/hooks/useHeldEventAttendances'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { shortenStr } from '@/utils/objectUtil'

type Props = {
  did: string
  gridRow: string
  gridCol: string
  gridRowOnSp: string
  gridColOnSp: string
  editable?: boolean
  onClick?: () => void
}

export const EventAttendancesWidget: FC<Props> = (props) => {
  const { currentTheme, currentTypo, getFont } = useVESSTheme()
  const { HeldEventAttendances } = useHeldEventAttendances(props.did)
  const { openModal } = useVESSWidgetModal()
  const router = useRouter()

  const Container = styled.div`
    padding: 16px 24px 32px;
    display: grid;
    position: relative;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 24px;
    border-radius: 40px;
    @media (max-width: 1079px) {
      grid-gap: 24px;
    }
    @media (max-width: 599px) {
      grid-gap: 12px;
      padding: 8px 12px 32px;
      margin: 8px 0;
    }
    @media (max-width: 352px) {
      grid-gap: 12px;
      padding: 8px 12px 32px;
    }
    max-height: 240px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  `
  const FooterContainer = styled.div`
    height: 30px;
    background: ${currentTheme.surface1};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 0 40px 40px;
    margin: 4px;
  `
  const FooterTitle = styled.div`
    color: ${currentTheme.primary};
    font: ${getFont(currentTypo.title.small)};
  `
  const IconContainer = styled.div`
    grid-template-columns: repeat(auto-fill, 1fr);
    grid-template-rows: repeat(auto-fill, 1fr);
  `

  const handleEdit = () => {
    openModal()
  }

  const handleClickConWidget = () => {
    // TODO: open detail modal
    if (isMobileOnly) {
      router.push('#Attendances')
    }
  }

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props} border={`1px solid ${currentTheme.outline}`}>
        <Container onClick={handleClickConWidget}>
          {HeldEventAttendances &&
            HeldEventAttendances.map((item) => {
              return (
                <IconContainer key={item.ceramicId}>
                  <Avatar url={item.credentialSubject.eventIcon} size={'XXL'} />
                </IconContainer>
              )
            })}
        </Container>
        <FooterContainer>
          <FooterTitle>Event Attendances</FooterTitle>
        </FooterContainer>
      </BaseWidget>
    </>
  )
}
