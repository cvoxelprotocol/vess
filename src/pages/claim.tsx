import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { ClaimContainer } from '@/components/templates/Claim/ClaimContainer'

const Claim: NextPage = () => {
  return (
    <>
      <Meta robots='noindex, follow' />
      <ClaimContainer />
    </>
  )
}
export default Claim
