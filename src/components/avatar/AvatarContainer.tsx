import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { FC, useMemo } from 'react'
import { getAddressFromPkh } from 'vess-kit-web'
import { HCLayout } from '@/components/app/HCLayout'
import { DefaultHeader } from '@/components/app/Header'
import { useCcProfile } from '@/hooks/useCcProfile'
import { useENS } from '@/hooks/useENS'
import { useLensProfile } from '@/hooks/useLensProfile'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'

type Props = {
  did: string
}

const ImageCanvas = dynamic(() => import('@/components/avatar/ImageCanvas'), { ssr: false })

export const AvatarContainer: FC<Props> = ({ did }) => {
  const { did: myDid } = useVESSAuthUser()
  const { vsUser } = useVESSUserProfile(did)
  const { ccProfile } = useCcProfile(did)
  const { ensProfile, isInitialLoading: ensLoading } = useENS(
    getAddressFromPkh(did) as `0x${string}`,
  )
  const { lensProfile, lensLoading } = useLensProfile(did)
  const { formatedCredentials, isInitialLoading, certificates, attendances, memberships } =
    useVerifiableCredentials(did)

  const avatarUrl = useMemo(() => {
    if (vsUser?.avatar) {
      return vsUser.avatar
    } else if (ensProfile?.avatarSrc) {
      return ensProfile?.avatarSrc
    } else if (ccProfile?.avatarSrc) {
      return ccProfile?.avatarSrc
    } else if (lensProfile?.avatarSrc) {
      return lensProfile?.avatarSrc
    } else {
      return undefined
    }
  }, [ensProfile, vsUser, ccProfile, lensProfile])

  const images = useMemo(() => {
    console.log({ formatedCredentials })
    return formatedCredentials.map((item) => {
      return item.image as string
    })
  }, [formatedCredentials])

  return (
    <>
      <HCLayout header={<DefaultHeader />}>
        <MainFrame>
          {avatarUrl && images && images.length > 0 && (
            <ImageCanvas avatarUrl={avatarUrl} images={images} />
          )}
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
