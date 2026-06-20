import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useState } from 'react'
import { Meta } from '@/components/layouts/Meta'
import { QRCode } from '@/components/sticker/QRCode'

const EplusRegister: NextPage = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [offerUri, setOfferUri] = useState<string | null>(null)
  const [memberId, setMemberId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onRegister = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/eplus/issue-member-vc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const json = await res.json()
      if (!res.ok || !json.uri) {
        setError(json.error ?? '会員VCの発行に失敗しました')
        return
      }
      setOfferUri(json.uri)
      setMemberId(json.memberId ?? null)
    } catch (e: any) {
      setError(String(e?.message ?? e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Meta pageTitle='会員登録 - eplus デモ' />
      <Wrapper>
        <Brand>eplus</Brand>
        <Title>会員登録</Title>
        {!offerUri ? (
          <>
            <Desc>お名前を入力して登録すると、会員VCをウォレットに発行します。</Desc>
            <Label>お名前</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='山田 太郎'
            />
            <Primary onClick={onRegister} disabled={loading || !name}>
              {loading ? '発行中…' : '会員登録して会員VCを発行'}
            </Primary>
            {error && <Err>{error}</Err>}
          </>
        ) : (
          <Result>
            <Desc>ウォレットアプリでこのQRを読み取り、会員VCを受け取ってください。</Desc>
            <QrBox>
              <QRCode url={offerUri} width={260} />
            </QrBox>
            {memberId && <Mono>会員ID: {memberId}</Mono>}
            <Secondary href='/eplus/purchase'>次へ：チケット購入</Secondary>
          </Result>
        )}
      </Wrapper>
    </>
  )
}

const Wrapper = styled.main`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`
const Brand = styled.div`
  font-weight: 800;
  color: #d6006c;
`
const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`
const Desc = styled.p`
  font-size: 13px;
  opacity: 0.8;
  line-height: 1.7;
`
const Label = styled.label`
  font-size: 12px;
  opacity: 0.7;
`
const Input = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  font-size: 16px;
`
const Primary = styled.button`
  margin-top: 8px;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: #d6006c;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  &:disabled {
    opacity: 0.5;
  }
`
const Result = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`
const QrBox = styled.div`
  padding: 16px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`
const Mono = styled.div`
  font-family: monospace;
  font-size: 12px;
  opacity: 0.7;
`
const Secondary = styled.a`
  margin-top: 8px;
  color: #d6006c;
  font-weight: 700;
  text-decoration: none;
`
const Err = styled.div`
  color: #c0392b;
  font-size: 13px;
`

export default EplusRegister
