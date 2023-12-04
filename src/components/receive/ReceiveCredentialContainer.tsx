import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { Button } from '@/kai/button/Button'
import { Skelton } from '@/kai/skelton'
import { Text } from '@/kai/text/Text'

export type ReceiveCredentialContainerProps = {
  credImageSrc?: string
  credTitle?: string
}

export const ReceiveCredentialContainer: FC<ReceiveCredentialContainerProps> = ({
  credImageSrc,
  credTitle,
}) => {
  const { did } = useDIDAccount()
  const router = useRouter()
  return (
    <>
      <ReceiveCredentialFrame className='dark'>
        <FlexVertical width='100%' alignItems='center' gap='var(--kai-size-ref-24)'>
          <Skelton
            width='var(--kai-size-ref-192)'
            height='var(--kai-size-ref-192)'
            radius='var(--kai-size-sys-round-full)'
            className='dark'
            isLoading
          ></Skelton>
          <Text as='h2' typo='headline-sm' color='var(--kai-color-sys-on-background)'>
            Credential Name
          </Text>
        </FlexVertical>
        <FlexVertical width='100%' alignItems='center' gap='var(--kai-size-ref-8)'>
          <Button width='var(--kai-size-ref-240)'>受け取る</Button>
          <Button
            variant='text'
            size='sm'
            round='md'
            onPress={() => {
              if (did) {
                router.push(`/did/${did}`)
              }
            }}
          >
            受け取らずにホームへ
          </Button>
        </FlexVertical>
      </ReceiveCredentialFrame>
    </>
  )
}

const ReceiveCredentialFrame = styled.div`
  position: fixed;
  inset: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--kai-size-ref-96);

  padding: var(--kai-size-ref-24);
  background: var(--kai-color-sys-background);
`
