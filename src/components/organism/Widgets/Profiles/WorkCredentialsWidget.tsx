import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { FC, useMemo } from 'react'
import type { WorkCredentialWithId } from 'vess-sdk'
import { NoItem } from '@/components/atom/Common/NoItem'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useWorkCredentials } from '@/hooks/useWorkCredential'

const VisualizerPresenterWrapper = dynamic(
  () => import('@/components/atom/Voxels/VisualizerPresenterWrapper'),
  {
    ssr: false,
  },
)

type Props = {
  did: string
  gridRow: string
  gridCol: string
  gridRowOnSp: string
  gridColOnSp: string
  editable?: boolean
  onClick?: () => void
}

export const WorkCredentialsWidget: FC<Props> = (props) => {
  const { workCredentials } = useWorkCredentials(props.did)

  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const Container = styled.div`
    padding: 16px 24px;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  `
  const FooterContainer = styled.div`
    height: 30px;
    background: ${currentTheme.surface1};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 0 40px 40px;
    margin: 4px;
  `
  const FooterTitle = styled.div`
    color: ${currentTheme.primary};
    ${getBasicFont(currentTypo.title.small)};
  `
  const NoItemContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `

  const handleEdit = () => {}

  const selectItem = (item: WorkCredentialWithId) => {
    // console.log({ item })
  }

  const VisualizerPresenterMemo = useMemo(
    () => (
      <VisualizerPresenterWrapper
        content={workCredentials && workCredentials.length > 0 ? workCredentials : []}
        showDetailBox={selectItem}
      />
    ),
    [workCredentials],
  )

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props} border={`1px solid ${currentTheme.outline}`}>
        <Container>
          {!workCredentials || workCredentials.length === 0 ? (
            <NoItemContainer>
              <NoItem text='Coming Soon...' />
            </NoItemContainer>
          ) : (
            <>{VisualizerPresenterMemo}</>
          )}
        </Container>
        <FooterContainer>
          <FooterTitle>Work Credentials</FooterTitle>
        </FooterContainer>
      </BaseWidget>
    </>
  )
}
