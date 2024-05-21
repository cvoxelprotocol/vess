import { FC } from 'react'

type Props = {
  image?: string
}

const OgPostComponent: FC<Props> = ({ image }) => {
  return (
    <div
      style={{
        backgroundSize: '100% 100%',
        backgroundImage: `url(${process.env.NEXT_PUBLIC_VESS_URL}/og/pizza.jpg)`,
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        style={{
          width: '797px',
          height: '598px',
          aspectRatio: 1,
          objectFit: 'contain',
          borderRadius: '32px',
          zIndex: 1,
        }}
        src={image}
      />
    </div>
  )
}

export default OgPostComponent
