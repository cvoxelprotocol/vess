import { useQRCode } from 'next-qrcode'
import { FC } from 'react'
type Props = {
  url: string
  width?: number
}
export const QRCode: FC<Props> = ({ url, width = 200 }) => {
  const { Canvas } = useQRCode()
  return (
    <Canvas
      text={url}
      options={{
        level: 'H',
        margin: 3,
        scale: 4,
        width: width,
      }}
    />
  )
}
