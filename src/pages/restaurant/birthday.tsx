import styled from '@emotion/styled'
import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import { RamenBowl } from '@/components/restaurant/illustrations'
import {
  Card,
  CardTitle,
  Err,
  Lead,
  LoginButton,
  PageHero,
  PresentPanel,
  ResultView,
  SHOP_NAME,
  Shell,
  Small,
  StepBar,
  color,
} from '@/components/restaurant/ui'
import { useVpFlow } from '@/components/restaurant/useVpFlow'

const LABELS: Record<string, string> = { birth_month: '誕生月' }

const BirthdayPage: NextPage = () => {
  const { phase, authReqUri, status, result, error, start, reset } = useVpFlow('birthday')
  const step = phase === 'idle' ? 0 : phase === 'done' ? 2 : 1

  return (
    <>
      <Meta pageTitle={`誕生日クーポン - ${SHOP_NAME}（デモ）`} />
      <Shell>
        <PageHero
          tone='orange'
          kicker='HAPPY BIRTHDAY'
          title='お誕生月は味玉らーめん1杯無料'
          text='お誕生月にご来店のお客さまに、味玉らーめんを1杯サービスします。会員登録は必要ありません。'
        />

        <StepBar current={step} />

        {phase === 'idle' && (
          <>
            <Card>
              <Offer>
                <RamenBowl variant='ajitama' size={120} />
                <div>
                  <CardTitle>味玉らーめん（1,100円）が無料</CardTitle>
                  <Small>お会計時にクーポン画面をスタッフにお見せください。お誕生月のうち1回限り有効です。</Small>
                </div>
              </Offer>
            </Card>
            <Card>
              <CardTitle>お店が確認するのは「誕生月」だけ</CardTitle>
              <Lead>
                生年月日・年齢・お名前は提示されません。今月がお誕生月なら、その場でクーポンを表示します。
              </Lead>
            </Card>
            <LoginButton onClick={start}>VESS Login で誕生月を提示する</LoginButton>
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

const Offer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  svg {
    flex-shrink: 0;
  }
  @media (max-width: 420px) {
    flex-direction: column;
    text-align: center;
  }
  h2 {
    color: ${color.accentDeep};
    margin-bottom: 4px;
  }
`

export default BirthdayPage
