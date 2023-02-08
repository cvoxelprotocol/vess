import styled from '@emotion/styled'
import { FC } from 'react'
import { Flex } from '@/components/atom/Common/Flex'
import { Icon, IconsType } from '@/components/atom/Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  icon: IconsType
  content?: string | string[]
  borderRadius?: string
}

export const WorkStyleItem: FC<Props> = ({ icon, content, borderRadius }) => {
  const { currentTheme, currentTypo, getFont } = useVESSTheme()

  const Container = styled.div`
    height: auto;
    width: 100%;
  `
  const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 100%;
    min-height: 75px;
    max-height: 100px;
    background: ${currentTheme.surface3};
    border-radius: ${borderRadius};
  `
  const InfoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 90px;
    height: 100%;
    min-height: 75px;
    max-height: 100px;
    word-wrap: break-word;
    word-break: break-all;
    padding: 0px 8px;
  `
  const Content = styled.div`
    color: ${currentTheme.onSurface};
    font: ${getFont(currentTypo.label.medium)};
  `

  return (
    <Container>
      <Flex height={'100%'}>
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
