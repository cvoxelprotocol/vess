import { FC } from 'react'

type Props = {
  title?: string
  avatar?: string
}

const OgAvatarComponent: FC<Props> = ({ title, avatar }) => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        backgroundSize: '100% 100%',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 'auto',
          fontSize: 60,
          fontStyle: 'normal',
          fontWeight: 'bold',
          color: '#000',
          padding: '0 120px',
          lineHeight: 1.3,
          marginBottom: '30px',
          wordWrap: 'break-word',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {title}
      </div>
      <img
        style={{
          width: 'auto',
          minWidth: '600px',
          height: '100%',
          aspectRatio: '1',
          objectFit: 'contain',
        }}
        src={avatar}
      />
    </div>
  )
}

export default OgAvatarComponent
