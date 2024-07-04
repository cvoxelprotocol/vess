import { FC } from 'react'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'

type Props = {
  image: string
  handleClick?: () => void
}
export const StickerImageItem: FC<Props> = ({ image, handleClick }) => {
  return (
    <ImageContainer
      src={image}
      width='auto'
      height='56px'
      objectFit='contain'
      style={{ minWidth: '56px' }}
      onClick={() => {
        if (handleClick) handleClick()
      }}
    />
  )
}
