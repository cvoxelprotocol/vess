import { useCallback, useEffect, useRef, useState } from 'react'
import type { DemoResult, MemberResult } from '@/lib/restaurant/types'

type Kind = 'campaign' | 'birthday' | 'login'
type ResultOf<K extends Kind> = K extends 'login' ? MemberResult : DemoResult
export type Phase = 'idle' | 'present' | 'processing' | 'done'

const RESULT_PATH: Record<Kind, string> = {
  campaign: '/api/restaurant/campaign-entry',
  birthday: '/api/restaurant/birthday-coupon',
  login: '/api/restaurant/member-login',
}

const post = async (url: string, body: unknown) => {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { ok: r.ok, json: await r.json().catch(() => ({})) }
}

// VP 要求の作成 → 検証待ちポーリング → サーバでの結果処理までを扱う
export function useVpFlow<K extends Kind>(kind: K) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [authReqUri, setAuthReqUri] = useState<string | null>(null)
  const [correlationId, setCorrelationId] = useState<string | null>(null)
  const [responseCode, setResponseCode] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<ResultOf<K> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const busy = useRef(false)

  const start = useCallback(async () => {
    setError(null)
    try {
      const { ok, json } = await post('/api/restaurant/create-vp-request', { kind })
      if (!ok || !json.authRequestURI) {
        setError('提示リクエストの作成に失敗しました。時間をおいて再度お試しください。')
        return
      }
      setAuthReqUri(json.authRequestURI)
      setCorrelationId(json.correlationId)
      setPhase('present')
    } catch (e: any) {
      setError(String(e?.message ?? e))
    }
  }, [kind])

  const reset = useCallback(() => {
    setPhase('idle')
    setAuthReqUri(null)
    setCorrelationId(null)
    setResponseCode(null)
    setStatus('')
    setResult(null)
    setError(null)
  }, [])

  // ウォレットからのリダイレクト戻り（?correlationId=...&response_code=...）を引き継ぐ
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cid = params.get('correlationId')
    if (!cid) return
    setCorrelationId(cid)
    setResponseCode(params.get('response_code'))
    setPhase('present')
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  useEffect(() => {
    if (phase !== 'present' || !correlationId) return
    const timer = setInterval(async () => {
      if (busy.current) return
      busy.current = true
      try {
        const { json } = await post('/api/restaurant/poll-vp-status', { kind, correlationId })
        setStatus(json.status ?? '')
        if (json.status === 'authorization_response_verified') {
          clearInterval(timer)
          setPhase('processing')
          // 開示値はクライアントで扱わず、サーバが correlationId から検証して取り出す
          const r = await post(RESULT_PATH[kind], { correlationId, responseCode })
          if (r.ok && (r.json.title || r.json.memberNo)) {
            setResult(r.json as ResultOf<K>)
            setPhase('done')
          } else {
            setError('提示内容を確認できませんでした。')
            setPhase('idle')
          }
        } else if (typeof json.status === 'string' && json.status.includes('error')) {
          clearInterval(timer)
          setError('提示の検証に失敗しました。')
          setPhase('idle')
        }
      } catch {
        // 一時的なエラーはポーリング継続
      } finally {
        busy.current = false
      }
    }, 2000)
    return () => clearInterval(timer)
  }, [phase, correlationId, responseCode, kind])

  return { phase, authReqUri, status, result, error, start, reset }
}
