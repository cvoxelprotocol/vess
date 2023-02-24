import { useEffect, useState } from 'react'

type Props = {
  gridRow: string
  gridCol: string
  gridRowOnSp: string
  gridColOnSp: string
}

export const useWidgetRaduis = ({ gridRow, gridCol, gridColOnSp, gridRowOnSp }: Props) => {
  let [radius, setRadius] = useState<string>()
  let [radiusOnSp, setRadiusOnSp] = useState<string>()

  useEffect(() => {
    const rowSize = gridRow.split('/').map(Number)
    const colSize = gridCol.split('/').map(Number)
    const spRowSize = gridRowOnSp.split('/').map(Number)
    const spColSize = gridColOnSp.split('/').map(Number)

    const minEdge = Math.min(Math.abs(rowSize[0] - rowSize[1]), Math.abs(colSize[0] - colSize[1]))
    const spMinEdge = Math.min(
      Math.abs(spRowSize[0] - spRowSize[1]),
      Math.abs(spColSize[0] - spColSize[1]),
    )

    switch (minEdge) {
      case 1:
        setRadius('16px')
        break
      case 2:
        setRadius('24px')
        break
      case 3:
        setRadius('32px')
        break
      case 4:
        setRadius('32px')
        break
      default:
        setRadius('32px')
    }

    switch (spMinEdge) {
      case 1:
        setRadiusOnSp('8px')
        break
      case 2:
        setRadiusOnSp('16px')
        break
      case 3:
        setRadiusOnSp('20px')
        break
      case 4:
        setRadiusOnSp('20px')
        break
      default:
        setRadiusOnSp('20px')
    }
  }, [])

  return { radius, radiusOnSp }
}
