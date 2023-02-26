import styled from '@emotion/styled'
import { FC, useMemo, useState } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Button } from '@/components/atom/Buttons/Button'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
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
  }, [displayProfileType, defaultProfile])

  const HeaderImage = styled.div`
    width: 100%;
    height: 64px;
  `
  const Container = styled.div`
    padding: 16px 24px;
  `
  const PfpContainer = styled.div`
    width: fit-content;
  `
  const Name = styled.div`
    color: ${currentTheme.onPrimaryContainer};
    ${getBasicFont(currentTypo.headLine.small)};
  `
  const Address = styled.div`
    color: ${currentTheme.outline};
    ${getBasicFont(currentTypo.label.large)};
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
  `

  const handleEdit = () => {
    setShowSocialProfileModal(true)
  }

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props}>
        <HeaderImage>
          <NextImageContainer src={'/base_item_header.png'} width={'100%'} objectFit={'cover'} />
        </HeaderImage>
        <Container>
          <Flex rowGap='4px' colGap='12px' justifyContent={'start'}>
            <PfpContainer>
              <Avatar url={profile?.avatarSrc} size={'XXL'} />
            </PfpContainer>
            <Flex flexDirection='column' alignItems={'flex-start'}>
              <Name>{profile?.displayName}</Name>
              <Address>{shortenStr(props.did, 16)}</Address>
            </Flex>
          </Flex>
          <Flex>
            <Button text='default' onClick={() => setDisplayProfileType('default')} />
            {!!lensProfile && <Button text='lens' onClick={() => setDisplayProfileType('lens')} />}
            {!!ccProfile && <Button text='cc' onClick={() => setDisplayProfileType('cc')} />}
            {!!ensProfile && <Button text='ens' onClick={() => setDisplayProfileType('ens')} />}
          </Flex>
          <Description>{profile?.bio}</Description>
        </Container>
      </BaseWidget>
    </>
  )
}
