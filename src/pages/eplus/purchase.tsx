import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { Meta } from '@/components/layouts/Meta'
import { QRCode } from '@/components/sticker/QRCode'

type Phase = 'idle' | 'present' | 'issuing' | 'ticket'

const EplusPurchase: NextPage = () => {
  const [phase, setPhase] = useState<Phase>('idle')
  const [authReqUri, setAuthReqUri] = useState<string | null>(null)
  const [correlationId, setCorrelationId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')
  const [ticketUri, setTicketUri] = useState<string | null>(null)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const busy = useRef(false)

  const startPurchase = async () => {
    setError(null)
    try {
      const res = await fetch('/api/eplus/create-vp-request', { method: 'POST' })
      const json = await res.json()
      if (!res.ok || !json.authRequestURI) {
        setError(json.error ?? '会員VP要求の作成に失敗しました')
        return
      }
      setAuthReqUri(json.authRequestURI)
      setCorrelationId(json.correlationId)
      setPhase('present')
    } catch (e: any) {
      setError(String(e?.message ?? e))
    }
  }

  // 会員VP の検証完了をポーリングし、成功したらチケットVCを発行
  useEffect(() => {
    if (phase !== 'present' || !correlationId) return
    const timer = setInterval(async () => {
      if (busy.current) return
      busy.current = true
      try {
        const r = await fetch('/api/eplus/poll-vp-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correlationId }),
        })
        const j = await r.json()
        setStatus(j.status ?? '')
        if (j.status === 'authorization_response_verified') {
          clearInterval(timer)
          setPhase('issuing')
          const claims = j.verifiedData?.credential_claims?.[0]?.claims ?? {}
          const tr = await fetch('/api/eplus/issue-ticket-vc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ memberId: claims.member_id, eventName: 'DEMO LIVE 2026', seat: 'A-1' }),
          })
          const tj = await tr.json()
          if (tj.uri) {
            setTicketUri(tj.uri)
            setTicketId(tj.ticketId ?? null)
            setPhase('ticket')
          } else {
            setError(tj.error ?? 'チケットVCの発行に失敗しました')
            setPhase('present')
          }
        } else if (typeof j.status === 'string' && j.status.includes('error')) {
          clearInterval(timer)
          setError('会員VPの検証に失敗しました')
        }
      } catch (e: any) {
        // 一時的なエラーはポーリング継続
      } finally {
        busy.current = false
      }
    }, 2000)
    return () => clearInterval(timer)
  }, [phase, correlationId])

  return (
    <>
      <Meta pageTitle='チケット購入 - eplus デモ' />
      <Wrapper>
        <Brand>eplus</Brand>
        <Title>チケット購入</Title>
        <EventCard>
          <EventName>DEMO LIVE 2026</EventName>
          <EventMeta>2026.09.01 19:00 / 席 A-1 / ¥9,800</EventMeta>
        </EventCard>

        {phase === 'idle' && (
          <>
            <Desc>購入には会員VCの提示が必要です。手続きを開始すると会員VPの提示QRを表示します。</Desc>
            <Primary onClick={startPurchase}>購入手続きへ（会員VPを提示）</Primary>
            {error && <Err>{error}</Err>}
          </>
        )}

        {phase === 'present' && authReqUri && (
          <Center>
            <Desc>ウォレットでこのQRを読み取り、会員VCを提示してください。</Desc>
            <QrBox>
              <QRCode url={authReqUri} width={260} />
            </QrBox>
            <StatusLine>検証待ち… {status && `(${status})`}</StatusLine>
            {error && <Err>{error}</Err>}
          </Center>
        )}

        {phase === 'issuing' && (
          <Center>
            <Desc>会員確認OK。チケットVCを発行しています…</Desc>
          </Center>
        )}

        {phase === 'ticket' && ticketUri && (
          <Center>
            <Ok>✓ 会員確認OK・購入完了</Ok>
            <Desc>ウォレットでこのQRを読み取り、チケットVCを受け取ってください。</Desc>
            <QrBox>
              <QRCode url={ticketUri} width={260} />
            </QrBox>
            {ticketId && <Mono>チケットID: {ticketId}</Mono>}
            <Note>入場時は、会員VCとチケットVCの2つを会場ゲートで提示します。</Note>
          </Center>
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
const EventCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #d6006c, #7a0040);
  color: #fff;
`
const EventName = styled.div`
  font-weight: 800;
  font-size: 18px;
`
const EventMeta = styled.div`
  font-size: 12px;
  opacity: 0.9;
  margin-top: 4px;
`
const Desc = styled.p`
  font-size: 13px;
  opacity: 0.8;
  line-height: 1.7;
`
const Primary = styled.button`
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: #d6006c;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
`
const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`
const QrBox = styled.div`
  padding: 16px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`
const StatusLine = styled.div`
  font-size: 12px;
  opacity: 0.6;
`
const Ok = styled.div`
  color: #2e7d4f;
  font-weight: 800;
  font-size: 18px;
`
const Mono = styled.div`
  font-family: monospace;
  font-size: 12px;
  opacity: 0.7;
`
const Note = styled.div`
  font-size: 12px;
  opacity: 0.7;
  text-align: center;
`
const Err = styled.div`
  color: #c0392b;
  font-size: 13px;
`

export default EplusPurchase
