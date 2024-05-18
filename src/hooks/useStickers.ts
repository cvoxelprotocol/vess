import { useCallback } from 'react'
import { StickerType } from '@/@types/avatar'
import { useStickersAtom } from '@/jotai/ui'

export const STICKER_SURFIX = '_sticker_'

export const useStickers = () => {
  const [stickers, setStickers] = useStickersAtom()
  const addSticker = useCallback(
    (sticker: Partial<StickerType>) => {
      setStickers((prev) => {
        const existingIds = prev.map((s) => s.id)
        let newId = sticker.id || ''
        let suffix = 1
        while (existingIds.includes(newId)) {
          newId = `${sticker.id}${STICKER_SURFIX}${suffix}`
          suffix++
        }
        console.log('newid: ', newId)
        return [
          ...prev,
          {
            id: newId,
            imgUrl: sticker.imgUrl || '',
            width: sticker.width || 0,
            height: sticker.height || 0,
            position: sticker.position || { x: 0, y: 0 },
            rotation: sticker.rotation || 0,
            scale: sticker.scale || 1,
          },
        ]
      })
    },
    [setStickers],
  )

  return { stickers, setStickers, addSticker }
}
