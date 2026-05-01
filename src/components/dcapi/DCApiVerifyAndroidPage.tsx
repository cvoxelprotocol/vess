import Link from 'next/link'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { base64urlEncode, bytesToHex } from '@/lib/dcapi/base64url'
import { RequestedElement } from '@/lib/dcapi/cborBuilders'
import {
  decodeOpenId4VpResponse,
  DecodedVpToken,
  extractCredentialFields,
  stringifySafe,
} from '@/lib/dcapi/decodeResponse'
import { MOBILE_DOCUMENT_TYPES, MOBILE_DOCUMENT_TYPE_META } from '@/lib/dcapi/mobileDocumentType'
import { generateNonce, generateReaderKey } from '@/lib/dcapi/readerKey'

type Protocol = 'openid4vp-v1-unsigned' | 'openid4vp'
type ResponseMode = 'dc_api' | 'dc_api.jwt'

// Android Wallet 側で扱う独自 docType。 ISO 標準 (MOBILE_DOCUMENT_TYPES) に
// 加えて、 social プロトコルなどのカスタムも自由入力できる。
const ANDROID_DOC_TYPE_PRESETS: { docType: string; namespace: string; elements: string[] }[] = [
  ...MOBILE_DOCUMENT_TYPES.map((dt) => ({
    docType: dt,
    namespace: MOBILE_DOCUMENT_TYPE_META[dt].defaultNamespace,
    elements: MOBILE_DOCUMENT_TYPE_META[dt].defaultElements,
  })),
  {
    docType: 'com.vess-api.dev.testoda.mdoc.original.B',
    namespace: 'name',
    elements: ['familyName'],
  },
]

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
  const [docType, setDocType] = useState<string>('org.iso.18013.5.1.mDL')
  const [elements, setElements] = useState<RequestedElement[]>(
    MOBILE_DOCUMENT_TYPE_META['org.iso.18013.5.1.mDL'].defaultElements.map((id) => ({
      namespace: MOBILE_DOCUMENT_TYPE_META['org.iso.18013.5.1.mDL'].defaultNamespace,
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

  const onChangeDocType = (newDocType: string) => {
    setDocType(newDocType)
    const preset = ANDROID_DOC_TYPE_PRESETS.find((p) => p.docType === newDocType)
    if (preset) {
      setElements(
        preset.elements.map((id) => ({
          namespace: preset.namespace,
          identifier: id,
          intentToRetain: false,
        }))
      )
    }
    setBuilt(null)
  }

  const updateElement = (index: number, patch: Partial<RequestedElement>) => {
    setElements((prev) => prev.map((el, i) => (i === index ? { ...el, ...patch } : el)))
  }

  const lastNamespace =
    elements[elements.length - 1]?.namespace ??
    ANDROID_DOC_TYPE_PRESETS.find((p) => p.docType === docType)?.namespace ??
    ''

  const addElement = () =>
    setElements((prev) => [
      ...prev,
      { namespace: lastNamespace, identifier: '', intentToRetain: false },
    ])

  const removeElement = (index: number) =>
    setElements((prev) => prev.filter((_, i) => i !== index))

  const buildRequest = async () => {
    setError(null)
    try {
      const sanitized = elements
        .filter((e) => e.identifier.trim().length > 0 && e.namespace.trim().length > 0)
        .map((e) => ({
          namespace: e.namespace.trim(),
          identifier: e.identifier.trim(),
          intentToRetain: e.intentToRetain,
        }))
      if (sanitized.length === 0) {
        throw new Error('要求する element が空です ( namespace と identifier 両方必須 )')
      }

      addLog('リーダーエフェメラル鍵 (P-256) を生成中...')
      const readerKey = await generateReaderKey()
      const nonceBytes = generateNonce(16)
      const nonce = base64urlEncode(nonceBytes)
      const dcqlId = docType.replace(/\./g, '_')

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
            require_cryptographic_holder_binding: true,
            multiple: false,
            format: 'mso_mdoc',
            claims: sanitized.map((el) => ({
              id: `${el.namespace}_${el.identifier}`,
              path: [el.namespace, el.identifier],
              ...(el.intentToRetain ? { intent_to_retain: true } : {}),
            })),
            meta: { doctype_value: docType },
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

  const credentialView = useMemo(() => {
    if (credentialResponse === null) return null
    const fields = extractCredentialFields(credentialResponse)
    const decoded: DecodedVpToken[] | null = decodeOpenId4VpResponse(fields.data)
    return {
      protocol: fields.protocol,
      dataJson: stringifySafe(fields.data),
      decodedVpTokens: decoded,
    }
  }, [credentialResponse])

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ marginBottom: 12 }}>
        <Link href="/dcapi">← DC API メニュー</Link>
      </div>
      <h1>Verifier — Android Chrome (openid4vp-v1-unsigned)</h1>
      <p style={{ color: '#666' }}>
        Android Chrome の DC API 経由で、 OpenID4VP + DCQL に対応した任意の Wallet に提示要求を送る。
        端末に複数の対応 Wallet が入っていれば Android のシステム UI で選択ピッカーが出る。 protocol は{' '}
        <code>openid4vp-v1-unsigned</code> / <code>openid4vp</code>。 iOS Safari では動かない。
      </p>
      <p style={{ color: '#888', fontSize: 12 }}>
        動作確認用 Wallet ( 参考実装 ): <code>~/Workspace/dc-api-demo-android</code>
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
          <input
            type="text"
            list="android-doctype-suggestions"
            value={docType}
            onChange={(e) => onChangeDocType(e.target.value)}
            placeholder="例: org.iso.18013.5.1.mDL / com.vess-api.dev.testoda.mdoc.original.B"
            style={{ ...inputStyle, width: '100%' }}
          />
          <datalist id="android-doctype-suggestions">
            {ANDROID_DOC_TYPE_PRESETS.map((p) => (
              <option key={p.docType} value={p.docType} />
            ))}
          </datalist>
          <p style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
            プリセットを選ぶと element 行 ( namespace / identifier ) を自動補完。カスタム値も入力可能。
          </p>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
            要求する element (DCQL claims) — claim ごとに namespace を別にできる
          </label>
          {elements.map((el, i) => (
            <div
              key={i}
              style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'center' }}
            >
              <input
                type="text"
                value={el.namespace}
                onChange={(e) => updateElement(i, { namespace: e.target.value })}
                placeholder="namespace (path[0])"
                style={{ ...inputStyle, flex: 1 }}
              />
              <input
                type="text"
                value={el.identifier}
                onChange={(e) => updateElement(i, { identifier: e.target.value })}
                placeholder="element (path[1])"
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

      {credentialView && (
        <section
          style={{
            marginBottom: 20,
            padding: 16,
            border: '2px solid #2e7d32',
            borderRadius: 8,
            background: '#f1f8e9',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#2e7d32' }}>3. Credential Response</h2>
          <p style={{ margin: '4px 0 12px', fontWeight: 'bold' }}>
            ✅ VC 提示が完了しました ( protocol:{' '}
            <code>{credentialView.protocol ?? '(unknown)'}</code> )
          </p>

          {built?.authorizationRequest.response_mode === 'dc_api.jwt' &&
            (!credentialView.decodedVpTokens || credentialView.decodedVpTokens.length === 0) && (
              <div
                style={{
                  marginBottom: 12,
                  padding: 8,
                  background: '#fffde7',
                  border: '1px solid #fbc02d',
                  borderRadius: 4,
                  fontSize: 13,
                }}
              >
                <strong>ℹ️ response_mode = dc_api.jwt</strong> のため、応答全体は JWE で
                暗号化されており、このページでは復号しないので element 値は見えません。
                復号はリーダー秘密鍵を持つバックエンドで実施する想定です。下の{' '}
                <code>credential.data</code> ( raw ) が JWE 本体です。
              </div>
            )}

          {credentialView.decodedVpTokens && credentialView.decodedVpTokens.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <h3 style={{ marginBottom: 8 }}>提示された Credentials</h3>
              {credentialView.decodedVpTokens.map((vp) => (
                <div
                  key={vp.credentialId}
                  style={{
                    marginBottom: 12,
                    padding: 10,
                    background: '#fff',
                    border: '1px solid #c8e6c9',
                    borderRadius: 4,
                  }}
                >
                  <div style={{ marginBottom: 6 }}>
                    <strong>credential id:</strong> <code>{vp.credentialId}</code>
                  </div>
                  {vp.error ? (
                    <div style={{ color: '#c62828', fontSize: 13 }}>{vp.error}</div>
                  ) : (
                    <details open>
                      <summary>
                        <strong>DeviceResponse (CBOR デコード)</strong>
                      </summary>
                      <pre style={preStyle}>{stringifySafe(vp.decoded)}</pre>
                    </details>
                  )}
                  <details style={{ marginTop: 6 }}>
                    <summary>raw (base64url)</summary>
                    <pre style={preStyle}>{vp.rawBase64Url}</pre>
                  </details>
                </div>
              ))}
            </div>
          )}

          <details>
            <summary>
              <strong>credential.data</strong> (raw)
            </summary>
            <pre style={preStyle}>{credentialView.dataJson}</pre>
          </details>
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
