import styled from '@emotion/styled'
import { FC } from 'react'
import { BaseCredential, WithCeramicId } from '@/@types/credential'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { NoItem } from '@/components/atom/Common/NoItem'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { useHeldEventAttendances } from '@/hooks/useHeldEventAttendances'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useSetSelectAttendance } from '@/jotai/item'

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
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { displayHeldEventAttendances, isFetchingHeldEventAttendances } = useHeldEventAttendances(
    props.did,
  )
  const selectAttendance = useSetSelectAttendance()
  const { openModal, setShowDetailModal } = useVESSWidgetModal()

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
    overflow-y: hidden;
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
  const FooterTitle = styled.a`
    color: ${currentTheme.primary};
    ${getBasicFont(currentTypo.title.small)};
    text-decoration: none;
  `
  const IconContainer = styled.div`
    grid-template-columns: repeat(auto-fill, 1fr);
    grid-template-rows: repeat(auto-fill, 1fr);
  `
  const NoItemContainer = styled.div`
    grid-column: 1/4;
    grid-row: 1/4;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 240px;
  `

  const handleEdit = () => {
    openModal()
  }

  const showDetail = (item: WithCeramicId<BaseCredential>) => {
    selectAttendance(item)
    setShowDetailModal(true)
  }

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props} border={`1px solid ${currentTheme.outline}`}>
        <Container>
          {isFetchingHeldEventAttendances ? (
            <CommonSpinner />
          ) : (
            <>
              {!displayHeldEventAttendances || displayHeldEventAttendances.length === 0 ? (
                <NoItemContainer>
                  <NoItem text='No Item yet' />
                </NoItemContainer>
              ) : (
                <>
                  {displayHeldEventAttendances.map((item) => {
                    return (
                      <IconContainer key={item.ceramicId} onClick={() => showDetail(item)}>
                        <Avatar url={item.credentialSubject.eventIcon} size={'XXL'} />
                      </IconContainer>
                    )
                  })}
                </>
              )}
            </>
          )}
        </Container>
        <FooterContainer>
          <FooterTitle href={'#Attendances'}>Event Attendances</FooterTitle>
        </FooterContainer>
      </BaseWidget>
    </>
  )
}
