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
        backgroundImage: `url(${process.env.NEXT_PUBLIC_VESS_URL}/og/profile_ogp.jpg)`,
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          padding: '24px 44px 14px 44px',
          width: '630px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          position: 'relative',
        }}
      >
        <img
          style={{
            width: '100%',
            aspectRatio: 1,
            objectFit: 'cover',
            borderRadius: '32px',
            zIndex: 1,
          }}
          src={avatar}
        />

        <div
          style={{
            display: 'flex',
            flexBasis: '40px',
            flexGrow: 0,
            gap: 12,
            width: 'auto',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            style={{
              width: 40,
              height: 40,
              aspectRatio: '1',
              objectFit: 'cover',
            }}
            src={`${process.env.NEXT_PUBLIC_VESS_URL}/brand/vess.png`}
          />
          <div
            style={{
              fontSize: 32,
              fontStyle: 'normal',
              fontWeight: 'bold',
              lineHeight: '40px',
              color: '#E7D9F0',
              whiteSpace: 'nowrap',
              width: 'auto',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
        </div>
        <img
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 120,
            aspectRatio: 1,
            objectFit: 'cover',
            zIndex: 10,
          }}
          src={`${process.env.NEXT_PUBLIC_VESS_URL}/icon/verified_rich_purple.png`}
        />
      </div>
    </div>
  )
}

export default OgAvatarComponent
