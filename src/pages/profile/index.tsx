import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { ProfileContainer } from '@/components/profile/ProfileContainer'

const Profile: NextPage = () => {
  return (
    <>
      <Meta
        pageTitle='プロファイル'
        pageDescription='プロファイルページです。'
        pagePath='https://app.vess.id/profile/'
      />
      <ProfileContainer />
    </>
  )
}

export default Profile
