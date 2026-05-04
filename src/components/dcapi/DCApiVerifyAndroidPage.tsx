import {
  buildPresentationRequestAndroid,
  bytesToHex,
  decodeAndroidPresentationResponse,
  formatElementValue,
  stringifySafe,
  type AndroidPresentationProtocol,
  type AndroidPresentationRequest,
  type AndroidResponseMode,
  type RequestedElement,
} from 'dcapi-issuer-verifier'
import Link from 'next/link'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { MOBILE_DOCUMENT_TYPES, MOBILE_DOCUMENT_TYPE_META } from '@/lib/dcapi/mobileDocumentType'

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

const inputStyle: React.CSSProperties = {
  padding: 6,
  fontFamily: 'inherit',
  fontSize: 14,
}

export const DCApiVerifyAndroidPage: FC = () => {
  const [protocol, setProtocol] = useState<AndroidPresentationProtocol>('openid4vp-v1-unsigned')
  const [responseMode, setResponseMode] = useState<AndroidResponseMode>('dc_api')
  const [docType, setDocType] = useState<string>('org.iso.18013.5.1.mDL')
  const [elements, setElements] = useState<RequestedElement[]>(
    MOBILE_DOCUMENT_TYPE_META['org.iso.18013.5.1.mDL'].defaultElements.map((id) => ({
      namespace: MOBILE_DOCUMENT_TYPE_META['org.iso.18013.5.1.mDL'].defaultNamespace,
      identifier: id,
      intentToRetain: false,
    }))
  )
  // OpenID4VP DC API の client_id は Verifier ( このページ自身 ) の identity。
  // OpenID4VP 1.0 の web-origin scheme に従い、 ページの origin から自動導出する。
  const [clientId, setClientId] = useState<string>('')

  const [built, setBuilt] = useState<AndroidPresentationRequest | null>(null)
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
    if (typeof window !== 'undefined') {
      setClientId(`web-origin:${window.location.origin}`)
    }
  }, [addLog])

  const onChangeDocType = (newDocType: string) => {
    setDocType(newDocType)
    const preset = ANDROID_DOC_TYPE_PRESETS.find((p) => p.docType === newDocType)
    if (preset) {
      setElements(
        preset.elements.map((id: string) => ({
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

  const submit = async () => {
    setError(null)
    setIsLoading(true)
    setCredentialResponse(null)
    try {
      addLog('リーダーエフェメラル鍵生成 + Authorization Request 構築中...')
      const result = await buildPresentationRequestAndroid({
        protocol,
        responseMode,
        docType,
        elements,
        clientId,
      })
      setBuilt(result)
      addLog(
        `Authorization Request 構築完了 (protocol=${protocol}, response_mode=${responseMode})`
      )

      addLog(`navigator.credentials.get() を呼び出し中... (${result.protocol})`)
      const credential = await navigator.credentials.get({
        mediation: 'required',
        digital: {
          requests: [{ protocol: result.protocol, data: result.data }],
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
    return decodeAndroidPresentationResponse(credentialResponse)
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
            onChange={(e) => setProtocol(e.target.value as AndroidPresentationProtocol)}
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
            onChange={(e) => setResponseMode(e.target.value as AndroidResponseMode)}
            style={{ ...inputStyle, width: '100%' }}
          >
            <option value="dc_api">dc_api (平文応答)</option>
            <option value="dc_api.jwt">dc_api.jwt (JWE 応答 / ECDH-ES + A128GCM)</option>
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>client_id</label>
          <code
            style={{
              display: 'block',
              padding: 6,
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 13,
              wordBreak: 'break-all',
            }}
          >
            {clientId || '(マウント待ち)'}
          </code>
          <p style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
            OpenID4VP の <code>client_id</code> は Verifier ( = このページ ) の identity。
            DC API では <code>web-origin:&lt;origin&gt;</code> スキームに従い、 ページの origin から自動生成する。
          </p>
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

        <button onClick={submit} disabled={isLoading || !dcApiSupported} type="button">
          {isLoading ? '処理中...' : 'navigator.credentials.get() を呼び出し'}
        </button>
        <button onClick={reset} type="button" style={{ marginLeft: 8 }}>
          リセット
        </button>
      </section>

      {built && (
        <section style={{ marginBottom: 24 }}>
          <h2>2. 構築結果</h2>
          <details style={{ marginBottom: 8 }}>
            <summary>
              <strong>Authorization Request</strong> (JSON / data フィールドの中身)
            </summary>
            <pre style={preStyle}>{built.authorizationRequestJson}</pre>
          </details>
          <details style={{ marginBottom: 8 }}>
            <summary>
              <strong>リーダー公開鍵 (P-256) / nonce</strong>
            </summary>
            <pre style={preStyle}>
              {`x:     ${bytesToHex(built.readerKey.publicKeyXY.x)}\ny:     ${bytesToHex(
                built.readerKey.publicKeyXY.y
              )}\nnonce: ${built.nonce} (hex: ${bytesToHex(built.nonceBytes)})`}
            </pre>
          </details>
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
              {credentialView.decodedVpTokens.map((vp, idx) => (
                <div
                  key={`${vp.credentialId}-${vp.index ?? idx}`}
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
                    {vp.index !== undefined && (
                      <span style={{ marginLeft: 6, color: '#666', fontSize: 12 }}>
                        ( vp_token[{vp.index}] )
                      </span>
                    )}
                  </div>
                  {vp.error ? (
                    <div style={{ color: '#c62828', fontSize: 13 }}>{vp.error}</div>
                  ) : (
                    <>
                      {vp.mdocDocuments.length > 0 && (
                        <div style={{ marginBottom: 8 }}>
                          <strong>提示された element ( IssuerSignedItem )</strong>
                          {vp.mdocDocuments.map((doc) => (
                            <div
                              key={doc.docType}
                              style={{
                                marginTop: 6,
                                padding: 8,
                                background: '#fafafa',
                                border: '1px solid #e0e0e0',
                                borderRadius: 4,
                              }}
                            >
                              <div style={{ marginBottom: 4 }}>
                                <span style={{ color: '#666', fontSize: 12 }}>docType:</span>{' '}
                                <code>{doc.docType}</code>
                              </div>
                              {Object.entries(doc.namespaces).map(([ns, claims]) => (
                                <div key={ns} style={{ marginTop: 4 }}>
                                  <div style={{ color: '#666', fontSize: 12 }}>
                                    namespace: <code>{ns}</code>
                                  </div>
                                  <table
                                    style={{
                                      borderCollapse: 'collapse',
                                      fontSize: 13,
                                      marginTop: 2,
                                    }}
                                  >
                                    <tbody>
                                      {claims.map((c) => (
                                        <tr key={c.elementIdentifier}>
                                          <td
                                            style={{
                                              padding: '2px 8px 2px 0',
                                              verticalAlign: 'top',
                                              fontFamily: 'monospace',
                                              whiteSpace: 'nowrap',
                                            }}
                                          >
                                            {c.elementIdentifier}
                                          </td>
                                          <td
                                            style={{
                                              padding: '2px 0',
                                              verticalAlign: 'top',
                                              fontFamily: 'monospace',
                                              wordBreak: 'break-all',
                                            }}
                                          >
                                            {formatElementValue(c.elementValue)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                      <details>
                        <summary>
                          <strong>DeviceResponse (CBOR デコード) — 全体</strong>
                        </summary>
                        <pre style={preStyle}>{stringifySafe(vp.decoded)}</pre>
                      </details>
                    </>
                  )}
                  <details style={{ marginTop: 6 }}>
                    <summary>
                      <strong>raw (base64url)</strong>
                    </summary>
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
            <pre style={preStyle}>{stringifySafe(credentialView.data)}</pre>
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
