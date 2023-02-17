import styled from '@emotion/styled'
import { FC } from 'react'
import { IconButton } from '@/components/atom/Buttons/IconButton'
import { ICONS } from '@/components/atom/Icons/Icon'
import { ExperiencesContainer } from '@/components/organism/Experiences/ExperiencesContainer'
import { EventDetailModal } from '@/components/organism/Modal/Detail/Events/EventDetailModal'
import { BasicProfileWidgetEditModal } from '@/components/organism/Modal/Profile/BasicProfileWidgetEditModal'
import { HeldMembershipsModal } from '@/components/organism/Modal/Profile/HeldMembershipsModal'
import { SocialLinkWidgetEditModal } from '@/components/organism/Modal/Profile/SocialLinkWidgetEditModal'
import { SocialProfileEditModal } from '@/components/organism/Modal/Profile/SocialProfileEditModal'
import { ProfileQRModal } from '@/components/organism/Modal/QR/ProfileQRModal'
import { ProfleTabs } from '@/components/organism/Tabs/ProfleTabs'
import { BasicProfileWidget } from '@/components/organism/Widgets/Profiles/BasicProfileWidget'
import { EventAttendancesWidget } from '@/components/organism/Widgets/Profiles/EventAttendancesWidget'
import { HighlightedMembershipWidget } from '@/components/organism/Widgets/Profiles/HighlightedMembershipWidget'
import { SelfClaimedRoleWidget } from '@/components/organism/Widgets/Profiles/SelfClaimedRoleWidget'
import { SocialLinksWidget } from '@/components/organism/Widgets/Profiles/SocialLinksWidget'
import { WorkCredentialsWidget } from '@/components/organism/Widgets/Profiles/WorkCredentialsWidget'
import { WorkStatusWidget } from '@/components/organism/Widgets/Profiles/WorkStatusWidget'
import { WorkStyleWidget } from '@/components/organism/Widgets/Profiles/WorkStyleWidget'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useSelectedAttendance } from '@/jotai/item'

type Props = {
  did: string
}
export const ProfileContainer: FC<Props> = ({ did }) => {
  const { currentTheme } = useVESSTheme()
  const { businessProfile, isFetchingBusinessProfile, isMe } = useBusinessProfile(did)
  const { socialLinks, isFetchingSocialLinks } = useSocialLinks(did)
  const { setShowQRModal } = useVESSWidgetModal()
  const selectedAttendance = useSelectedAttendance()

  const Container = styled.div`
    width: 100%;
    height: max(100%, 100vh);
    background: ${currentTheme.background};
  `
  const Profile = styled.div`
    display: grid;
    grid-template-rows: repeat(8, 56px);
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 24px;
    margin-bottom: 48px;
    @media (max-width: 1079px) {
      grid-template-rows: repeat(8, 56px);
      grid-template-columns: repeat(12, 1fr);
      grid-gap: 24px;
    }
    @media (max-width: 599px) {
      grid-template-rows: repeat(auto-fill, 56px);
      grid-template-columns: repeat(6, 1fr);
      grid-gap: 12px;
    }
  `
  const ShareContainer = styled.div`
    position: fixed;
    bottom: 32px;
    right: 32px;
    @media (max-width: 599px) {
      bottom: 24px;
      right: 24px;
    }
  `
  if (!did) {
    return <></>
  }
  return (
    <Container>
      <Profile>
        <BasicProfileWidget
          did={did}
          gridRow={'1/5'}
          gridCol={'1/7'}
          gridRowOnSp={'1/6'}
          gridColOnSp={'1/7'}
          editable={isMe}
        />
        <SelfClaimedRoleWidget
          did={did}
          gridRow={'5/6'}
          gridCol={'1/7'}
          gridRowOnSp={'6/7'}
          gridColOnSp={'1/7'}
          editable={isMe}
        />
        <HighlightedMembershipWidget
          did={did}
          gridRow={'6/9'}
          gridCol={'1/5'}
          gridRowOnSp={'7/10'}
          gridColOnSp={'1/5'}
          editable={isMe}
        />
        <SocialLinksWidget
          did={did}
          gridRow={'6/9'}
          gridCol={'5/7'}
          gridRowOnSp={'7/10'}
          gridColOnSp={'5/7'}
          editable={isMe}
        />
        <WorkStyleWidget
          did={did}
          gridRow={'1/6'}
          gridCol={'7/9'}
          gridRowOnSp={'13/17'}
          gridColOnSp={'1/3'}
          editable={isMe}
        />
        <WorkStatusWidget
          did={did}
          gridRow={'6/9'}
          gridCol={'7/9'}
          gridRowOnSp={'10/13'}
          gridColOnSp={'1/3'}
          editable={isMe}
        />
        <EventAttendancesWidget
          did={did}
          gridRow={'1/5'}
          gridCol={'9/13'}
          gridRowOnSp={'10/13'}
          gridColOnSp={'3/7'}
          editable={false}
        />
        <WorkCredentialsWidget
          did={did}
          gridRow={'5/9'}
          gridCol={'9/13'}
          gridRowOnSp={'13/17'}
          gridColOnSp={'3/7'}
          editable={false}
        />
      </Profile>
      <ExperiencesContainer did={did} />
      <ProfleTabs did={did} />
      <ShareContainer>
        <IconButton
          icon={ICONS.QR}
          size={'XL'}
          mainColor={currentTheme.onPrimary}
          backgroundColor={currentTheme.primary}
          onClick={() => setShowQRModal(true)}
        />
      </ShareContainer>
      {!isFetchingBusinessProfile && isMe && (
        <BasicProfileWidgetEditModal did={did} businessProfile={businessProfile} />
      )}
      {!isFetchingSocialLinks && (
        <SocialLinkWidgetEditModal did={did} socialLinks={socialLinks} editable={isMe} />
      )}
      <HeldMembershipsModal did={did} editable={isMe} />
      <SocialProfileEditModal did={did} />
      <ProfileQRModal />
      <EventDetailModal streamId={selectedAttendance?.credentialSubject.eventId} />
    </Container>
  )
}
