import styled from '@emotion/styled'
import { IconButton, Spinner } from 'kai-kit'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { PiPlus } from 'react-icons/pi'
import { StickerImageItem } from './StickerImageItem'
import { VSCredentialItemFromBuckup } from '@/@types/credential'

type Props = {
  items?: VSCredentialItemFromBuckup[] | null
  isMe?: boolean
  isLoading?: boolean
}
export const StickerImageItemList: FC<Props> = ({ items, isMe, isLoading }) => {
  const router = useRouter()
  return (
    <List>
      {isLoading && <Spinner />}
      {items &&
        items.length > 0 &&
        items.map((item) => {
          return (
            <StickerImageItem
              key={item.id}
              image={
                item.sticker && item.sticker.length > 0
                  ? item.sticker[0].image
                  : item.image || item.icon || ''
              }
              handleClick={() => {
                if (isMe) {
                  router.push(`/creds/items/share/${item.id}`)
                }
              }}
            />
          )
        })}
      <IconButton
        icon={<PiPlus size={18} />}
        color='dominant'
        variant='tonal'
        onPress={() => router.push('/creds/items/create')}
        style={{
          padding: '11px',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          border: '1px solid #CD8DF2',
          background: '#EED3FF',
        }}
      />
    </List>
  )
}

const List = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  width: 100%;
  padding: 0 var(--kai-size-sys-space-md);
  overflow-x: scroll;
  overflow-y: visible;
`
