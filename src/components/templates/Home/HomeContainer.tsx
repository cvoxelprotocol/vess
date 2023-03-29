import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { PanelButton } from '@/components/atom/Buttons/PanelButton'
import { UserCard } from '@/components/molecure/User/UserCard'
import { BasicCarousel } from '@/components/organism/Carousel/BasicCarousel'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

const FEATURED_USER_LIST = [
  'did:pkh:eip155:1:0xde695cbb6ec0cf3f4c9564070baeb032552c5111',
  'did:pkh:eip155:1:0xb69cb3efbadb1b30f6d88020e1fa1fc84b8804d4',
  'did:pkh:eip155:1:0xe43577d0fa22a0c156414677bee9baf99a33cfa9',
  'did:pkh:eip155:1:0xad44f4c7703ab3fac0c46624fb52e6e668e4cd24',
  'did:pkh:eip155:1:0x9df610ec3e37e8da858b3d53d6c68178140cf24f',
]
export const HomeContainer: FC = () => {
  const { did } = useDIDAccount()
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const router = useRouter()
  const { setShowConnectModal } = useVESSWidgetModal()

  const Wrapper = styled.main`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${currentTheme.background};
    padding: 8px;
    gap: 16px;
  `

  const OnBoardList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 24px;

    @media (max-width: 599px) {
      gap: 8px;
    }
  `

  const SectionHeader = styled.div`
    padding: 32px 0px 8px 8px;
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.headLine.medium)};
  `

  const Container = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(216px, 1fr));
    grid-gap: 24px;
    text-align: center;
    @media (max-width: 599px) {
      grid-template-columns: repeat(1, 1fr);
      grid-gap: 8px;
    }
  `

  const BottomBlank = styled.div`
    width: 100%;
    height: 300px;
  `

  const jumpToURL = (url: string) => {
    window.open(url, '_blank')
  }
  const jumpToProfile = () => {
    if (!did) {
      setShowConnectModal(true)
      return
    }
    router.push(`/did/${did}`)
  }

  return (
    <Wrapper>
      <BasicCarousel />
      <OnBoardList>
        <PanelButton
          src='/icons/resume.png'
          label='Edit Your Resume'
          width='1fr'
          labelColor={currentTheme.primary}
          onClick={() => jumpToProfile()}
        />
        <PanelButton
          src='/icons/jobposts.png'
          label='Apply for Jobs'
          width='1fr'
          labelColor={currentTheme.primary}
          onClick={() => jumpToURL('https://synapss.vess.id')}
        />
        <PanelButton
          src='/icons/organization.png'
          label='Create Organization'
          width='1fr'
          labelColor={currentTheme.primary}
          onClick={() => jumpToURL('https://lp.vess.id/en/synapss/org/apply')}
        />
        <PanelButton
          src='/icons/macintosh.png'
          label='Buidl with VESS'
          width='1fr'
          labelColor={currentTheme.primary}
          onClick={() => jumpToURL('https://doc.vess.id/vess-sdk/overview')}
        />
      </OnBoardList>
      <SectionHeader>Featured Talents</SectionHeader>
      <Container>
        {FEATURED_USER_LIST.map((userId) => {
          return <UserCard key={userId} userId={userId} />
        })}
      </Container>
      <BottomBlank></BottomBlank>
    </Wrapper>
  )
}
