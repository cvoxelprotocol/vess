import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { VerifiedMark } from '@/components/atom/Badges/VerifiedMark'
import { InformativeChip } from '@/components/atom/Chips/InformativeChip'
import { Flex } from '@/components/atom/Common/Flex'
import { NoItem } from '@/components/atom/Common/NoItem'
import { ICONS } from '@/components/atom/Icons/Icon'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { Text } from '@/components/atom/Texts/Text'
import { UserCard } from '@/components/molecure/User/UserCard'
import { useCertificationSubject } from '@/hooks/useCertificationSubject'
import { useOrganization } from '@/hooks/useOrganization'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { CertVCWithSBT } from '@/interfaces/sbt'
import { formatDate } from '@/utils/date'

type Props = {
  cert: CertVCWithSBT | null
}
export const CertContainer: FC<Props> = ({ cert }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { certification, isInitialLoading } = useCertificationSubject(cert?.ceramicId)
  const { organization, isOrgLoading } = useOrganization(
    certification?.certification.organizationId,
  )
  const router = useRouter()

  const period = useMemo(() => {
    if (!certification?.certification) return ''
    return `${
      certification.certification.startDate
        ? formatDate(certification.certification.startDate)
        : '?'
    } - ${
      certification.certification.endDate
        ? formatDate(certification.certification.endDate)
        : 'Present'
    }`
  }, [certification])

  const userId = useMemo(() => {
    if (!cert) return null
    return `did:pkh:eip155:1:${cert.nft.owner.toLowerCase()}`
  }, [cert])

  const attrs = useMemo(() => {
    if (!cert || !cert.nft.metadata.attributes) return []
    const attrs = cert.nft.metadata?.attributes as any[]
    return attrs
      ?.filter((attr) => {
        return attr.trait_type !== 'ceramicId' && attr.trait_type !== 'tokenId'
      })
      .map((attr: { value: string }) => {
        return attr.value as string
      })
  }, [cert])

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

  const jumpToOpensea = () => {
    if (!cert) return
    window.open(
      `${process.env.NEXT_PUBLIC_OPEASEA_ASSET}/${cert.contractAddress}/${cert.nft.metadata.id}`,
      '_blank',
    )
  }

  if (!cert) {
    return <NoItem text={'No Item Found'} />
  }

  return (
    <Wrapper>
      <Flex width='100%' justifyContent='left' colGap='8px' rowGap='8px'>
        <Text
          type='p'
          color={currentTheme.primary}
          font={getBasicFont(currentTypo.headLine.medium)}
          fontSp={getBasicFont(currentTypo.headLine.small)}
          text={(cert.nft.metadata.name as string) || ''}
        />
      </Flex>
      <Flex width='100%' flexDirectionSP='column'>
        <ImageContainer src={cert.nft.metadata.image || ''} width={'280px'} height={'280px'} />
        <InfoContainer>
          {isOrgLoading || isInitialLoading ? (
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
          {isInitialLoading ? (
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
            {attrs &&
              attrs.map((attr) => {
                return <InformativeChip key={attr} text={attr} />
              })}
          </Flex>
          <VerifiedMark
            withText={'Open Sea'}
            tailIcon={ICONS.EXTERNAL}
            handleClick={() => jumpToOpensea()}
          />
        </InfoContainer>
      </Flex>
      <Text
        type='h2'
        color={currentTheme.onBackground}
        font={getBasicFont(currentTypo.headLine.medium)}
        fontSp={getBasicFont(currentTypo.headLine.small)}
        text={'Holder'}
      />
      {userId && (
        <Flex width='100%' justifyContentSP='center' justifyContent='left'>
          <Flex width='216px'>
            <UserCard userId={userId} />
          </Flex>
        </Flex>
      )}
    </Wrapper>
  )
}
