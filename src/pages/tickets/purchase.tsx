import type {GetServerSideProps} from 'next'

/**
 * /tickets/purchase は購入ホーム /tickets に統合した。
 * ウォレット提示後の redirect 戻り（?correlationId=...）など、
 * このパスに来た場合はクエリを保ったまま /tickets にリダイレクトする。
 */
export const getServerSideProps: GetServerSideProps = async ({query}) => {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (typeof v === 'string') params.set(k, v)
    else if (Array.isArray(v)) v.forEach((x) => params.append(k, x))
  }
  const qs = params.toString()
  return {
    redirect: {
      destination: `/tickets${qs ? `?${qs}` : ''}`,
      permanent: false,
    },
  }
}

export default function PurchaseRedirect() {
  return null
}
