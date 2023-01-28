import styled from '@emotion/styled'
import { FC } from 'react'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Flex } from '@/components/atom/Common/Flex'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { useBusinessProfile } from '@/hooks/useBusinessProfile'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { shortenStr } from '@/utils/objectUtil'

type Props = {
  did: string
  gridRow: string
  gridCol: string
  onClick?: () => void
}

export const BasicProfileWidget: FC<Props> = (props) => {
  const { currentTheme, currentTypo, getFont } = useVESSTheme()
  const { profile } = useSocialAccount(props.did)
  const { businessProfile } = useBusinessProfile(props.did)
  const { openModal } = useVESSWidgetModal()

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
    font: ${getFont(currentTypo.headLine.small)};
  `
  const Address = styled.div`
    color: ${currentTheme.outline};
    font: ${getFont(currentTypo.label.large)};
  `

  const Description = styled.p`
    padding-top: 14px;
    color: ${currentTheme.onSurface};
    text-align: left;
    font-family: ${currentTypo.body.medium.fontFamily};
    font-size: ${currentTypo.body.medium.fontSize};
    line-height: ${currentTypo.body.medium.lineHeight};
    font-weight: ${currentTypo.body.medium.fontWeight};
    height: 100px;
    overflow-y: scroll;
  `

  const handleEdit = () => {
    openModal()
  }

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props} editable>
        <HeaderImage>
          <NextImageContainer
            src={'/base_item_header.png'}
            width={'100%'}
            objectFit={'cover'}
            borderRadius={'40px 40px 0px 0px'}
          />
        </HeaderImage>
        <Container>
          <Flex rowGap='4px' colGap='12px' justifyContent={'start'}>
            <PfpContainer>
              <Avatar url={profile.avatarSrc} size={'XXL'} />
            </PfpContainer>
            <Flex flexDirection='column' alignItems={'flex-start'}>
              <Name>{profile.displayName}</Name>
              <Address>{shortenStr(props.did, 16)}</Address>
            </Flex>
          </Flex>
          <Description>{businessProfile?.bio}</Description>
        </Container>
      </BaseWidget>
    </>
  )
}
