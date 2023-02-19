import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { FC, useMemo } from 'react'
import type { WithCeramicId, TaskCredential } from 'vess-sdk'
import { NoItem } from '@/components/atom/Common/NoItem'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { BaseWidget } from '@/components/atom/Widgets/BaseWidget'
import { useHeldTaskCredentials } from '@/hooks/useHeldTaskCredentials'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'

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
  const { heldTaskCredentials, isFetchingHeldTaskCredentials } = useHeldTaskCredentials(props.did)
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { setShowTaskModal } = useVESSWidgetModal()

  const Container = styled.div`
    padding: 16px 24px;
    width: 100%;
    height: 100%;
    position: relative;
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
  const FooterTitle = styled.a`
    color: ${currentTheme.primary};
    ${getBasicFont(currentTypo.title.small)};
    text-decoration: none;
  `
  const NoItemContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `
  const LoadingContainer = styled.div`
    width: 100%;
    height: 100%;
  `

  const CoverForTouch = styled.div`
    display: none;
    @media (max-width: 599px) {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    }
  `
  const handleEdit = () => {
    setShowTaskModal(true)
  }

  const selectItem = (item: WithCeramicId<TaskCredential>) => {
    // console.log({ item })
  }

  const VisualizerPresenterMemo = useMemo(
    () => (
      <VisualizerPresenterWrapper
        content={heldTaskCredentials && heldTaskCredentials.length > 0 ? heldTaskCredentials : []}
        showDetailBox={selectItem}
      />
    ),
    [heldTaskCredentials],
  )

  return (
    <>
      <BaseWidget onClickEdit={handleEdit} {...props} border={`1px solid ${currentTheme.outline}`}>
        <Container>
          {isFetchingHeldTaskCredentials ? (
            <LoadingContainer>
              {' '}
              <CommonSpinner />
            </LoadingContainer>
          ) : (
            <>
              {!heldTaskCredentials || heldTaskCredentials.length === 0 ? (
                <NoItemContainer>
                  <NoItem text='No item yet' />
                </NoItemContainer>
              ) : (
                <>{VisualizerPresenterMemo}</>
              )}
            </>
          )}
          <CoverForTouch />
        </Container>
        <FooterContainer>
          <FooterTitle href={'#Tasks'}>Work Credentials</FooterTitle>
        </FooterContainer>
      </BaseWidget>
    </>
  )
}
