import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Button } from '@/components/atom/Buttons/Button'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { SocialLinkItem } from '@/components/molecure/Profile/SocialLinkItem'
import { PROOF_OF_CONNECTION_FAILED, PROOF_OF_CONNECTION_ISSUED } from '@/constants/toastMessage'
import {
  ConnectionInput,
  useCreateConnectionMutation,
  useGetConnectionInvitaionLazyQuery,
} from '@/graphql/generated'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useEventAttendance } from '@/hooks/useEventAttendance'
import { useNfc } from '@/hooks/useNfc'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useSocialLinks } from '@/hooks/useSocialLinks'
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
    const did = 'did:pkh:eip155:1:0xde695cbb6ec0cf3f4c9564070baeb032552c5111'
    await register({ id: docId, did: did })
  }

  return (
    <Wrapper>
      <CardContainer>
        {isLoading ? (
          <CommonSpinner />
        ) : (
          <Flex flexDirection='column' colGap='24px' rowGap='24px'>
            <p>{data?.did || 'no did'}</p>
            {!data?.did && (
              <Button
                variant='filled'
                text='register'
                onClick={() => handleClick()}
                btnWidth={'240px'}
              />
            )}
          </Flex>
        )}
      </CardContainer>
    </Wrapper>
  )
}
