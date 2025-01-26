import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function VCICallback() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (error) {
        // エラー時の処理
        window.location.href = `vess://auth/error?error=${error}${
          errorDescription ? `&error_description=${errorDescription}` : ''
        }`
        return
      }

      if (code && state) {
        // 成功時の処理
        window.location.href = `vess://auth/callback?code=${code}&state=${state}`
        return
      }

      // パラメータ不足時のエラー処理
      window.location.href = `vess://auth/error?error=invalid_request&error_description=missing_parameters`
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-xl font-semibold mb-4'>認証処理中...</h1>
        <p className='text-gray-600'>
          このページは自動的に閉じられます。
          <br />
          閉じない場合は、アプリに戻ってください。
        </p>
      </div>
    </div>
  )
}
