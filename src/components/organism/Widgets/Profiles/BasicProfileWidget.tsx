import styled from '@emotion/styled'
import { FC, useEffect, useMemo, useState } from 'react'
import { AvatarButton } from '@/components/atom/AvatarButtons/AvatarButton'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { SourceDrawer } from '@/components/molecure/Profile/SourceDrawer'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { profileType } from '@/jotai/account'
import { shortenStr } from '@/utils/objectUtil'

type Props = {
  did: string
  gridRow: string
  gridCol: string
  gridRowOnSp: string
  gridColOnSp: string
  editable?: boolean
  onClick?: () => void
}

export const BasicProfileWidget: FC<Props> = (props) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const {
    profile: defaultProfile,
    ccProfile,
    lensProfile,
    ensProfile,
    isloadingProfile,
  } = useSocialAccount(props.did)
  const { setShowSocialProfileModal } = useVESSWidgetModal()
  const [displayProfileType, setDisplayProfileType] = useState<profileType>('default')

  const profile = useMemo(() => {
    if (displayProfileType === 'cc') {
      return ccProfile
    } else if (displayProfileType === 'lens') {
      return lensProfile
    } else if (displayProfileType === 'ens') {
      return ensProfile
    }
    return defaultProfile
  }, [displayProfileType, defaultProfile, ccProfile, lensProfile, ensProfile])

  const HeaderImage = styled.div`
    width: 100%;
    height: 64px;
    @media (max-width: 599px) {
      height: 48px;
    }
  `
  const Container = styled.div`
    padding: 16px 24px;
    @media (max-width: 599px) {
      padding: 8px 16px 16px 16px;
    }
  `
  const PfpContainer = styled.div`
    width: 64px;
    height: 64px;

    @media (max-width: 599px) {
      width: 48px;
      height: 48px;
    }
  `
  const Name = styled.div`
    color: ${currentTheme.onPrimaryContainer};
    ${getBasicFont(currentTypo.headLine.small)};

    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.large)};
    }
  `
  const Address = styled.div`
    color: ${currentTheme.outline};
    ${getBasicFont(currentTypo.label.large)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.label.small)};
    }
  `

  const Description = styled.p`
    padding-top: 14px;
    color: ${currentTheme.onSurface};
    text-align: left;
    ${getBasicFont(currentTypo.body.medium)};
    height: 100px;
    overflow-y: scroll;
    word-break: break-word;
    white-space: pre-wrap;

    @media (max-width: 599px) {
      padding-top: 8px;
      ${getBasicFont(currentTypo.body.small)};
    }
  `

  const SrcDrawerContainer = styled.div`
    width: fit-content;
    height: 100%;
    position: absolute;
    top: 82px;
    right: 0px;
    z-index: 20;

    @media (max-width: 599px) {
      top: 48px;
    }
  `

  const handleEdit = () => {
    setShowSocialProfileModal(true)
  }

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props}>
        <SrcDrawerContainer>
          <SourceDrawer>
            <AvatarButton
              width='40px'
              height='40px'
              imgURL='/projects/lens_icon.jpg'
              order={displayProfileType == 'lens' ? -1 : 0}
              state={!lensProfile ? 'disabled' : 'default'}
              onClick={() => setDisplayProfileType('lens')}
            />
            <AvatarButton
              width='40px'
              height='40px'
              imgURL='/projects/cc_icon.jpg'
              order={displayProfileType == 'cc' ? -1 : 1}
              state={!ccProfile ? 'disabled' : 'default'}
              onClick={() => setDisplayProfileType('cc')}
            />
            <AvatarButton
              width='40px'
              height='40px'
              imgURL='/projects/vess_icon.jpg'
              order={displayProfileType == 'default' ? -1 : 2}
              onClick={() => setDisplayProfileType('default')}
            />
            <AvatarButton
              width='40px'
              height='40px'
              imgURL='/projects/ens_icon.jpg'
              order={displayProfileType == 'ens' ? -1 : 3}
              onClick={() => setDisplayProfileType('ens')}
            />
          </SourceDrawer>
        </SrcDrawerContainer>
        <HeaderImage>
          <NextImageContainer
            src={`/projects/${displayProfileType}_bg.jpg`}
            width={'100%'}
            objectFit={'cover'}
          />
        </HeaderImage>
        <Container>
          {isloadingProfile ? (
            <Flex width='100%' height='100%'>
              <CommonSpinner />
            </Flex>
          ) : (
            <>
              <Flex rowGap='4px' colGap='12px' colGapSP='8px' justifyContent={'start'}>
                <PfpContainer>
                  <Avatar url={profile?.avatarSrc} fill />
                </PfpContainer>
                <Flex flexDirection='column' alignItems={'flex-start'}>
                  <Name>{profile?.displayName}</Name>
                  <Address>{shortenStr(props.did, 16)}</Address>
                </Flex>
              </Flex>
              <Description>{profile?.bio}</Description>
            </>
          )}
        </Container>
      </BaseWidget>
    </>
  )
}
