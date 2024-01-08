import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import { addCeramicPrefix } from 'vess-sdk'
import { useAccount } from 'wagmi'
import { Button } from '@/components/atom/Buttons/Button'
import { Flex } from '@/components/atom/Common/Flex'
import { ICONS, Icon } from '@/components/atom/Icons/Icon'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { Text } from '@/components/atom/Texts/Text'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useEventAttendance } from '@/hooks/useEventAttendance'
import { useOrganization } from '@/hooks/useOrganization'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { IssueCredProps } from '@/pages/cert/get/[id]'
import { formatDate } from '@/utils/date'

export const IssueCertContainer: FC<IssueCredProps> = ({ id, event }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { did } = useDIDAccount()
  const { setShowConnectModal } = useVESSWidgetModal()
  const { issueAttendance } = useEventAttendance()

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const router = useRouter()

  const period = useMemo(() => {
    if (!event) return ''
    return `${event?.startDate ? formatDate(event.startDate) : '?'} - ${
      event?.endDate ? formatDate(event.endDate) : '現在'
    }`
  }, [event])

  const handleLogin = async () => {
    try {
      setShowConnectModal(true)
    } catch (error) {
      console.error(error)
    }
  }

  const issue = async () => {
    if (!event) return
    await issueAttendance(event)
  }

  const LayoutContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: transparent;
    overflow: scroll;
  `

  const ContentContainer = styled.main`
    width: 100%;
    height: fit-content;
    max-width: '800px';

    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    row-gap: 16px;
    padding: 32px 32px 32px 32px;

    @media (max-width: 599px) {
      row-gap: 16px;
      padding: 20px 20px 20px 20px;
    }
  `

  const CardContainer = styled.div`
    width: 100%;
    height: 480px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 40px 32px;
    background: ${currentTheme.surface};
    border-radius: 24px;
  `

  const ExplorerFrame = styled.div`
    position: absolute;
    top: 16px;
    right: 16px;
    gap: 8px;
    display: flex;
    flex-direction: column;
  `

  const StampImageWrapper = styled.div`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 4px solid ${currentTheme.background};
  `

  return (
    <LayoutContainer>
      <ContentContainer>
        <CardContainer>
          <>
            <Flex colGap='16px' rowGap='16px' alignItems='center' flexDirection='column'>
              <StampImageWrapper>
                <ImageContainer
                  src={event?.icon || ''}
                  alt={event?.name}
                  width={'100%'}
                  height='100%'
                  objectFit='cover'
                />
              </StampImageWrapper>
              <Flex colGap='4px' rowGap='4px' alignItems='center' flexDirection='column'>
                <Text
                  type='p'
                  text={event?.name}
                  color={currentTheme.onPrimaryContainer}
                  font={getBasicFont(currentTypo.headLine.medium)}
                />
              </Flex>
              <Flex colGap='4px' rowGap='4px'>
                <Icon icon={ICONS.CALENDAR} size={'MM'} mainColor={currentTheme.onSurfaceVariant} />
                <Text
                  type='p'
                  text={period}
                  color={currentTheme.onSurfaceVariant}
                  font={getBasicFont(currentTypo.title.medium)}
                />
              </Flex>
            </Flex>
            {!!did ? (
              <Button text={'スタンプを受け取る'} onClick={() => issue()} />
            ) : (
              <Button text={'ウォレットを接続する'} onClick={() => handleLogin()} />
            )}
          </>
        </CardContainer>
      </ContentContainer>
    </LayoutContainer>
  )
}
