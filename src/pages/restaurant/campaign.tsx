import styled from '@emotion/styled'
import { NextPage } from 'next'
import { Meta } from '@/components/layouts/Meta'
import {
  Body,
  Card,
  CardTitle,
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

const LABELS: Record<string, string> = {
  age_over_20: '20歳以上',
  age_band: '年代',
  prefecture: '都道府県',
  email: 'メールアドレス',
}

const CampaignPage: NextPage = () => {
  const { phase, authReqUri, status, result, error, start, reset } = useVpFlow('campaign')

  return (
    <>
      <Meta pageTitle={`キャンペーン応募 - ${SHOP_NAME}（デモ）`} />
      <Shell>
        <Prize>
          <PrizeLabel>開店10周年キャンペーン</PrizeLabel>
          <PrizeTitle>生ビール1年分が当たる！</PrizeTitle>
          <PrizeText>抽選で10名さま。20歳以上の方が対象です。</PrizeText>
        </Prize>

        {phase === 'idle' && (
          <>
            <Title>キャンペーンに応募する</Title>
            <Lead>
              応募フォームへの入力はありません。VESS Login で次の4項目を提示するだけで応募できます。生年月日や氏名はお店に渡りません。
            </Lead>
            <Card>
              <CardTitle>お店が使う目的</CardTitle>
              <Body>
                ・20歳以上か：応募資格の確認
                <br />
                ・年代と都道府県：応募数の集計（個人とは結び付けません）
                <br />
                ・メールアドレス：確認メールと当選のご連絡（保存しません）
              </Body>
            </Card>
            <Primary onClick={start}>VESS Login で応募する</Primary>
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

const Prize = styled.div`
  border-radius: 16px;
  padding: 22px 20px;
  color: #3b2a00;
  background: linear-gradient(135deg, #ffd66b, #f4a93a);
  border: 1px solid rgba(0, 0, 0, 0.06);
`
const PrizeLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${color.accent};
`
const PrizeTitle = styled.div`
  font-size: 26px;
  font-weight: 900;
  margin: 4px 0;
`
const PrizeText = styled.div`
  font-size: 13px;
`

export default CampaignPage
