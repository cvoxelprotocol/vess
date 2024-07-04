import styled from '@emotion/styled'
import copy from 'copy-to-clipboard'
import { Button, FlexHorizontal, Skelton, Text, useSnackbar } from 'kai-kit'
import React, { FC, useMemo } from 'react'
import { QRCode } from '../sticker/QRCode'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { useUserCredItem } from '@/hooks/useUserCredItem'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { ShareCredentialProps } from '@/pages/creds/items/share/[id]'

export const ShareCredItemContainer: FC<ShareCredentialProps> = ({ id }) => {
  const { id: userId } = useVESSAuthUser()
  const { isInitialLoading, userCredentialItems } = useUserCredItem(userId)

  const { openSnackbar } = useSnackbar({
    id: 'share-url-copied',
    text: '共有用URLをコピーしました。',
  })

  const item = useMemo(() => {
    return userCredentialItems?.find((item) => item.id === id)
  }, [userCredentialItems, id])

  const recieveLink = useMemo(() => {
    if (!item) return ''
    return `https://app.vess.id/creds/receive/${item?.id}`
  }, [item])

  const handleShare = () => {
    copy(recieveLink)
    openSnackbar()
  }

  return (
    <ReceiveCredentialFrame>
      <CredentialFrame>
        <Skelton
          width='var(--kai-size-ref-192)'
          height='var(--kai-size-ref-192)'
          radius='var(--kai-size-sys-round-full)'
          className='dark'
          isLoading={isInitialLoading}
        ></Skelton>
        <FlexVertical gap='4px' justifyContent='center' alignItems='center'>
          {!isInitialLoading && item && <QRCode url={recieveLink} />}
          <Text as='h2' typo='title-lg' align='center' color='var(--kai-color-sys-on-background)'>
            {item?.title}
          </Text>
          <Text as='p' typo='body-sm' align='center' color='var(--kai-color-sys-neutral)'>
            {item?.description}
          </Text>
          {item?.sticker && item?.sticker.length > 0 && (
            <FlexVertical justifyContent='center' alignItems='center'>
              <FlexHorizontal
                gap='var(--kai-size-sys-space-sm)'
                justifyContent='center'
                alignItems='center'
              >
                {item?.sticker.map((s, index) => (
                  <ImageContainer
                    key={s.id}
                    src={s.image}
                    width='var(--kai-size-ref-80)'
                    objectFit='contain'
                    height='auto'
                    style={{ background: 'transparent' }}
                  />
                ))}
              </FlexHorizontal>
            </FlexVertical>
          )}
        </FlexVertical>
      </CredentialFrame>
      <ActionFrame>
        <Button width='100%' onPress={handleShare} variant='filled' color='neutral'>
          共有する
        </Button>
      </ActionFrame>
    </ReceiveCredentialFrame>
  )
}

const ReceiveCredentialFrame = styled.div`
  position: fixed;
  inset: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: var(--kai-size-ref-24);
  padding: var(--kai-size-ref-24);
  background: var(--kai-color-sys-background);
  scrollbar-width: none;
`

const CredentialFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: var(--kai-size-sys-space-sm);
  padding: 32px 40px;
  overflow: scroll;
  border-radius: 24px;
  border: 1px solid var(--neutral-neutral-outline, #b5a8aa);
  background: var(--layer-layer-farthest, #fff);
  /* card-shadow-default */
  box-shadow: 0px 2px 0px 0px var(--layer-shadow, #b5a8aa);
`

const ActionFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--kai-size-sys-space-sm);
  width: 100%;
  padding: var(--kai-size-sys-space-md);

  & > button {
    max-width: var(--kai-size-ref-320);
  }
`
