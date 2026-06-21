import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Meta } from '@/components/layouts/Meta'
import { QRCode } from '@/components/sticker/QRCode'

type Phase = 'method' | 'verifying' | 'verified' | 'done'

// 本人確認の方法（デモ用モック）。実際の読み取り・認証は行わない。
const METHODS = [
  {
    id: 'mynumber',
    label: 'マイナンバーカードで本人確認',
    sub: 'ICチップを読み取って公的個人認証（推奨）',
  },
  {
    id: 'license',
    label: '運転免許証で本人確認',
    sub: '券面の撮影と顔写真の照合',
  },
]

const TicketVCAcquire: NextPage = () => {
  const [phase, setPhase] = useState<Phase>('method')
  const [method, setMethod] = useState<string | null>(null)
  const [name, setName] = useState('山田 太郎')
  const [loading, setLoading] = useState(false)
  const [offerUri, setOfferUri] = useState<string | null>(null)
  const [memberId, setMemberId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const methodLabel = METHODS.find((m) => m.id === method)?.label ?? '本人確認'

  const startVerify = (id: string) => {
    setMethod(id)
    setError(null)
    setPhase('verifying')
    // モック：実際の本人確認の代わりに数秒の処理を演出して確認済みにする
    setTimeout(() => setPhase('verified'), 1800)
  }

  const onIssue = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/tickets/issue-member-vc', {
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
      setPhase('done')
    } catch (e: any) {
      setError(String(e?.message ?? e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Meta pageTitle='会員VC取得 - Ticket Provider デモ' />
      <Wrapper>
        <BackLink href='/tickets'>← 一覧へ戻る</BackLink>
        <Brand>Ticket Provider</Brand>
        <Title>会員VCを取得</Title>

        {phase === 'method' && (
          <>
            <Desc>
              「本人確認済みVC」を取得します。まず Ticket Provider の本人確認で「本人であること」を証明してください。確認できた人だけが会員VCを受け取れます。
            </Desc>
            <MockNote>
              ※ 本人確認の方法はこのデモ用のモックです。実際のカード読み取りや認証は行いません（ボタンを押すと確認済みとして進みます）。
            </MockNote>
            <Label>本人確認の方法を選ぶ</Label>
            {METHODS.map((m) => (
              <MethodBtn key={m.id} onClick={() => startVerify(m.id)}>
                <MBTitle>{m.label}</MBTitle>
                <MBSub>{m.sub}</MBSub>
              </MethodBtn>
            ))}
          </>
        )}

        {phase === 'verifying' && (
          <Center>
            <Spinner />
            <Desc>{methodLabel}を実行中…</Desc>
            <Dim>本人確認情報を確認しています（デモ）</Dim>
          </Center>
        )}

        {phase === 'verified' && (
          <>
            <Center>
              <Ok>✓ 本人確認が完了しました</Ok>
              <Dim>{methodLabel}で本人であることを確認しました（デモ）</Dim>
            </Center>
            <Label>確認された氏名（デモのため編集できます）</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='山田 太郎'
            />
            <Primary onClick={onIssue} disabled={loading || !name}>
              {loading ? '発行中…' : 'この内容で会員VC（本人確認済みVC）を発行'}
            </Primary>
            {error && <Err>{error}</Err>}
          </>
        )}

        {phase === 'done' && offerUri && (
          <Result>
            <Ok>✓ 本人確認済み</Ok>
            <Desc>
              ウォレットアプリでこのQRを読み取り、会員VC（本人確認済みVC）を受け取ってください。
            </Desc>
            <QrBox>
              <QRCode url={offerUri} width={260} />
            </QrBox>
            <OpenLink href={offerUri}>ウォレットを開いて会員VCを受け取る</OpenLink>
            <UriBox>{offerUri}</UriBox>
            {memberId && <Mono>会員ID: {memberId}</Mono>}
            <Secondary href='/tickets/purchase'>次へ：チケット購入</Secondary>
          </Result>
        )}
      </Wrapper>
    </>
  )
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`
const BackLink = styled(Link)`
  align-self: flex-start;
  font-size: 13px;
  color: #2d5bd6;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`
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
  color: #2d5bd6;
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
const MockNote = styled.div`
  font-size: 12px;
  line-height: 1.6;
  color: #8a5a00;
  background: #fff7e6;
  border: 1px solid #ffe0a3;
  border-radius: 10px;
  padding: 10px 12px;
`
const Label = styled.label`
  font-size: 12px;
  opacity: 0.7;
`
const MethodBtn = styled.button`
  text-align: left;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(45, 91, 214, 0.35);
  background: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 3px;
  &:hover {
    background: rgba(45, 91, 214, 0.06);
    border-color: #2d5bd6;
  }
`
const MBTitle = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: #1c2733;
`
const MBSub = styled.div`
  font-size: 12px;
  opacity: 0.7;
`
const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
`
const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid rgba(45, 91, 214, 0.2);
  border-top-color: #2d5bd6;
  border-radius: 999px;
  animation: ${spin} 0.8s linear infinite;
`
const Ok = styled.div`
  color: #2e7d4f;
  font-weight: 800;
  font-size: 18px;
`
const Dim = styled.div`
  font-size: 12px;
  opacity: 0.7;
  text-align: center;
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
  background: #2d5bd6;
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
  color: #2d5bd6;
  font-weight: 700;
  text-decoration: none;
`
const OpenLink = styled.a`
  margin-top: 4px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #2d5bd6;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  font-size: 14px;
`
const UriBox = styled.code`
  width: 100%;
  word-break: break-all;
  font-size: 10px;
  color: #5b6b75;
  background: rgba(0, 0, 0, 0.04);
  padding: 8px;
  border-radius: 8px;
`
const Err = styled.div`
  color: #c0392b;
  font-size: 13px;
`

export default TicketVCAcquire
