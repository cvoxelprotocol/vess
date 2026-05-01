import Link from 'next/link'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { base64urlEncode } from '@/lib/dcapi/base64url'
import { parseCredentialOfferUri, ParsedCredentialOffer } from '@/lib/dcapi/issuanceOffer'

const inputStyle: React.CSSProperties = {
  padding: 8,
  fontFamily: 'inherit',
  fontSize: 14,
}

const preStyle: React.CSSProperties = {
  background: '#f5f5f5',
  padding: 10,
  overflow: 'auto',
  fontSize: 12,
  wordBreak: 'break-all',
  whiteSpace: 'pre-wrap',
}

export const DCApiIssuePage: FC = () => {
  const [offerUri, setOfferUri] = useState('')
  const [parsed, setParsed] = useState<ParsedCredentialOffer | null>(null)
  const [credentialResponse, setCredentialResponse] = useState<unknown>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dcApiSupported, setDcApiSupported] = useState<boolean | null>(null)

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }, [])

  useEffect(() => {
    const isSupported = typeof window !== 'undefined' && 'DigitalCredential' in window
    const hasCreate =
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      typeof navigator.credentials?.create === 'function'
    setDcApiSupported(isSupported && hasCreate)
    addLog(
      `Digital Credentials API: ${isSupported ? 'サポート' : '未サポート'} / credentials.create: ${
        hasCreate ? 'あり' : 'なし'
      }`
    )
  }, [addLog])

  const onParse = () => {
    setError(null)
    setParsed(null)
    try {
      const result = parseCredentialOfferUri(offerUri)
      setParsed(result)
      if (result.credentialOffer) {
        addLog('credential_offer (inline JSON) をパースしました')
      } else if (result.credentialOfferUri) {
        addLog(`credential_offer_uri を取得: ${result.credentialOfferUri}`)
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      addLog(`パースエラー: ${message}`)
    }
  }

  const callDCApi = async () => {
    if (!parsed) return
    setIsLoading(true)
    setError(null)
    setCredentialResponse(null)
    try {
      const data: Record<string, unknown> = {}
      if (parsed.credentialOffer) data.credential_offer = parsed.credentialOffer
      if (parsed.credentialOfferUri) data.credential_offer_uri = parsed.credentialOfferUri

      addLog('navigator.credentials.create() を呼び出し中... (openid4vci)')
      const credential = await navigator.credentials.create({
        mediation: 'required',
        digital: {
          requests: [
            {
              protocol: 'openid4vci',
              data,
            },
          ],
        },
      } as CredentialCreationOptions)
      addLog('Credential Response を受信しました')
      setCredentialResponse(credential)
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      addLog(`DC API エラー: ${message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setOfferUri('')
    setParsed(null)
    setCredentialResponse(null)
    setError(null)
    setLogs([])
  }

  const responseDisplay = useMemo(() => {
    if (credentialResponse === null) return null
    try {
      return JSON.stringify(
        credentialResponse,
        (_key, value) => {
          if (value instanceof ArrayBuffer) return base64urlEncode(new Uint8Array(value))
          if (value instanceof Uint8Array) return base64urlEncode(value)
          return value
        },
        2
      )
    } catch {
      return String(credentialResponse)
    }
  }, [credentialResponse])

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ marginBottom: 12 }}>
        <Link href="/dcapi">← DC API メニュー</Link>
      </div>
      <h1>Issuer (openid4vci over DC API)</h1>
      <p style={{ color: '#666' }}>
        OpenID4VCI の Credential Offer を DC API ( navigator.credentials.create ) 経由で OS の DC
        API に登録された任意の Wallet ( iOS Safari / Android Chrome ) に渡し、 mdoc
        を発行・保存させる。
      </p>

      <div style={{ marginBottom: 20 }}>
        <h2>機能検出</h2>
        <p>
          DC API:{' '}
          {dcApiSupported === null
            ? '確認中...'
            : dcApiSupported
            ? '✅ サポート'
            : '❌ 未サポート (navigator.credentials.create が無い可能性)'}
        </p>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h2>1. Credential Offer URI</h2>
        <p style={{ color: '#666', fontSize: 13 }}>
          Issuer から取得した Offer URI を貼り付け。形式例:
          <br />
          <code>openid-credential-offer://?credential_offer=...</code>
          <br />
          <code>openid-credential-offer://?credential_offer_uri=https://...</code>
        </p>
        <textarea
          value={offerUri}
          onChange={(e) => setOfferUri(e.target.value)}
          placeholder="openid-credential-offer://?credential_offer=..."
          rows={4}
          style={{ ...inputStyle, width: '100%', resize: 'vertical' }}
        />
        <div style={{ marginTop: 8 }}>
          <button onClick={onParse} type="button" disabled={!offerUri.trim()}>
            パース
          </button>
          <button onClick={reset} type="button" style={{ marginLeft: 8 }}>
            リセット
          </button>
        </div>
      </section>

      {parsed && (
        <section style={{ marginBottom: 24 }}>
          <h2>2. パース結果</h2>
          {parsed.credentialOffer && (
            <details open style={{ marginBottom: 8 }}>
              <summary>
                <strong>credential_offer</strong> (inline)
              </summary>
              <pre style={preStyle}>{JSON.stringify(parsed.credentialOffer, null, 2)}</pre>
            </details>
          )}
          {parsed.credentialOfferUri && (
            <details open style={{ marginBottom: 8 }}>
              <summary>
                <strong>credential_offer_uri</strong>
              </summary>
              <pre style={preStyle}>{parsed.credentialOfferUri}</pre>
            </details>
          )}

          <button onClick={callDCApi} disabled={isLoading || !dcApiSupported} type="button">
            {isLoading ? '処理中...' : 'navigator.credentials.create() を呼び出し'}
          </button>
        </section>
      )}

      {error && (
        <div style={{ color: 'red', marginBottom: 20 }}>
          <strong>エラー:</strong> {error}
        </div>
      )}

      {responseDisplay !== null && (
        <section style={{ marginBottom: 20 }}>
          <h2>3. Credential Response</h2>
          <pre style={preStyle}>{responseDisplay}</pre>
        </section>
      )}

      <section>
        <h2>ログ ({logs.length})</h2>
        <div style={{ background: '#f5f5f5', padding: 10, maxHeight: 300, overflow: 'auto' }}>
          {logs.length === 0 ? (
            <p>ログはまだありません</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} style={{ fontFamily: 'monospace', fontSize: 13 }}>
                {log}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
