import styled from '@emotion/styled'
import { FC } from 'react'
import { Flex } from '@/components/atom/Common/Flex'
import { Icon, IconsType } from '@/components/atom/Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  icon: IconsType
  content?: string | string[]
  borderRadius?: string
  isborder?: boolean
  iconBackground?: string
  contentOpacity?: string
}

export const WorkStyleItem: FC<Props> = ({
  icon,
  content,
  borderRadius,
  isborder = true,
  iconBackground,
  contentOpacity = 0.3,
}) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const Container = styled.div`
    width: 100%;
    flex-grow: 1;
    border-style: solid;
    border-width: ${isborder ? '0px 0px 0.5px 0px' : '0px'};
    border-color: ${currentTheme.surfaceVariant};
  `
  const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 100%;
    max-height: 100px;
    background: ${iconBackground || currentTheme.surface3};
    border-radius: ${borderRadius};

    @media (max-width: 599px) {
      width: 28px;
    }
  `
  const InfoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-grow: 1;
    max-height: 100px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
    text-align: center;
  `
  const Content = styled.div`
    color: ${currentTheme.onSurface};
    opacity: ${contentOpacity};
    ${getBasicFont(currentTypo.label.medium)};
  `

  return (
    <Container>
      <Flex height={'100%'} width={'100%'} flexWrap={'auto'}>
        <IconContainer>
          <Icon icon={icon} size={'M'} mainColor={currentTheme.onSurface} />
        </IconContainer>
        <InfoContainer>
          {typeof content === 'string' ? (
            <Content>{content}</Content>
          ) : (
            <>
              {content?.map((c) => {
                return <Content key={c}>{c}</Content>
              })}
            </>
          )}
        </InfoContainer>
      </Flex>
    </Container>
  )
}
