import styled from '@emotion/styled'
import { NextPage } from 'next'
import Link from 'next/link'
import { Meta } from '@/components/layouts/Meta'
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

const LABELS: Record<string, string> = {
  member_no: '会員番号',
  age_over_20: '20歳以上',
  age_band: '年代',
  prefecture: '都道府県',
  email: 'メールアドレス',
}

const PURPOSES = [
  ['会員番号', '応募が1人1回までかの確認'],
  ['20歳以上か', '応募資格の確認'],
  ['年代・都道府県', '応募数の集計（個人とは結び付けません）'],
  ['メールアドレス', '受付確認と当選のご連絡（保存しません）'],
]

const CampaignPage: NextPage = () => {
  const { phase, authReqUri, status, result, error, start, reset } = useVpFlow('campaign')
  const step = phase === 'idle' ? 0 : phase === 'done' ? 2 : 1

  return (
    <>
      <Meta pageTitle={`開店10周年キャンペーン - ${SHOP_NAME}（デモ）`} />
      <Shell>
        <PageHero
          tone='gold'
          kicker='開店10周年キャンペーン'
          title='生ビール1年分が当たる！'
          text='日頃のご愛顧に感謝を込めて。抽選で10名さまに、生ビール1年分（中ジョッキ365杯分のお食事券）をプレゼントします。'
        />
        <Facts>
          {[
            ['応募期間', '11/1〜11/30'],
            ['当選者数', '10名さま'],
            ['応募資格', '20歳以上の方'],
          ].map(([k, v]) => (
            <Fact key={k}>
              <FactLabel>{k}</FactLabel>
              <FactValue>{v}</FactValue>
            </Fact>
          ))}
        </Facts>

        <StepBar current={step} />

        {phase === 'idle' && (
          <>
            <Card>
              <CardTitle>応募フォームの入力はありません</CardTitle>
              <Lead>
                会員証から次の5項目を提示するだけで応募できます。生年月日やお名前はお店に渡りません。
              </Lead>
              <Purposes>
                {PURPOSES.map(([k, v]) => (
                  <Purpose key={k}>
                    <PurposeKey>{k}</PurposeKey>
                    <PurposeVal>{v}</PurposeVal>
                  </Purpose>
                ))}
              </Purposes>
            </Card>
            <LoginButton onClick={start}>VESS Login で応募する</LoginButton>
            <Small style={{ textAlign: 'center' }}>
              当選はメールでご連絡します。応募は会員お一人さま1回までです。会員証をお持ちでない方は{' '}
              <Link href='/restaurant/register'>会員登録</Link> へ
            </Small>
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
            <Small>提示を確認しました。応募を受け付けています…</Small>
          </Card>
        )}

        {phase === 'done' && result && <ResultView result={result} labels={LABELS} onRetry={reset} />}
      </Shell>
    </>
  )
}

const Facts = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`
const Fact = styled.div`
  background: ${color.card};
  border: 1px solid ${color.line};
  border-radius: 6px;
  padding: 12px 14px;
  @media (max-width: 560px) {
    padding: 10px;
  }
`
const FactLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${color.accentDeep};
`
const FactValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-top: 2px;
  @media (max-width: 560px) {
    font-size: 12px;
  }
`
const Purposes = styled.dl`
  margin: 0;
  display: flex;
  flex-direction: column;
`
const Purpose = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid ${color.line};
  font-size: 13px;
  @media (max-width: 420px) {
    grid-template-columns: 1fr;
    gap: 2px;
  }
`
const PurposeKey = styled.dt`
  font-weight: 700;
`
const PurposeVal = styled.dd`
  margin: 0;
  color: ${color.sub};
`

export default CampaignPage
