import styled from '@emotion/styled'
import { Button, Text, TextInput, useKai } from 'kai-kit'
import { FC, useEffect, useState, useCallback } from 'react'
import {
  PiCheckCircle,
  PiWarningCircle,
  PiXCircle,
  PiArrowClockwise,
} from 'react-icons/pi'
import { FlexHorizontal } from '../ui-v1/Common/FlexHorizontal'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'

type DCApiStatus = 'idle' | 'loading' | 'success' | 'error'
type ProtocolSupport = {
  openid4vp: boolean | null
  mdoc: boolean | null
}

interface DigitalCredentialRequest {
  protocol: string
  data: string | Record<string, unknown>
}

export const DCApiTestPage: FC = () => {
  const { kai } = useKai()

  // 状態管理
  const [dcApiSupported, setDcApiSupported] = useState<boolean | null>(null)
  const [protocolSupport, setProtocolSupport] = useState<ProtocolSupport>({
    openid4vp: null,
    mdoc: null,
  })
  const [status, setStatus] = useState<DCApiStatus>('idle')
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [credentialResponse, setCredentialResponse] = useState<unknown | null>(null)
  const [authRequestUri, setAuthRequestUri] = useState<string | null>(null)

  // ログ追加関数
  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }, [])

  // DC API機能検出
  useEffect(() => {
    const checkDCApiSupport = () => {
      // Digital Credentials API のサポートチェック
      const isSupported = typeof window !== 'undefined' && 'DigitalCredential' in window
      setDcApiSupported(isSupported)

      if (isSupported) {
        addLog('Digital Credentials API: サポートされています')

        // プロトコルサポートのチェック
        try {
          const DigitalCredential = (window as unknown as { DigitalCredential: { isUserAgentAllowedProtocol?: (protocol: string) => boolean } }).DigitalCredential
          if (DigitalCredential && typeof DigitalCredential.isUserAgentAllowedProtocol === 'function') {
            const openid4vpSupported = DigitalCredential.isUserAgentAllowedProtocol('openid4vp')
            const mdocSupported = DigitalCredential.isUserAgentAllowedProtocol('org-iso-mdoc')
            setProtocolSupport({
              openid4vp: openid4vpSupported,
              mdoc: mdocSupported,
            })
            addLog(`Protocol openid4vp: ${openid4vpSupported ? 'サポート' : '未サポート'}`)
            addLog(`Protocol org-iso-mdoc: ${mdocSupported ? 'サポート' : '未サポート'}`)
          } else {
            // メソッドが利用できない場合は openid4vp をデフォルトでサポートと仮定
            addLog('Protocol check: isUserAgentAllowedProtocol メソッドが利用できません')
            addLog('openid4vp をデフォルトでサポートと仮定します')
            setProtocolSupport({
              openid4vp: true,
              mdoc: false,
            })
          }
        } catch (e) {
          addLog(`Protocol check error: ${e}`)
          addLog('openid4vp をデフォルトでサポートと仮定します')
          setProtocolSupport({
            openid4vp: true,
            mdoc: false,
          })
        }
      } else {
        addLog('Digital Credentials API: サポートされていません')
      }
    }

    checkDCApiSupport()
  }, [addLog])

  // DC API を呼び出し
  const callDCApi = async () => {
    if (!authRequestUri) {
      setError('Authorization Request URI を入力してください')
      return
    }

    setStatus('loading')
    setError(null)
    addLog('DC API 呼び出しを開始...')
    addLog(`Authorization Request URI: ${authRequestUri}`)

    try {
      // authRequestUri から openid4vp:// 以降のクエリパラメータを抽出
      const params = new URLSearchParams(authRequestUri.replace(/^openid4vp:\/\/\?/, ''))

      // クエリパラメータをオブジェクトに変換
      const dataObj: Record<string, string> = {}
      params.forEach((value, key) => {
        dataObj[key] = value
      })

      addLog(`client_id: ${dataObj.client_id}`)
      addLog(`request_uri: ${dataObj.request_uri}`)

      // DC API 形式のリクエストを構築
      const requests: DigitalCredentialRequest[] = [
        {
          protocol: 'openid4vp',
          data: dataObj,
        },
      ]

      addLog(`DC API リクエスト: ${JSON.stringify(requests, null, 2)}`)

      // Digital Credentials API 呼び出し
      addLog('navigator.credentials.get() を呼び出し中...')
      const credential = await navigator.credentials.get({
        digital: { requests },
      } as CredentialRequestOptions)

      addLog('Credential Response を受信しました')
      setCredentialResponse(credential)
      setStatus('success')

      return credential
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e)
      addLog(`DC API エラー: ${errorMessage}`)
      setError(errorMessage)
      setStatus('error')
      return null
    }
  }

  // ログをクリア
  const clearLogs = () => {
    setLogs([])
    setError(null)
    setCredentialResponse(null)
    setAuthRequestUri(null)
    setStatus('idle')
  }

  return (
    <Container>
      <FlexVertical gap='var(--kai-size-ref-24)' width='100%' style={{ maxWidth: '800px' }}>
        {/* ヘッダー */}
        <FlexVertical gap='var(--kai-size-ref-8)'>
          <Text as='h1' typo='headline-lg' color={kai.color.sys.onSurface}>
            Digital Credentials API テスト
          </Text>
          <Text typo='body-md' color={kai.color.sys.onSurfaceVariant}>
            DC API の動作確認を行うページです
          </Text>
        </FlexVertical>

        {/* 機能検出状態 */}
        <StatusCard>
          <Text as='h2' typo='title-md' color={kai.color.sys.onSurface}>
            機能検出
          </Text>
          <FlexVertical gap='var(--kai-size-ref-8)'>
            <StatusRow>
              {dcApiSupported === null ? (
                <PiWarningCircle size={20} color={kai.color.sys.outline} />
              ) : dcApiSupported ? (
                <PiCheckCircle size={20} color={kai.color.sys.success} />
              ) : (
                <PiXCircle size={20} color={kai.color.sys.error} />
              )}
              <Text typo='body-md' color={kai.color.sys.onSurface}>
                Digital Credentials API: {dcApiSupported === null ? '確認中' : dcApiSupported ? 'サポート' : '未サポート'}
              </Text>
            </StatusRow>
            <StatusRow>
              {protocolSupport.openid4vp === null ? (
                <PiWarningCircle size={20} color={kai.color.sys.outline} />
              ) : protocolSupport.openid4vp ? (
                <PiCheckCircle size={20} color={kai.color.sys.success} />
              ) : (
                <PiXCircle size={20} color={kai.color.sys.error} />
              )}
              <Text typo='body-md' color={kai.color.sys.onSurface}>
                OpenID4VP: {protocolSupport.openid4vp === null ? '確認中' : protocolSupport.openid4vp ? 'サポート' : '未サポート'}
              </Text>
            </StatusRow>
            <StatusRow>
              {protocolSupport.mdoc === null ? (
                <PiWarningCircle size={20} color={kai.color.sys.outline} />
              ) : protocolSupport.mdoc ? (
                <PiCheckCircle size={20} color={kai.color.sys.success} />
              ) : (
                <PiXCircle size={20} color={kai.color.sys.error} />
              )}
              <Text typo='body-md' color={kai.color.sys.onSurface}>
                org-iso-mdoc: {protocolSupport.mdoc === null ? '確認中' : protocolSupport.mdoc ? 'サポート' : '未サポート'}
              </Text>
            </StatusRow>
          </FlexVertical>
        </StatusCard>

        {/* Authorization Request URI 入力 */}
        <StatusCard>
          <Text as='h2' typo='title-md' color={kai.color.sys.onSurface}>
            Authorization Request URI
          </Text>
          <FlexVertical gap='var(--kai-size-ref-12)' width='100%'>
            <TextInput
              label='Authorization Request URI'
              placeholder='openid4vp://?client_id=...&request_uri=...'
              value={authRequestUri || ''}
              onChange={(e) => setAuthRequestUri(e.target.value)}
              width='100%'
            />
          </FlexVertical>
        </StatusCard>

        {/* アクションボタン */}
        <ButtonGroup>
          <Button
            variant='filled'
            onPress={callDCApi}
            isDisabled={status === 'loading' || !authRequestUri || !dcApiSupported}
          >
            DC API 呼び出し
          </Button>
          <Button variant='outlined' onPress={clearLogs}>
            <PiArrowClockwise size={16} />
            リセット
          </Button>
        </ButtonGroup>

        {/* エラー表示 */}
        {error && (
          <ErrorCard>
            <Text typo='body-md' color={kai.color.sys.error}>
              {error}
            </Text>
          </ErrorCard>
        )}

        {/* Credential Response */}
        {credentialResponse && (
          <StatusCard>
            <Text as='h2' typo='title-md' color={kai.color.sys.onSurface}>
              Credential Response
            </Text>
            <CodeBlock>
              <pre>{JSON.stringify(credentialResponse, null, 2)}</pre>
            </CodeBlock>
          </StatusCard>
        )}

        {/* ログ */}
        <StatusCard>
          <FlexHorizontal justifyContent='space-between' alignItems='center'>
            <Text as='h2' typo='title-md' color={kai.color.sys.onSurface}>
              ログ
            </Text>
            <Text typo='label-sm' color={kai.color.sys.onSurfaceVariant}>
              {logs.length} entries
            </Text>
          </FlexHorizontal>
          <LogContainer>
            {logs.length === 0 ? (
              <Text typo='body-sm' color={kai.color.sys.onSurfaceVariant}>
                ログはまだありません
              </Text>
            ) : (
              logs.map((log, index) => (
                <LogEntry key={index}>
                  <Text typo='body-sm' color={kai.color.sys.onSurface}>
                    {log}
                  </Text>
                </LogEntry>
              ))
            )}
          </LogContainer>
        </StatusCard>
      </FlexVertical>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--kai-size-ref-16);
`

const StatusCard = styled.div`
  width: 100%;
  padding: var(--kai-size-ref-16);
  background: var(--kai-color-sys-layer-default);
  border-radius: var(--kai-size-ref-12);
  display: flex;
  flex-direction: column;
  gap: var(--kai-size-ref-12);
`

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--kai-size-ref-8);
`

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--kai-size-ref-8);
  width: 100%;

  & > button {
    white-space: nowrap;
    flex-shrink: 0;
  }
`

const ErrorCard = styled.div`
  width: 100%;
  padding: var(--kai-size-ref-16);
  background: var(--kai-color-sys-error-container);
  border-radius: var(--kai-size-ref-12);
`

const LogContainer = styled.div`
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  background: var(--kai-color-sys-layer-farthest);
  border-radius: var(--kai-size-ref-8);
  padding: var(--kai-size-ref-12);
`

const LogEntry = styled.div`
  padding: var(--kai-size-ref-4) 0;
  border-bottom: 1px solid var(--kai-color-sys-outline-variant);
  word-break: break-all;

  &:last-child {
    border-bottom: none;
  }
`

const CodeBlock = styled.div`
  width: 100%;
  max-height: 300px;
  overflow: auto;
  background: var(--kai-color-sys-layer-farthest);
  border-radius: var(--kai-size-ref-8);
  padding: var(--kai-size-ref-12);

  pre {
    margin: 0;
    font-family: monospace;
    font-size: 12px;
    white-space: pre-wrap;
    word-break: break-all;
    color: var(--kai-color-sys-on-surface);
  }
`
