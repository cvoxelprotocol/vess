import Link from 'next/link'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { base64urlEncode, bytesToHex } from '@/lib/dcapi/base64url'
import { buildDeviceRequest, buildEncryptionInfo, RequestedElement } from '@/lib/dcapi/cborBuilders'
import { extractCredentialFields, stringifySafe } from '@/lib/dcapi/decodeResponse'
import {
  MobileDocumentType,
  MOBILE_DOCUMENT_TYPES,
  MOBILE_DOCUMENT_TYPE_META,
} from '@/lib/dcapi/mobileDocumentType'
import { generateNonce, generateReaderKey } from '@/lib/dcapi/readerKey'

interface BuiltRequest {
  deviceRequestBytes: Uint8Array
  encryptionInfoBytes: Uint8Array
  deviceRequestB64u: string
  encryptionInfoB64u: string
  nonceHex: string
  publicKeyHex: { x: string; y: string }
  privateKey: CryptoKey
}

const inputStyle: React.CSSProperties = {
  padding: 6,
  fontFamily: 'inherit',
  fontSize: 14,
}

export const DCApiVerifyIOSPage: FC = () => {
  const [docType, setDocType] = useState<MobileDocumentType>('org.iso.18013.5.1.mDL')
  const [elements, setElements] = useState<RequestedElement[]>(
    MOBILE_DOCUMENT_TYPE_META['org.iso.18013.5.1.mDL'].defaultElements.map((id) => ({
      namespace: MOBILE_DOCUMENT_TYPE_META['org.iso.18013.5.1.mDL'].defaultNamespace,
      identifier: id,
      intentToRetain: false,
    }))
  )

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
    setElements(
      meta.defaultElements.map((id) => ({
        namespace: meta.defaultNamespace,
        identifier: id,
        intentToRetain: false,
      }))
    )
    setBuilt(null)
  }

  const updateElement = (index: number, patch: Partial<RequestedElement>) => {
    setElements((prev) =>
      prev.map((el, i) => (i === index ? { ...el, ...patch } : el))
    )
  }

  const lastNamespace =
    elements[elements.length - 1]?.namespace ??
    MOBILE_DOCUMENT_TYPE_META[docType].defaultNamespace

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
      const nonce = generateNonce(16)

      addLog('DeviceRequest CBOR を構築中...')
      const deviceRequestBytes = buildDeviceRequest(docType, sanitized)

      addLog('EncryptionInfo CBOR を構築中...')
      const encryptionInfoBytes = buildEncryptionInfo(nonce, readerKey.publicKeyXY)

      const result: BuiltRequest = {
        deviceRequestBytes,
        encryptionInfoBytes,
        deviceRequestB64u: base64urlEncode(deviceRequestBytes),
        encryptionInfoB64u: base64urlEncode(encryptionInfoBytes),
        nonceHex: bytesToHex(nonce),
        publicKeyHex: {
          x: bytesToHex(readerKey.publicKeyXY.x),
          y: bytesToHex(readerKey.publicKeyXY.y),
        },
        privateKey: readerKey.privateKey,
      }
      setBuilt(result)
      addLog(
        `Request 構築完了 (deviceRequest=${deviceRequestBytes.length}B, encryptionInfo=${encryptionInfoBytes.length}B)`
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
      addLog('navigator.credentials.get() を呼び出し中... (org-iso-mdoc)')
      const credential = await navigator.credentials.get({
        mediation: 'required',
        digital: {
          requests: [
            {
              protocol: 'org-iso-mdoc',
              data: {
                deviceRequest: built.deviceRequestB64u,
                encryptionInfo: built.encryptionInfoB64u,
              },
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
    return {
      protocol: fields.protocol,
      dataJson: stringifySafe(fields.data),
    }
  }, [credentialResponse])

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui' }}>
      <div style={{ marginBottom: 12 }}>
        <Link href="/dcapi">← DC API メニュー</Link>
      </div>
      <h1>Verifier — iOS Safari (org-iso-mdoc)</h1>
      <p style={{ color: '#666' }}>
        iOS Safari の DC API ( ISO 18013-7 Annex C ) 経由で、 <code>IdentityDocumentProvider</code>{' '}
        extension を実装した任意の Wallet に提示要求を送る。複数の対応 Wallet が要件を満たすと iOS のシステム UI で選択ピッカーが出る。 protocol は{' '}
        <code>org-iso-mdoc</code>。 Android Chrome では動かない。
      </p>
      <p style={{ color: '#888', fontSize: 12 }}>
        動作確認用 Wallet ( 参考実装 ): <code>~/Workspace/dc-api-demo</code>
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
        <h2>1. DeviceRequest の組み立て</h2>

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
            要求する element ( namespace ごとにグルーピングされる )
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
                placeholder="namespace"
                style={{ ...inputStyle, flex: 1 }}
              />
              <input
                type="text"
                value={el.identifier}
                onChange={(e) => updateElement(i, { identifier: e.target.value })}
                placeholder="element identifier"
                style={{ ...inputStyle, flex: 1 }}
              />
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}
                title="intentToRetain — RPが値を保存するか"
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
              <strong>deviceRequest</strong> (base64url, {built.deviceRequestBytes.length}B)
            </summary>
            <pre style={preStyle}>{built.deviceRequestB64u}</pre>
          </details>
          <details style={{ marginBottom: 8 }}>
            <summary>
              <strong>deviceRequest</strong> (hex)
            </summary>
            <pre style={preStyle}>{bytesToHex(built.deviceRequestBytes)}</pre>
          </details>
          <details open style={{ marginBottom: 8 }}>
            <summary>
              <strong>encryptionInfo</strong> (base64url, {built.encryptionInfoBytes.length}B)
            </summary>
            <pre style={preStyle}>{built.encryptionInfoB64u}</pre>
          </details>
          <details style={{ marginBottom: 8 }}>
            <summary>
              <strong>リーダー公開鍵 (P-256) / nonce</strong>
            </summary>
            <pre style={preStyle}>
              {`x:     ${built.publicKeyHex.x}\ny:     ${built.publicKeyHex.y}\nnonce: ${built.nonceHex}`}
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
          <details open>
            <summary>
              <strong>credential.data</strong>
            </summary>
            <pre style={preStyle}>{credentialView.dataJson}</pre>
          </details>
          <p style={{ color: '#666', fontSize: 13, marginTop: 8 }}>
            HPKE 暗号化された CBOR DeviceResponse はこのページでは復号せず raw のまま表示。
            検証はバックエンドで実施する想定。
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
