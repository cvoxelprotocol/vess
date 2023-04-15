import styled from '@emotion/styled'
import { Chat } from '@orbisclub/components'
import { FC } from 'react'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import '@orbisclub/components/dist/index.modern.css'

export const OrbisChat: FC = () => {
  const { currentTheme } = useVESSTheme()
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    background: ${currentTheme.background};
    height: 90%;
  `

  return (
    <Container>
      <Chat
        theme='kjzl6cwe1jw145phgjoapec4g170hncwgw5htr3q8fk6dt4vlnetrt9xez7ln9u'
        context='kjzl6cwe1jw1466bqu8ykbj8v4hkq5kr4idjiowdgygbvaq4ozegou01ygzfb41'
      />
      ;
    </Container>
  )
}
