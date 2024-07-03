import styled from '@emotion/styled'
import copy from 'copy-to-clipboard'
import { Button, FlexHorizontal, Skelton, Text } from 'kai-kit'
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

  const item = useMemo(() => {
    return userCredentialItems?.find((item) => item.id === id)
  }, [userCredentialItems, id])

  const recieveLink = useMemo(() => {
    if (!item) return ''
    return `https://app.vess.id/creds/receive/${item?.id}`
  }, [item])

  const handleShare = () => {
    console.log('share')
    copy(recieveLink)
  }

  return (
    <ReceiveCredentialFrame className='dark'>
      <CredentialFrame>
        <Skelton
          width='var(--kai-size-ref-192)'
          height='var(--kai-size-ref-192)'
          radius='var(--kai-size-sys-round-full)'
          className='dark'
          isLoading={isInitialLoading}
        ></Skelton>
        <FlexVertical gap='24px' justifyContent='center' alignItems='center'>
          {!isInitialLoading && item && <QRCode url={recieveLink} />}
          <Text
            as='h2'
            typo='headline-sm'
            align='center'
            color='var(--kai-color-sys-on-background)'
          >
            {item?.title}
          </Text>
          <Text
            as='h2'
            typo='headline-sm'
            align='center'
            color='var(--kai-color-sys-on-background)'
          >
            {item?.description}
          </Text>
          {item?.sticker && item?.sticker.length > 0 && (
            <FlexVertical
              gap='var(--kai-size-sys-space-md)'
              justifyContent='center'
              alignItems='center'
              padding='32px 0'
            >
              <Text as='span' typo='title-md' color='var(--kai-color-sys-neutral)'>
                ステッカー
              </Text>
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
                  />
                ))}
              </FlexHorizontal>
            </FlexVertical>
          )}
        </FlexVertical>
      </CredentialFrame>
      <ActionFrame>
        <Button width='100%' onPress={handleShare}>
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
  gap: var(--kai-size-ref-96);
  padding: var(--kai-size-ref-24);
  background: var(--kai-color-sys-background);
`

const CredentialFrame = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: var(--kai-size-sys-space-lg);
  width: 100%;
  padding: var(--kai-size-sys-space-md);
  padding-top: var(--kai-size-ref-112);
  padding-bottom: var(--kai-size-ref-320);
  overflow: scroll;
`

const ActionFrame = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--kai-size-sys-space-sm);
  width: 100%;
  padding: var(--kai-size-sys-space-md);
  background: linear-gradient(to top, #000000ff, #00000000);

  & > button {
    max-width: var(--kai-size-ref-320);
  }
`
