import { Button, FlexVertical, Text } from 'kai-kit'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { PiSignIn } from 'react-icons/pi'
import { Meta } from '@/components/layouts/Meta'
import { PostFeedContainer } from '@/components/post/PostFeedContainer'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'

const AddPostPage: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const feedOnly = router.query.feedOnly as string
  const { user, connectionStatus } = useVESSAuthUser()
  const { formatedCredentials, isInitialLoading } = useVerifiableCredentials(user?.did)

  const hasCredential = useMemo(() => {
    return formatedCredentials.some((c) => c.credId === id)
  }, [formatedCredentials, id])

  if (isInitialLoading || connectionStatus === 'connecting') {
    return (
      <FlexVertical
        gap='var(--kai-size-sys-space-md)'
        width='100%'
        height='100%'
        alignItems='center'
        justifyContent='center'
      >
        <Text typo='title-lg' color='var(--kai-color-sys-on-layer)'>
          Loading...
        </Text>
      </FlexVertical>
    )
  }

  if (!user?.did) {
    return (
      <FlexVertical
        gap='var(--kai-size-sys-space-md)'
        width='100%'
        height='100%'
        alignItems='center'
        justifyContent='center'
      >
        <Text typo='title-lg' color='var(--kai-color-sys-on-layer)'>
          you need to login to view this page!
        </Text>
        <Button
          variant='tonal'
          width='auto'
          endContent={<PiSignIn />}
          style={{ justifyContent: 'space-between' }}
          onPress={() => {
            router.push('/login')
          }}
        >
          ログインする
        </Button>
      </FlexVertical>
    )
  }
  if (!hasCredential) {
    return (
      <FlexVertical
        gap='var(--kai-size-sys-space-md)'
        width='100%'
        height='100%'
        alignItems='center'
        justifyContent='center'
        padding='var(--kai-size-sys-space-md)'
      >
        <Text typo='headline-sm' color='var(--kai-color-sys-on-layer)'>
          you need to have the credential to view this page!
        </Text>
        <Button
          variant='tonal'
          width='auto'
          endContent={<PiSignIn />}
          style={{ justifyContent: 'space-between' }}
          onPress={() => {
            router.push('/')
          }}
        >
          TOPページへ
        </Button>
      </FlexVertical>
    )
  }
  return (
    <>
      <Meta pageTitle='Post Feed' />
      <PostFeedContainer id={id} feedOnly={feedOnly === 'true'} />
    </>
  )
}

export default AddPostPage
