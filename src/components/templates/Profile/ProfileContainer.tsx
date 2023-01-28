import styled from '@emotion/styled'
import { FC } from 'react'
import { BasicProfileWidgetEditModal } from '@/components/organism/Modal/Profile/BasicProfileWidgetEditModal'
import { BasicProfileWidget } from '@/components/organism/Widgets/Profiles/BasicProfileWidget'
import { SelfClaimedRoleWidget } from '@/components/organism/Widgets/Profiles/SelfClaimedRoleWidget'
import { WorkStatusWidget } from '@/components/organism/Widgets/Profiles/WorkStatusWidget'
import { WorkStyleWidget } from '@/components/organism/Widgets/Profiles/WorkStyleWidget'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did: string
}
export const ProfileContainer: FC<Props> = ({ did }) => {
  const { currentTheme, initTheme } = useVESSTheme()
  const { businessProfile, isFetchingBusinessProfile } = useBusinessProfile(did)
  const Container = styled.div`
    width: 100%;
    height: max(100%, 100vh);
    background: ${currentTheme.background};
    padding: 24px;
  `
  const Profile = styled.div`
    display: grid;
    grid-template-rows: repeat(12, 56px);
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 24px;
  `

  if (!did) {
    return <></>
  }
  return (
    <Container>
      <Profile>
        <BasicProfileWidget did={did} gridRow={'1/5'} gridCol={'1/7'} />
        <SelfClaimedRoleWidget did={did} gridRow={'5/6'} gridCol={'1/7'} />
        <WorkStyleWidget did={did} gridRow={'1/6'} gridCol={'7/9'} />
        <WorkStatusWidget did={did} gridRow={'6/9'} gridCol={'7/9'} />
      </Profile>
      {!isFetchingBusinessProfile && (
        <BasicProfileWidgetEditModal did={did} businessProfile={businessProfile} />
      )}
    </Container>
  )
}
