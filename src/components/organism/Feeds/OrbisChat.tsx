import styled from '@emotion/styled'
import { Discussion, Post } from '@orbisclub/components'
import { Orbis } from '@orbisclub/orbis-sdk'
import { FC, useEffect } from 'react'
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

  const load = async () => {
    const orbis = new Orbis()
    const queryParams = {
      context: 'kjzl6cwe1jw146kt8xyihq5zr13m6fydmy38lr6mu142c9bzl9wpomswvsk37ut:111aaa',
    }
    let { data, error } = await orbis.getPosts(queryParams, 0)
    console.log({ data })
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Container>
      <Discussion
        theme='kjzl6cwe1jw1467e5htc2cl9bn6bkq1z9660atmm1pug5qffdsy3gpj5wb2kpsh'
        context='kjzl6cwe1jw146kt8xyihq5zr13m6fydmy38lr6mu142c9bzl9wpomswvsk37ut:111aaa'
      />
    </Container>
  )
}
