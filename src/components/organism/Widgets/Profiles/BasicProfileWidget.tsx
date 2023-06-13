import styled from '@emotion/styled'
import { FC, useMemo, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { AvatarButton } from '@/components/atom/AvatarButtons/AvatarButton'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { useCcProfile } from '@/hooks/useCcProfile'
import { useLensProfile } from '@/hooks/useLensProfile'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useToast } from '@/hooks/useToast'
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
  const { profile, ensProfile } = useSocialAccount(props.did)
  const { lensProfile } = useLensProfile(props.did)
  const { ccProfile } = useCcProfile(props.did)
  const { setShowSocialProfileModal } = useVESSWidgetModal()
  const [displayProfileType, setDisplayProfileType] = useState<profileType>('default')
  const profileWalletAddress = props.did?.slice(-42)
  const { showToast } = useToast()


  const displayProfile = useMemo(() => {
    if (displayProfileType === 'cc') {
      return ccProfile
    } else if (displayProfileType === 'lens') {
      return lensProfile
    } else if (displayProfileType === 'ens') {
      return ensProfile
    }
    return profile
  }, [displayProfileType, profile, ccProfile, lensProfile, ensProfile])

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

  const DrawerContainer = styled.div`
    background-color: ${currentTheme.surfaceVariant};
    width: fit-content;
    height: fit-content;
    padding: 4px 8px 4px 4px;
    display: flex;
    grid-template-columns: repeat(3, 30%);
    justify-content: start;
    align-items: center;
    border: 1px solid ${currentTheme.outline};
    border-right: none;
    border-radius: 99px 0 0 99px;
    overflow: hidden;
    transform: translateX(144px);
    transition: all 0.3s;

    &:hover {
      width: fit-content;
      justify-content: start;
      transform: none;
    }
  `

  const handleEdit = () => {
    setShowSocialProfileModal(true)
  }

  const handleOnCopy = async () => {
    showToast('Copied!')
  }

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props}>
        <SrcDrawerContainer>
          <DrawerContainer>
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
          </DrawerContainer>
        </SrcDrawerContainer>
        <HeaderImage>
          <NextImageContainer
            src={`/projects/${displayProfileType}_bg.jpg`}
            width={'100%'}
            objectFit={'cover'}
          />
        </HeaderImage>
        <Container>
          <Flex rowGap='4px' colGap='12px' colGapSP='8px' justifyContent={'start'}>
            <PfpContainer>
              <Avatar url={displayProfile?.avatarSrc} fill />
            </PfpContainer>
            <Flex flexDirection='column' alignItems={'flex-start'}>
              <Name>{displayProfile?.displayName}</Name>
              <CopyToClipboard text={profileWalletAddress} onCopy={handleOnCopy}>

              <Address>{shortenStr(profileWalletAddress, 16)}</Address>
              </CopyToClipboard>

            </Flex>
          </Flex>
          <Description>{displayProfile?.bio}</Description>
        </Container>
      </BaseWidget>
    </>
  )
}
