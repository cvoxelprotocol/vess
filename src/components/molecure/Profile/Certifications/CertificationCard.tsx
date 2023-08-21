import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import type { WithCeramicId, CertificationVerifiableCredential } from 'vess-sdk'
import { VerifiedMark } from '@/components/atom/Badges/VerifiedMark'
import { Flex } from '@/components/atom/Common/Flex'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { Text } from '@/components/atom/Texts/Text'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  item: WithCeramicId<CertificationVerifiableCredential>
}
export const CertificationCard: FC<Props> = ({ item }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const router = useRouter()

  const MembershipCardWrapper = styled.div`
    background: ${currentTheme.depth2};
    width: 100%;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 24px;
    position: relative;
    border-radius: 24px;
    @media (max-width: 599px) {
      flex-direction: column;
      align-items: center;
      padding: 24px 16px;
      gap: 8px;
      width: 292px;
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
  // const jumpToDetail = () => {
  //   router.push(`/cert/sbt/polygon/${item.contractAddress}/${item.nft.metadata.id}`)
  // }
  return (
    <MembershipCardWrapper>
      <Flex flexDirection='row' flexDirectionSP='column'>
        <VerifiedMark size='L' />
        <ImageContainer
          src={item.credentialSubject.image || 'https://workspace.vess.id/company.png'}
          width={'240px'}
        />
      </Flex>
      <InfoContainer>
        <Text
          type='p'
          color={currentTheme.primary}
          font={getBasicFont(currentTypo.headLine.medium)}
          fontSp={getBasicFont(currentTypo.title.large)}
          text={item.credentialSubject.certificationName || ''}
        />
      </InfoContainer>
    </MembershipCardWrapper>
  )

  return <></>
}
