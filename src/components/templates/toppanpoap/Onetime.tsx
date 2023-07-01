import styled from '@emotion/styled'
import { cert } from 'firebase-admin/app'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { addCeramicPrefix } from 'vess-sdk'
import { VerifiedMark } from '@/components/atom/Badges/VerifiedMark'
import { FlatButton } from '@/components/atom/Buttons/FlatButton'
import { InformativeChip } from '@/components/atom/Chips/InformativeChip'
import { Flex } from '@/components/atom/Common/Flex'
import { NoItem } from '@/components/atom/Common/NoItem'
import { ICONS } from '@/components/atom/Icons/Icon'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { Text } from '@/components/atom/Texts/Text'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useEventAttendance } from '@/hooks/useEventAttendance'
import { useIssueSBT } from '@/hooks/useIssueSBT'
import { useOrganization } from '@/hooks/useOrganization'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { mintSBT } from '@/lib/kms'
import {
  IssueAndMintToEventAttendanceWithSBTRequest,
  OnetimeProps,
} from '@/pages/toppanpoap/[onetimeId]'
import { formatDate } from '@/utils/date'

export const OnetimeContainer: FC<OnetimeProps> = ({ onetimeToken }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { eventDetail, isLoadingEventDetail } = useEventAttendance(
    addCeramicPrefix(onetimeToken?.Event?.ceramicId || ''),
  )
  const { organization, isOrgLoading } = useOrganization(
    addCeramicPrefix(onetimeToken?.organization.ceramicId || ''),
  )
  const { setShowConnectModal } = useVESSWidgetModal()
  const { originalAddress } = useDIDAccount()
  const { mint, isLoading } = useIssueSBT()

  const router = useRouter()

  console.log({ onetimeToken })
  console.log({ eventDetail })

  const period = useMemo(() => {
    if (!eventDetail) return ''
    return `${eventDetail.startDate ? formatDate(eventDetail.startDate) : '?'} - ${
      eventDetail.endDate ? formatDate(eventDetail.endDate) : 'Present'
    }`
  }, [eventDetail])

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${currentTheme.background};
    padding: 8px;
    gap: 16px;
    @media (max-width: 599px) {
      padding: 16px;
    }
  `

  const InfoContainer = styled.div`
    flex-grow: 1;
    gap: 8px;
    padding-top: 8px;
    display: flex;
    flex-direction: column;
    @media (max-width: 599px) {
      width: 100%;
      padding-top: 0px;
      gap: 4px;
    }
  `

  const mintSBT = async () => {
    if (!eventDetail || !onetimeToken || !originalAddress) return
    try {
      const body: IssueAndMintToEventAttendanceWithSBTRequest = {
        content: eventDetail,
        orgId: onetimeToken.organizationId,
        data: [{ address: originalAddress }],
        onetimeId: onetimeToken.id,
      }
      console.log({ body })
      const res = await mint(body)
      console.log({ res })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Wrapper>
      <Flex width='100%' flexDirection='column'>
        <ImageContainer src={eventDetail?.icon || ''} width={'280px'} height={'280px'} />
        <Text
          type='p'
          color={currentTheme.primary}
          font={getBasicFont(currentTypo.headLine.medium)}
          fontSp={getBasicFont(currentTypo.headLine.small)}
          text={eventDetail?.name || ''}
        />
      </Flex>
      <Flex width='100%' flexDirectionSP='column'>
        <InfoContainer>
          {isOrgLoading ? (
            <CommonSpinner size='sm' />
          ) : (
            <Flex colGap='6px' rowGap='6px'>
              <ImageContainer
                src={organization?.icon || 'https://workspace.vess.id/company.png'}
                width={'26px'}
              />
              <Text
                type='p'
                color={currentTheme.onSurface}
                font={getBasicFont(currentTypo.title.large)}
                fontSp={getBasicFont(currentTypo.title.small)}
                text={organization?.name}
              />
            </Flex>
          )}
          {isLoadingEventDetail ? (
            <CommonSpinner size='sm' />
          ) : (
            <Text
              type='p'
              color={currentTheme.onSurfaceVariant}
              font={getBasicFont(currentTypo.label.large)}
              fontSp={getBasicFont(currentTypo.label.medium)}
              text={period}
            />
          )}
          <Flex colGap='6px' rowGap='6px'>
            {eventDetail?.tags &&
              eventDetail?.tags.map((attr) => {
                return <InformativeChip key={attr} text={attr} />
              })}
          </Flex>
          {/* <VerifiedMark
            withText={'Open Sea'}
            tailIcon={ICONS.EXTERNAL}
            handleClick={() => jumpToOpensea()}
          /> */}
          <Flex width='100%' justifyContent='center'>
            {!originalAddress ? (
              <FlatButton
                src='/nfc/wallet.png'
                label={'Connect Wallet'}
                width='100%'
                height='96px'
                background={currentTheme.primary}
                labelColor={currentTheme.onPrimary}
                onClick={() => setShowConnectModal(true)}
              />
            ) : (
              <FlatButton
                src='/nfc/wallet.png'
                label={'Mint'}
                width='100%'
                height='96px'
                background={currentTheme.secondary}
                labelColor={currentTheme.onSecondary}
                onClick={() => mintSBT()}
              />
            )}
          </Flex>
        </InfoContainer>
      </Flex>
    </Wrapper>
  )
}
