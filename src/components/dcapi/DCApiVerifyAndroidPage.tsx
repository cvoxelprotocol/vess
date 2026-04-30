import Link from 'next/link'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { base64urlEncode, bytesToHex } from '@/lib/dcapi/base64url'
import { RequestedElement } from '@/lib/dcapi/cborBuilders'
import {
  MobileDocumentType,
  MOBILE_DOCUMENT_TYPES,
  MOBILE_DOCUMENT_TYPE_META,
} from '@/lib/dcapi/mobileDocumentType'
import { generateNonce, generateReaderKey } from '@/lib/dcapi/readerKey'

type Protocol = 'openid4vp-v1-unsigned' | 'openid4vp'
type ResponseMode = 'dc_api' | 'dc_api.jwt'

interface ReaderEncJwk {
  kty: 'EC'
  crv: 'P-256'
  x: string
  y: string
  use: 'enc'
  alg: 'ECDH-ES'
  kid: string
}

interface BuiltRequest {
  authorizationRequest: Record<string, unknown>
  authorizationRequestJson: string
  protocol: Protocol
  nonce: string
  nonceHex: string
  publicKeyHex: { x: string; y: string }
  readerJwk: ReaderEncJwk
  privateKey: CryptoKey
  dcqlId: string
}

const inputStyle: React.CSSProperties = {
  padding: 6,
  fontFamily: 'inherit',
  fontSize: 14,
}

export const DCApiVerifyAndroidPage: FC = () => {
  const [protocol, setProtocol] = useState<Protocol>('openid4vp-v1-unsigned')
  const [responseMode, setResponseMode] = useState<ResponseMode>('dc_api')
  const [docType, setDocType] = useState<MobileDocumentType>('org.iso.18013.5.1.mDL')
  const [nameSpace, setNameSpace] = useState<string>(
    MOBILE_DOCUMENT_TYPE_META['org.iso.18013.5.1.mDL'].defaultNamespace
  )
  const [elements, setElements] = useState<RequestedElement[]>(
    MOBILE_DOCUMENT_TYPE_META['org.iso.18013.5.1.mDL'].defaultElements.map((id) => ({
      identifier: id,
      intentToRetain: false,
    }))
  )
  const [clientId, setClientId] = useState<string>('vess-dc-api-demo-verifier')

  const [built, setBuilt] = useState<BuiltRequest | null>(null)
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
    setDcApiSupported(isSupported)
    addLog(`Digital Credentials API: ${isSupported ? 'サポート' : '未サポート'}`)
  }, [addLog])

  const onChangeDocType = (newDocType: MobileDocumentType) => {
    const meta = MOBILE_DOCUMENT_TYPE_META[newDocType]
    setDocType(newDocType)
    setNameSpace(meta.defaultNamespace)
    setElements(meta.defaultElements.map((id) => ({ identifier: id, intentToRetain: false })))
    setBuilt(null)
  }

  const updateElement = (index: number, patch: Partial<RequestedElement>) => {
    setElements((prev) => prev.map((el, i) => (i === index ? { ...el, ...patch } : el)))
  }

  const addElement = () =>
    setElements((prev) => [...prev, { identifier: '', intentToRetain: false }])

  const removeElement = (index: number) =>
    setElements((prev) => prev.filter((_, i) => i !== index))

  const buildRequest = async () => {
    setError(null)
    try {
      const sanitized = elements.filter((e) => e.identifier.trim().length > 0)
      if (sanitized.length === 0) {
        throw new Error('要求する element が空です')
      }

      addLog('リーダーエフェメラル鍵 (P-256) を生成中...')
      const readerKey = await generateReaderKey()
      const nonceBytes = generateNonce(16)
      const nonce = base64urlEncode(nonceBytes)
      const dcqlId = 'cred1'

      const readerJwk: ReaderEncJwk = {
        kty: 'EC',
        crv: 'P-256',
        x: base64urlEncode(readerKey.publicKeyXY.x),
        y: base64urlEncode(readerKey.publicKeyXY.y),
        use: 'enc',
        alg: 'ECDH-ES',
        kid: 'reader-1',
      }

      const dcqlQuery = {
        credentials: [
          {
            id: dcqlId,
            format: 'mso_mdoc',
            meta: { doctype_value: docType },
            claims: sanitized.map((el) => ({
              path: [nameSpace.trim(), el.identifier.trim()],
              ...(el.intentToRetain ? { intent_to_retain: true } : {}),
            })),
          },
        ],
      }

      const authorizationRequest: Record<string, unknown> = {
        response_type: 'vp_token',
        response_mode: responseMode,
        client_id: clientId.trim(),
        nonce,
        dcql_query: dcqlQuery,
      }

      if (responseMode === 'dc_api.jwt') {
        authorizationRequest.client_metadata = {
          jwks: { keys: [readerJwk] },
          authorization_encrypted_response_alg: 'ECDH-ES',
          authorization_encrypted_response_enc: 'A128GCM',
        }
      }

      const result: BuiltRequest = {
        authorizationRequest,
        authorizationRequestJson: JSON.stringify(authorizationRequest, null, 2),
        protocol,
        nonce,
        nonceHex: bytesToHex(nonceBytes),
        publicKeyHex: {
          x: bytesToHex(readerKey.publicKeyXY.x),
          y: bytesToHex(readerKey.publicKeyXY.y),
        },
        readerJwk,
        privateKey: readerKey.privateKey,
        dcqlId,
      }
      setBuilt(result)
      addLog(
        `Authorization Request 構築完了 (protocol=${protocol}, response_mode=${responseMode}, claims=${sanitized.length})`
      )
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      addLog(`構築エラー: ${message}`)
    }
  }

  const callDCApi = async () => {
    if (!built) return
    setIsLoading(true)
    setError(null)
    setCredentialResponse(null)
    try {
      addLog(`navigator.credentials.get() を呼び出し中... (${built.protocol})`)
      const credential = await navigator.credentials.get({
        mediation: 'required',
        digital: {
          requests: [
            {
              protocol: built.protocol,
              data: built.authorizationRequest,
            },
          ],
        },
      } as CredentialRequestOptions)
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
    setBuilt(null)
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
          if (value instanceof ArrayBuffer) {
            return base64urlEncode(new Uint8Array(value))
          }
          if (value instanceof Uint8Array) {
            return base64urlEncode(value)
          }
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
      <h1>Verifier — Android Chrome (openid4vp-v1-unsigned)</h1>
      <p style={{ color: '#666' }}>
        OpenID4VP DC API + DCQL で Android Wallet (本リポジトリ対向の{' '}
        <code>~/Workspace/dc-api-demo-android</code>) に提示要求を送る。 protocol は{' '}
        <code>openid4vp-v1-unsigned</code> / <code>openid4vp</code>。 iOS Safari では動かない。
      </p>

      <div style={{ marginBottom: 20 }}>
        <h2>機能検出</h2>
        <p>
          DC API:{' '}
          {dcApiSupported === null
            ? '確認中...'
            : dcApiSupported
            ? '✅ サポート'
            : '❌ 未サポート'}
        </p>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h2>1. Authorization Request の組み立て</h2>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>protocol</label>
          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value as Protocol)}
            style={{ ...inputStyle, width: '100%' }}
          >
            <option value="openid4vp-v1-unsigned">openid4vp-v1-unsigned (OpenID4VP 1.0)</option>
            <option value="openid4vp">openid4vp (Draft-24)</option>
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            response_mode
          </label>
          <select
            value={responseMode}
            onChange={(e) => setResponseMode(e.target.value as ResponseMode)}
            style={{ ...inputStyle, width: '100%' }}
          >
            <option value="dc_api">dc_api (平文応答)</option>
            <option value="dc_api.jwt">dc_api.jwt (JWE 応答 / ECDH-ES + A128GCM)</option>
          </select>
          <p style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
            ※ dc_api.jwt 時もこのページではレスポンスを復号せず raw のまま表示する。
            復号はバックエンドで実施する想定。
          </p>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>client_id</label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            style={{ ...inputStyle, width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>docType</label>
          <select
            value={docType}
            onChange={(e) => onChangeDocType(e.target.value as MobileDocumentType)}
            style={{ ...inputStyle, width: '100%' }}
          >
            {MOBILE_DOCUMENT_TYPES.map((dt) => (
              <option key={dt} value={dt}>
                {MOBILE_DOCUMENT_TYPE_META[dt].displayName} ({dt})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            nameSpace
          </label>
          <input
            type="text"
            value={nameSpace}
            onChange={(e) => setNameSpace(e.target.value)}
            style={{ ...inputStyle, width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            要求する element (DCQL claims)
          </label>
          {elements.map((el, i) => (
            <div
              key={i}
              style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'center' }}
            >
              <input
                type="text"
                value={el.identifier}
                onChange={(e) => updateElement(i, { identifier: e.target.value })}
                placeholder="element identifier"
                style={{ ...inputStyle, flex: 1 }}
              />
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}
                title="intent_to_retain — RPが値を保存するか"
              >
                <input
                  type="checkbox"
                  checked={el.intentToRetain}
                  onChange={(e) => updateElement(i, { intentToRetain: e.target.checked })}
                />
                retain
              </label>
              <button onClick={() => removeElement(i)} type="button">
                ✕
              </button>
            </div>
          ))}
          <button onClick={addElement} type="button" style={{ marginTop: 4 }}>
            + element 追加
          </button>
        </div>

        <button onClick={buildRequest} type="button">
          Request を構築
        </button>
      </section>

      {built && (
        <section style={{ marginBottom: 24 }}>
          <h2>2. 構築結果</h2>
          <details open style={{ marginBottom: 8 }}>
            <summary>
              <strong>Authorization Request</strong> (JSON / data フィールドの中身)
            </summary>
            <pre style={preStyle}>{built.authorizationRequestJson}</pre>
          </details>
          <details style={{ marginBottom: 8 }}>
            <summary>リーダー公開鍵 (P-256) / nonce</summary>
            <pre style={preStyle}>
              {`x:     ${built.publicKeyHex.x}\ny:     ${built.publicKeyHex.y}\nnonce: ${built.nonce} (hex: ${built.nonceHex})`}
            </pre>
          </details>

          <button onClick={callDCApi} disabled={isLoading || !dcApiSupported} type="button">
            {isLoading ? '処理中...' : 'navigator.credentials.get() を呼び出し'}
          </button>
          <button onClick={reset} type="button" style={{ marginLeft: 8 }}>
            リセット
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
          <p style={{ color: '#666', fontSize: 13 }}>
            JWE / DeviceResponse はこのページでは復号せず raw のまま表示。 検証はバックエンドで実施する想定。
          </p>
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

const preStyle: React.CSSProperties = {
  background: '#f5f5f5',
  padding: 10,
  overflow: 'auto',
  fontSize: 12,
  wordBreak: 'break-all',
  whiteSpace: 'pre-wrap',
}
