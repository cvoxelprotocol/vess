import styled from '@emotion/styled'
import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import {
  Card,
  Err,
  Lead,
  PresentPanel,
  Primary,
  ResultView,
  SHOP_NAME,
  Shell,
  Small,
  Title,
  color,
} from '@/components/restaurant/ui'
import { useVpFlow } from '@/components/restaurant/useVpFlow'

const LABELS: Record<string, string> = { birth_month: '誕生月' }

const BirthdayPage: NextPage = () => {
  const { phase, authReqUri, status, result, error, start, reset } = useVpFlow('birthday')

  return (
    <>
      <Meta pageTitle={`誕生日クーポン - ${SHOP_NAME}（デモ）`} />
      <Shell>
        <Banner>
          <BannerLabel>HAPPY BIRTHDAY</BannerLabel>
          <BannerTitle>お誕生月は天ざるそば1杯無料</BannerTitle>
        </Banner>

        {phase === 'idle' && (
          <>
            <Title>誕生日クーポンを受け取る</Title>
            <Lead>
              お店が確認するのは「誕生月」だけです。生年月日・年齢・お名前は提示されず、会員登録も不要です。今月がお誕生月なら、その場でクーポンを表示します。
            </Lead>
            <Primary onClick={start}>VESS Login で誕生月を提示する</Primary>
            {error && <Err>{error}</Err>}
          </>
        )}

        {phase === 'present' && (
          <>
            <PresentPanel uri={authReqUri} status={status} requested={Object.values(LABELS)} />
            {error && <Err>{error}</Err>}
          </>
        )}

        {phase === 'processing' && (
          <Card>
            <Small>提示を確認しました。クーポンを準備しています…</Small>
          </Card>
        )}

        {phase === 'done' && result && <ResultView result={result} labels={LABELS} onRetry={reset} />}
      </Shell>
    </>
  )
}

const Banner = styled.div`
  border-radius: 16px;
  padding: 22px 20px;
  color: #fff;
  background: linear-gradient(135deg, ${color.accent}, #7d2a1b);
`
const BannerLabel = styled.div`
  font-size: 12px;
  letter-spacing: 0.2em;
  opacity: 0.85;
`
const BannerTitle = styled.div`
  font-size: 24px;
  font-weight: 900;
  margin-top: 4px;
`

export default BirthdayPage
