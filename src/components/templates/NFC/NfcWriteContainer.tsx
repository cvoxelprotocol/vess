import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
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
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import { useToast } from '@/hooks/useToast'
import { useVESSLoading } from '@/hooks/useVESSLoading'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const NfcWriteContainer: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const [nfcAvailable, setNfcAvailable] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [nfcContent, setNfcContent] = useState<string>('')

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

  useEffect(() => {
    // Check if the browser supports the Web NFC API
    if ('NDEFReader' in window) {
      setNfcAvailable(true)
      const nfc = new NDEFReader()
      nfc
        .scan()
        .then(() => {
          nfc.onreadingerror = (error) => {
            setMessage(`Error: ${error}`)
          }
          nfc.onreading = (event) => {
            setNfcContent(JSON.stringify(event))
          }
        })
        .catch((error) => {
          setMessage(`Error! Scan failed to start: ${error}.`)
        })
    } else {
      console.log('Web NFC API not available')
      setMessage('Web NFC API not available')
    }
  }, [])

  const handleWriteNfc = async () => {
    if (!nfcAvailable) {
      console.log('Web NFC API not available')
      return
    }

    try {
      const url = 'https://www.google.com'

      // Connect to the first available NFC tag
      const nfc = new NDEFReader()
      await nfc.scan()
      const tag = await nfc.write({
        records: [{ recordType: 'url', data: url }],
      })

      console.log('Message written to tag:', tag)

      setMessage('Message written successfully')
    } catch (error) {
      console.error(error)
      setMessage('Error writing message to tag')
    }
  }

  return (
    <Wrapper>
      <CardContainer>
        <button onClick={handleWriteNfc}>Write NFC</button>
        <p>{message}</p>
      </CardContainer>
    </Wrapper>
  )
}
