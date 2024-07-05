import styled from '@emotion/styled'
import { FlexHorizontal, FlexVertical, Text } from 'kai-kit'
import { FC, useEffect, useMemo } from 'react'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { HCLayout } from '@/components/app/HCLayout'
import { DefaultHeader } from '@/components/app/Header'
import { useAvatar } from '@/hooks/useAvatar'

type Props = {
  canvasId: string
}

export const AvatarDetailContainer: FC<Props> = ({ canvasId }) => {
  const { avatar, isLoadingAvatar } = useAvatar(undefined, canvasId)

  const creds = useMemo(() => {
    return avatar?.canvasCredentials?.map((c) => c.credential) || []
  }, [avatar])

  const formattedCreds = useMemo(() => {
    return creds
      .map((item) => {
        const plainCredential = JSON.parse(item.plainCredential)
        return {
          ...plainCredential,
          credentialType: item.credentialType,
        }
      })
      .map((item) => {
        let title = ''
        let image = ''
        if (item.credentialType?.name === 'attendance') {
          title = item.credentialSubject.eventName
          image = item.credentialSubject.eventIcon
        } else if (item.credentialType?.name === 'membership') {
          title = item.credentialSubject.membershipName
          image = item.credentialSubject.membershipIcon
        } else if (item.credentialType?.name === 'certificate') {
          title = item.credentialSubject.certificationName
          image = item.credentialSubject.image
        } else {
          title = item.credentialSubject.name || item.credentialSubject.title
          image = item.credentialSubject.image || item.credentialSubject.icon || ''
        }
        return {
          ...item,
          title,
          image,
        }
      })
  }, [creds])

  return (
    <>
      <HCLayout header={<DefaultHeader />}>
        <MainFrame>
          {avatar?.avatarUrl && (
            <ImageContainer src={avatar?.avatarUrl} width='320px' height='auto' />
          )}
          <FlexVertical gap='12px'>
            <Text as='p' typo='title-lg' color='var(--kai-color-sys-on-layer)'>
              利用されているVC
            </Text>
            <FlexHorizontal gap='8px'>
              {formattedCreds &&
                formattedCreds.length > 0 &&
                formattedCreds.map((c) => {
                  return <ImageContainer key={c.id} src={c.image} width={'160px'} />
                })}
            </FlexHorizontal>
          </FlexVertical>
        </MainFrame>
      </HCLayout>
    </>
  )
}

const MainFrame = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: var(--kai-z-index-sys-default);
  align-items: center;
  gap: var(--kai-size-ref-24);
  padding: var(--kai-size-sys-space-lg) var(--kai-size-sys-space-md);
  overflow: visible;
`
const EventListFrame = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--kai-size-ref-240), 1fr));
  grid-column-gap: var(--kai-size-ref-12);
  grid-row-gap: var(--kai-size-ref-12);
  justify-content: center;
`

const FocusDiv = styled.button`
  width: 400px;
  height: 80px;
  border-radius: 16px;
  border: none;

  background: var(--kai-color-sys-layer-nearest);
  &:focus {
    border: 2px solid var(--kai-color-sys-dominant);
  }
`
