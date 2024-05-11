import { createContext, useContext, useState, FC } from 'react'

export type StickerType = {
  id: string
  imgUrl: string
  width: number
  height: number
  position: {
    x: number
    y: number
  }
  rotation?: number
  scale?: number
}

/* *********** Sticker Context *********** */
export type StickersContextType = {
  stickers: StickerType[]
  setStickers: React.Dispatch<React.SetStateAction<StickerType[]>>
  selectedID: string | undefined
  setSelectedID: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const StickersContext = createContext<StickersContextType>({
  stickers: [],
  setStickers: () => {},
  selectedID: undefined,
  setSelectedID: () => {},
})

export const useStickers = () => {
  const { stickers, setStickers, selectedID, setSelectedID } = useContext(StickersContext)
  return { stickers, setStickers, selectedID, setSelectedID }
}

/* *********** Stiker Provider *********** */
export type StickersProviderProps = {
  stickers?: StickerType[]
  children?: React.ReactNode
}

export const StickersProvider: FC<StickersProviderProps> = ({
  stickers: initialStickers,
  children,
}) => {
  const [stickers, setStickers] = useState<StickerType[]>(initialStickers ?? [])
  const [selectedID, setSelectedID] = useState<string | undefined>()

  return (
    <StickersContext.Provider value={{ stickers, setStickers, selectedID, setSelectedID }}>
      {children}
    </StickersContext.Provider>
  )
}
