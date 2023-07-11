import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { Button } from '@/components/atom/Buttons/Button'
import { IconButton } from '@/components/atom/Buttons/IconButton'
import { Flex } from '@/components/atom/Common/Flex'
import { ICONS } from '@/components/atom/Icons/Icon'
import { ExperiencesContainer } from '@/components/organism/Experiences/ExperiencesContainer'
import { EventDetailModal } from '@/components/organism/Modal/Detail/Events/EventDetailModal'
import { TaskDetailModal } from '@/components/organism/Modal/Detail/Tasks/TaskDetailModal'
import { BasicProfileWidget } from '@/components/organism/Widgets/Profiles/BasicProfileWidget'
import { EventAttendancesWidget } from '@/components/organism/Widgets/Profiles/EventAttendancesWidget'
import { HighlightedMembershipWidget } from '@/components/organism/Widgets/Profiles/HighlightedMembershipWidget'
import { SelfClaimedRoleWidget } from '@/components/organism/Widgets/Profiles/SelfClaimedRoleWidget'
import { SocialLinksWidget } from '@/components/organism/Widgets/Profiles/SocialLinksWidget'
import { WorkCredentialsWidget } from '@/components/organism/Widgets/Profiles/WorkCredentialsWidget'
import { WorkStatusWidget } from '@/components/organism/Widgets/Profiles/WorkStatusWidget'
import { WorkStyleWidget } from '@/components/organism/Widgets/Profiles/WorkStyleWidget'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useSocialLinks } from '@/hooks/useSocialLinks'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useSelectedAttendance, useSelectedTask } from '@/jotai/item'
import { useStateFocusEditable } from '@/jotai/ui'

type Props = {
  did: string
}
const ProfleTabs = dynamic(() => import('@/components/organism/Tabs/ProfleTabs'), {
  ssr: false,
})

const CertificationsContainer = dynamic(
  () => import('@/components/organism/Certification/CertificationsContainer'),
  {
    ssr: false,
  },
)

const BasicProfileWidgetEditModal = dynamic(
  () => import('@/components/organism/Modal/Profile/BasicProfileWidgetEditModal'),
  {
    ssr: false,
  },
)

const SocialLinkWidgetEditModal = dynamic(
  () => import('@/components/organism/Modal/Profile/SocialLinkWidgetEditModal'),
  {
    ssr: false,
  },
)

const HeldMembershipsModal = dynamic(
  () => import('@/components/organism/Modal/Profile/HeldMembershipsModal'),
  {
    ssr: false,
  },
)

const SocialProfileEditModal = dynamic(
  () => import('@/components/organism/Modal/Profile/SocialProfileEditModal'),
  {
    ssr: false,
  },
)

const EditSelfClaimMembershipsModal = dynamic(
  ()=> import('@/components/organism/Modal/Profile/EditSelfClaimMembershipModal'),
  {
    ssr: false,
  },
)

const NewTaskWidgetModal = dynamic(
  () => import('@/components/organism/Modal/Tasks/NewTaskWidgetModal'),
  {
    ssr: false,
  },
)

export const ProfileContainer: FC<Props> = ({ did }) => {
  const { currentTheme } = useVESSTheme()
  const { businessProfile, isFetchingBusinessProfile, isMe } = useBusinessProfile(did)
  const { socialLinks, isFetchingSocialLinks } = useSocialLinks(did)
  const selectedAttendance = useSelectedAttendance()
  const selectedTask = useSelectedTask()
  const router = useRouter()
  const { did: myDID } = useDIDAccount()
  const [focusEditable, setFocusEditable] = useStateFocusEditable()

  const Container = styled.div`
    width: 100%;
    height: max(100%, 100vh);
    background: ${currentTheme.background};
  `
  const ActionContainer = styled.div`
    width: 100%;
    padding: 12px 16px;
    display: none;
    @media (max-width: 599px) {
      padding: 12px 16px;
      display: block;
    }
  `
  const ProfileContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    overflow: scroll;
    padding: 24px;

    @media (max-width: 1079px) {
      justify-content: start;
    }

    @media (max-width: 599px) {
      justify-content: center;
      overflow: visible;
      padding: 0px;
    }
  `
  const Profile = styled.div`
    display: grid;
    grid-template-rows: repeat(8, 56px);
    grid-template-columns: repeat(12, 56px);
    grid-gap: 24px;

    @media (max-width: 1079px) {
      grid-template-rows: repeat(8, 56px);
      grid-template-columns: repeat(12, 56px);
      grid-gap: 24px;
    }
    @media (max-width: 599px) {
      grid-template-rows: repeat(16, 44px);
      grid-template-columns: repeat(6, 44px);
      grid-gap: 16px;
      padding: 0px;
    }
  `
  const ShareContainer = styled.div`
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 100;
    @media (max-width: 599px) {
      bottom: 88px;
      right: 24px;
    }
  `

  const gotoInvitaion = () => {
    router.push('/connection/invitation')
  }

  if (!did) {
    return <></>
  }
  return (
    <Container>
      <ActionContainer>
        <Flex justifyContent='flex-end' alignItems='center' width='100%'>
          {myDID && myDID === did && (
            <>
              {!focusEditable ? (
                <Button
                  variant='outlined'
                  text='Edit'
                  onClick={() => setFocusEditable(true)}
                  mainColor={currentTheme.outline}
                  textColor={currentTheme.onSurface}
                  size={'S'}
                  icon={ICONS.EDIT}
                />
              ) : (
                <Button
                  variant='outlined'
                  text='Done'
                  onClick={() => setFocusEditable(false)}
                  mainColor={currentTheme.outline}
                  textColor={currentTheme.onSurface}
                  size={'S'}
                  icon={ICONS.CHECKED}
                />
              )}
            </>
          )}
        </Flex>
      </ActionContainer>
      <ProfileContainer>
        <Profile>
          <BasicProfileWidget
            did={did}
            gridRow={'1/5'}
            gridCol={'1/7'}
            gridRowOnSp={'1/5'}
            gridColOnSp={'1/7'}
            editable={isMe}
          />
          <SelfClaimedRoleWidget
            did={did}
            gridRow={'5/6'}
            gridCol={'1/7'}
            gridRowOnSp={'5/6'}
            gridColOnSp={'1/7'}
            editable={isMe}
            EditButtonPosition={'-10px'}
          />
          <HighlightedMembershipWidget
            did={did}
            gridRow={'6/9'}
            gridCol={'1/5'}
            gridRowOnSp={'6/9'}
            gridColOnSp={'1/5'}
            editable={isMe}
          />
          <SocialLinksWidget
            did={did}
            gridRow={'6/9'}
            gridCol={'5/7'}
            gridRowOnSp={'6/9'}
            gridColOnSp={'5/7'}
            editable={isMe}
            EditButtonPosition={'-10px'}
          />
          <WorkStyleWidget
            did={did}
            gridRow={'1/6'}
            gridCol={'7/9'}
            gridRowOnSp={'12/17'}
            gridColOnSp={'1/3'}
            editable={isMe}
            EditButtonPosition={'-10px'}
          />
          <WorkStatusWidget
            did={did}
            gridRow={'6/9'}
            gridCol={'7/9'}
            gridRowOnSp={'9/12'}
            gridColOnSp={'1/3'}
            editable={isMe}
          />
          <EventAttendancesWidget
            did={did}
            gridRow={'1/5'}
            gridCol={'9/13'}
            gridRowOnSp={'9/13'}
            gridColOnSp={'3/7'}
            editable={false}
          />
          <WorkCredentialsWidget
            did={did}
            gridRow={'5/9'}
            gridCol={'9/13'}
            gridRowOnSp={'13/17'}
            gridColOnSp={'3/7'}
            editable={isMe}
          />
        </Profile>
      </ProfileContainer>
      <ExperiencesContainer did={did} />
      <CertificationsContainer did={did} />
      <ProfleTabs did={did} />
      {myDID && did === myDID && (
        <ShareContainer>
          <IconButton
            icon={ICONS.QR}
            size={'XL'}
            mainColor={currentTheme.onPrimary}
            backgroundColor={currentTheme.primary}
            onClick={() => gotoInvitaion()}
          />
        </ShareContainer>
      )}
      {!isFetchingBusinessProfile && isMe && (
        <BasicProfileWidgetEditModal did={did} businessProfile={businessProfile} />
      )}
      {!isFetchingSocialLinks && (
        <SocialLinkWidgetEditModal did={did} socialLinks={socialLinks} editable={isMe} />
      )}
      <HeldMembershipsModal did={did} editable={isMe} />
      <SocialProfileEditModal did={did} />
      <NewTaskWidgetModal did={did} />
      <EventDetailModal streamId={selectedAttendance?.credentialSubject.eventId} />
      <TaskDetailModal streamId={selectedTask} />
    </Container>
  )
}
