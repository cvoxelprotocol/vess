import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Button } from '@/components/atom/Buttons/Button'
import { Flex } from '@/components/atom/Common/Flex'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { InvitaionContentForNFC } from '@/components/organism/Connection/InvitaionContentForNFC'
import { InvitaionManagementForNFC } from '@/components/organism/Connection/InvitaionManagementForNFC'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useNfc } from '@/hooks/useNfc'
import { useVESSLoading } from '@/hooks/useVESSLoading'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const NfcWriteContainer: FC = () => {
  const router = useRouter()
  const docId = (router.query.id as string) || ''
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { setShowConnectModal } = useVESSWidgetModal()
  const { did } = useDIDAccount()
  const { showLoading, closeLoading } = useVESSLoading()
  const { data, isLoading, register } = useNfc(docId)

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    background: ${currentTheme.surface3};
    padding: 32px 0;
  `

  const CardContainer = styled.div`
    max-width: 352px;
    width: 100%;
    min-height: 100vh;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: ${currentTheme.onSurface};
  `
  const Title = styled.p`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.headLine.large)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.headLine.large)};
    }
  `
  const PfpContainer = styled(Link)`
    width: fit-content;
    outline: none;
    text-decoration: none;
  `

  const At = styled.p`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.title.medium)};
  `
  const EventName = styled.p`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.headLine.small)};
  `

  const Greeting = styled.div`
    background: ${currentTheme.background};
    border-radius: 16px;
    padding: 12px 16px;
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.body.medium)};
  `

  const handleClick = async () => {
    if (!docId) return
    if (!did) {
      setShowConnectModal(true)
      return
    }
    if (did) {
      await register({ id: docId, did: did })
    }
  }

  if (isLoading) {
    return (
      <Wrapper>
        <CardContainer>
          <CommonSpinner />
        </CardContainer>
      </Wrapper>
    )
  }

  if (!data?.did) {
    return (
      <Wrapper>
        <CardContainer>
          <Flex flexDirection='column' colGap='24px' rowGap='24px'>
            <Button
              variant='filled'
              text={did ? 'Setup' : 'Connect Wallet'}
              onClick={() => handleClick()}
              btnWidth={'240px'}
            />
          </Flex>
        </CardContainer>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <CardContainer>
        {isLoading ? (
          <CommonSpinner />
        ) : (
          <Flex flexDirection='column' colGap='24px' rowGap='24px'>
            {data.did === did ? (
              <InvitaionManagementForNFC />
            ) : (
              <InvitaionContentForNFC did={data.did} />
            )}
          </Flex>
        )}
      </CardContainer>
    </Wrapper>
  )
}
