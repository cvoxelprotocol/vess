import { FC, useEffect, useState, useCallback } from 'react'

interface DigitalCredentialRequest {
  protocol: string
  data: string | Record<string, unknown>
}

export const DCApiTestPage: FC = () => {
  const [dcApiSupported, setDcApiSupported] = useState<boolean | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [credentialResponse, setCredentialResponse] = useState<unknown>(null)
  const [authRequestUri, setAuthRequestUri] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }, [])

  useEffect(() => {
    const isSupported = typeof window !== 'undefined' && 'DigitalCredential' in window
    setDcApiSupported(isSupported)
    addLog(`Digital Credentials API: ${isSupported ? 'サポート' : '未サポート'}`)
  }, [addLog])

  const callDCApi = async () => {
    if (!authRequestUri) {
      setError('Authorization Request URI を入力してください')
      return
    }

    setIsLoading(true)
    setError(null)
    addLog('DC API 呼び出しを開始...')

    try {
      const params = new URLSearchParams(authRequestUri.replace(/^openid4vp:\/\/\?/, ''))
      const dataObj: Record<string, string> = {}
      params.forEach((value, key) => {
        dataObj[key] = value
      })

      addLog(`client_id: ${dataObj.client_id}`)
      addLog(`request_uri: ${dataObj.request_uri}`)

      const requests: DigitalCredentialRequest[] = [
        { protocol: 'openid4vp', data: dataObj },
      ]

      addLog('navigator.credentials.get() を呼び出し中...')
      const credential = await navigator.credentials.get({
        digital: { requests },
      } as CredentialRequestOptions)

      addLog('Credential Response を受信しました')
      setCredentialResponse(credential)
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e)
      addLog(`エラー: ${errorMessage}`)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
    setError(null)
    setCredentialResponse(null)
    setAuthRequestUri('')
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>Digital Credentials API テスト</h1>

      <div style={{ marginBottom: 20 }}>
        <h2>機能検出</h2>
        <p>DC API: {dcApiSupported === null ? '確認中...' : dcApiSupported ? '✅ サポート' : '❌ 未サポート'}</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h2>Authorization Request URI</h2>
        <input
          type="text"
          value={authRequestUri}
          onChange={(e) => setAuthRequestUri(e.target.value)}
          placeholder="openid4vp://?client_id=...&request_uri=..."
          style={{ width: '100%', padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={callDCApi} disabled={isLoading || !authRequestUri || !dcApiSupported}>
          {isLoading ? '処理中...' : 'DC API 呼び出し'}
        </button>
        <button onClick={clearLogs} style={{ marginLeft: 8 }}>
          リセット
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: 20 }}>
          <strong>エラー:</strong> {error}
        </div>
      )}

      {credentialResponse !== null && (
        <div style={{ marginBottom: 20 }}>
          <h2>Credential Response</h2>
          <pre style={{ background: '#f5f5f5', padding: 10, overflow: 'auto' }}>
            {JSON.stringify(credentialResponse, null, 2)}
          </pre>
        </div>
      )}

      <div>
        <h2>ログ ({logs.length})</h2>
        <div style={{ background: '#f5f5f5', padding: 10, maxHeight: 300, overflow: 'auto' }}>
          {logs.length === 0 ? (
            <p>ログはまだありません</p>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  )
}
