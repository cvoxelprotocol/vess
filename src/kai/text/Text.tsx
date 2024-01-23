import { css } from '@emotion/css'
import styled from '@emotion/styled'
import React, {
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useKai } from '../hooks/useKai'
import { Skelton } from '../skelton'

type TextLocalProps = {
  /** You can select a kind of tag from p, span, h1, h2, h3, label and a (default: p) */
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'label' | 'a'
  /** You can set a color */
  color?: string
  /** You can add a start content such as Icon. This will be disabled when p. */
  startContent?: ReactNode
  /** You can add a end content such as Icon. This will be disabled when p. */
  endContent?: ReactNode
  /** Set true when a content is still loading. */
  isLoading?: boolean
  /** You can set text align. */
  align?: 'left' | 'center' | 'right'
  /** You can set word break */
  workBreak?: 'break-all' | 'keep-all' | 'break-word'
  /** You can add a text. */
  children?: ReactNode

  /** [Advanced] You can set a font from VESS Theme. */
  typo?:
    | 'body-sm'
    | 'body-md'
    | 'body-lg'
    | 'body-sm-bold'
    | 'body-md-bold'
    | 'body-lg-bold'
    | 'label-sm'
    | 'label-md'
    | 'label-lg'
    | 'title-sm'
    | 'title-md'
    | 'title-lg'
    | 'title-xl'
    | 'headline-sm'
    | 'headline-md'
    | 'headline-lg'
    | 'display-sm'
    | 'display-md'
    | 'display-lg'
  /** [Advanced] If the sentence is multiple line, you can clamp the number of line by this. */
  lineClamp?: number
  /** [Advanced] You can set a width. This will also affect the width of lading skelton */
  width?: string
  /** [Advanced] You can set a height. This will also affect the width of lading skelton */
  height?: string
}

export type TextProps = TextLocalProps &
  ComponentPropsWithoutRef<'p'> &
  ComponentPropsWithoutRef<'h1'> &
  ComponentPropsWithoutRef<'h2'> &
  ComponentPropsWithoutRef<'h3'> &
  ComponentPropsWithoutRef<'h4'> &
  ComponentPropsWithoutRef<'span'> &
  ComponentPropsWithoutRef<'label'>

export const Text: FC<TextProps> = ({
  as = 'p',
  startContent,
  endContent,
  color = 'inherit',
  align = 'left',
  workBreak = 'break-all',
  isLoading = false,
  lineClamp,
  typo,
  width = 'auto',
  height = 'auto',
  children,
  ...props
}) => {
  const { kai } = useKai()
  const Component = as
  const [typoHeight, setTypoHeight] = useState(kai.typo.sys.body.md.lineHeight)
  const [typoStyle, setTypoStyle] = useState<string>('')

  useEffect(() => {
    if (!typo) {
      switch (as) {
        case 'h1':
          setTypoHeight(kai.typo.sys.headline.lg.lineHeight)
          setTypoStyle('headline-lg')
          break
        case 'h2':
          setTypoHeight(kai.typo.sys.headline.md.lineHeight)
          setTypoStyle('headline-md')
          break
        case 'h3':
          setTypoHeight(kai.typo.sys.headline.sm.lineHeight)
          setTypoStyle('headline-sm')
          break
        case 'h4':
          setTypoHeight(kai.typo.sys.title.lg.lineHeight)
          setTypoStyle('title-lg')
          break
        case 'span':
          setTypoHeight(kai.typo.sys.body.lg.lineHeight)
          setTypoStyle('body-lg')
          break
        case 'label':
          setTypoHeight(kai.typo.sys.label.lg.lineHeight)
          setTypoStyle('label-lg')
          break
        case 'a':
          setTypoHeight(kai.typo.sys.body.lg.lineHeight)
          setTypoStyle('body-lg')
          break
        default:
          setTypoHeight(kai.typo.sys.body.md.lineHeight)
          setTypoStyle('body-md')
      }
    } else {
      switch (typo) {
        case 'body-sm':
          setTypoHeight(kai.typo.sys.body.sm.lineHeight)
          setTypoStyle('body-sm')
          break
        case 'body-md':
          setTypoHeight(kai.typo.sys.body.md.lineHeight)
          setTypoStyle('body-md')
          break
        case 'body-lg':
          setTypoHeight(kai.typo.sys.body.lg.lineHeight)
          setTypoStyle('body-lg')
          break
        case 'body-sm-bold':
          setTypoHeight(kai.typo.sys.body.smBold.lineHeight)
          setTypoStyle('body-sm-bold')
          break
        case 'body-md-bold':
          setTypoHeight(kai.typo.sys.body.mdBold.lineHeight)
          setTypoStyle('body-md-bold')
          break
        case 'body-lg-bold':
          setTypoHeight(kai.typo.sys.body.lgBold.lineHeight)
          setTypoStyle('body-lg-bold')
          break
        case 'label-sm':
          setTypoHeight(kai.typo.sys.label.sm.lineHeight)
          setTypoStyle('label-sm')
          break
        case 'label-md':
          setTypoHeight(kai.typo.sys.label.md.lineHeight)
          setTypoStyle('label-md')
          break
        case 'label-lg':
          setTypoHeight(kai.typo.sys.label.lg.lineHeight)
          setTypoStyle('label-lg')
          break
        case 'title-sm':
          setTypoHeight(kai.typo.sys.title.sm.lineHeight)
          setTypoStyle('title-sm')
          break
        case 'title-md':
          setTypoHeight(kai.typo.sys.title.md.lineHeight)
          setTypoStyle('title-md')
          break
        case 'title-lg':
          setTypoHeight(kai.typo.sys.title.lg.lineHeight)
          setTypoStyle('title-lg')
          break
        case 'title-xl':
          setTypoHeight(kai.typo.sys.title.xl.lineHeight)
          setTypoStyle('title-xl')
          break
        case 'headline-sm':
          setTypoHeight(kai.typo.sys.headline.sm.lineHeight)
          setTypoStyle('headline-sm')
          break
        case 'headline-md':
          setTypoHeight(kai.typo.sys.headline.md.lineHeight)
          setTypoStyle('headline-md')
          break
        case 'headline-lg':
          setTypoHeight(kai.typo.sys.headline.lg.lineHeight)
          setTypoStyle('headline-lg')
          break
        case 'display-sm':
          setTypoHeight(kai.typo.sys.display.sm.lineHeight)
          setTypoStyle('display-sm')
          break
        case 'display-md':
          setTypoHeight(kai.typo.sys.display.md.lineHeight)
          setTypoStyle('display-md')
          break
        case 'display-lg':
          setTypoHeight(kai.typo.sys.display.lg.lineHeight)
          setTypoStyle('display-lg')
          break
        default:
          setTypoHeight(kai.typo.sys.body.md.lineHeight)
          setTypoStyle('body-md')
      }
    }
  }, [as, typo])

  const typoStyles = useMemo(() => {
    switch (typoStyle) {
      case 'body-sm':
        return css`
          font-family: var(--kai-typo-sys-body-sm-font-family), sans-serif;
          font-size: var(--kai-typo-sys-body-sm-font-size);
          font-weight: var(--kai-typo-sys-body-sm-font-weight);
          line-height: var(--kai-typo-sys-body-sm-line-height);
          letter-spacing: var(--kai-typo-sys-body-sm-letter-spacing);
        `
      case 'body-md':
        return css`
          font-family: var(--kai-typo-sys-body-md-font-family), sans-serif;
          font-size: var(--kai-typo-sys-body-md-font-size);
          font-weight: var(--kai-typo-sys-body-md-font-weight);
          line-height: var(--kai-typo-sys-body-md-line-height);
          letter-spacing: var(--kai-typo-sys-body-md-letter-spacing);
        `
      case 'body-lg':
        return css`
          font-family: var(--kai-typo-sys-body-lg-font-family), sans-serif;
          font-size: var(--kai-typo-sys-body-lg-font-size);
          font-weight: var(--kai-typo-sys-body-lg-font-weight);
          line-height: var(--kai-typo-sys-body-lg-line-height);
          letter-spacing: var(--kai-typo-sys-body-lg-letter-spacing);
        `
      case 'body-sm-bold':
        return css`
          font-family: var(--kai-typo-sys-body-sm-bold-font-family), sans-serif;
          font-size: var(--kai-typo-sys-body-sm-bold-font-size);
          font-weight: var(--kai-typo-sys-body-sm-bold-font-weight);
          line-height: var(--kai-typo-sys-body-sm-bold-line-height);
          letter-spacing: var(--kai-typo-sys-body-sm-bold-letter-spacing);
        `
      case 'body-md-bold':
        return css`
          font-family: var(--kai-typo-sys-body-md-bold-font-family), sans-serif;
          font-size: var(--kai-typo-sys-body-md-bold-font-size);
          font-weight: var(--kai-typo-sys-body-md-bold-font-weight);
          line-height: var(--kai-typo-sys-body-md-bold-line-height);
          letter-spacing: var(--kai-typo-sys-body-md-bold-letter-spacing);
        `
      case 'body-lg-bold':
        return css`
          font-family: var(--kai-typo-sys-body-lg-bold-font-family), sans-serif;
          font-size: var(--kai-typo-sys-body-lg-bold-font-size);
          font-weight: var(--kai-typo-sys-body-lg-bold-font-weight);
          line-height: var(--kai-typo-sys-body-lg-bold-line-height);
          letter-spacing: var(--kai-typo-sys-body-lg-bold-letter-spacing);
        `
      case 'label-sm':
        return css`
          font-family: var(--kai-typo-sys-label-sm-font-family), sans-serif;
          font-size: var(--kai-typo-sys-label-sm-font-size);
          font-weight: var(--kai-typo-sys-label-sm-font-weight);
          line-height: var(--kai-typo-sys-label-sm-line-height);
          letter-spacing: var(--kai-typo-sys-label-sm-letter-spacing);
        `
      case 'label-md':
        return css`
          font-family: var(--kai-typo-sys-label-md-font-family), sans-serif;
          font-size: var(--kai-typo-sys-label-md-font-size);
          font-weight: var(--kai-typo-sys-label-md-font-weight);
          line-height: var(--kai-typo-sys-label-md-line-height);
          letter-spacing: var(--kai-typo-sys-label-md-letter-spacing);
        `
      case 'label-lg':
        return css`
          font-family: var(--kai-typo-sys-label-lg-font-family), sans-serif;
          font-size: var(--kai-typo-sys-label-lg-font-size);
          font-weight: var(--kai-typo-sys-label-lg-font-weight);
          line-height: var(--kai-typo-sys-label-lg-line-height);
          letter-spacing: var(--kai-typo-sys-label-lg-letter-spacing);
        `
      case 'title-sm':
        return css`
          font-family: var(--kai-typo-sys-title-sm-font-family), sans-serif;
          font-size: var(--kai-typo-sys-title-sm-font-size);
          font-weight: var(--kai-typo-sys-title-sm-font-weight);
          line-height: var(--kai-typo-sys-title-sm-line-height);
          letter-spacing: var(--kai-typo-sys-title-sm-letter-spacing);
        `
      case 'title-md':
        return css`
          font-family: var(--kai-typo-sys-title-md-font-family), sans-serif;
          font-size: var(--kai-typo-sys-title-md-font-size);
          font-weight: var(--kai-typo-sys-title-md-font-weight);
          line-height: var(--kai-typo-sys-title-md-line-height);
          letter-spacing: var(--kai-typo-sys-title-md-letter-spacing);
        `
      case 'title-lg':
        return css`
          font-family: var(--kai-typo-sys-title-lg-font-family), sans-serif;
          font-size: var(--kai-typo-sys-title-lg-font-size);
          font-weight: var(--kai-typo-sys-title-lg-font-weight);
          line-height: var(--kai-typo-sys-title-lg-line-height);
          letter-spacing: var(--kai-typo-sys-title-lg-letter-spacing);
        `
      case 'title-xl':
        return css`
          font-family: var(--kai-typo-sys-title-xl-font-family), sans-serif;
          font-size: var(--kai-typo-sys-title-xl-font-size);
          font-weight: var(--kai-typo-sys-title-xl-font-weight);
          line-height: var(--kai-typo-sys-title-xl-line-height);
          letter-spacing: var(--kai-typo-sys-title-xl-letter-spacing);
        `
      case 'headline-sm':
        return css`
          font-family: var(--kai-typo-sys-headline-sm-font-family), sans-serif;
          font-size: var(--kai-typo-sys-headline-sm-font-size);
          font-weight: var(--kai-typo-sys-headline-sm-font-weight);
          line-height: var(--kai-typo-sys-headline-sm-line-height);
          letter-spacing: var(--kai-typo-sys-headline-sm-letter-spacing);
        `
      case 'headline-md':
        return css`
          font-family: var(--kai-typo-sys-headline-md-font-family), sans-serif;
          font-size: var(--kai-typo-sys-headline-md-font-size);
          font-weight: var(--kai-typo-sys-headline-md-font-weight);
          line-height: var(--kai-typo-sys-headline-md-line-height);
          letter-spacing: var(--kai-typo-sys-headline-md-letter-spacing);
        `
      case 'headline-lg':
        return css`
          font-family: var(--kai-typo-sys-headline-lg-font-family), sans-serif;
          font-size: var(--kai-typo-sys-headline-lg-font-size);
          font-weight: var(--kai-typo-sys-headline-lg-font-weight);
          line-height: var(--kai-typo-sys-headline-lg-line-height);
          letter-spacing: var(--kai-typo-sys-headline-lg-letter-spacing);
        `
      case 'display-sm':
        return css`
          font-family: var(--kai-typo-sys-display-sm-font-family), sans-serif;
          font-size: var(--kai-typo-sys-display-sm-font-size);
          font-weight: var(--kai-typo-sys-display-sm-font-weight);
          line-height: var(--kai-typo-sys-display-sm-line-height);
          letter-spacing: var(--kai-typo-sys-display-sm-letter-spacing);
        `
      case 'display-md':
        return css`
          font-family: var(--kai-typo-sys-display-md-font-family), sans-serif;
          font-size: var(--kai-typo-sys-display-md-font-size);
          font-weight: var(--kai-typo-sys-display-md-font-weight);
          line-height: var(--kai-typo-sys-display-md-line-height);
          letter-spacing: var(--kai-typo-sys-display-md-letter-spacing);
        `
      case 'display-lg':
        return css`
          font-family: var(--kai-typo-sys-display-lg-font-family), sans-serif;
          font-size: var(--kai-typo-sys-display-lg-font-size);
          font-weight: var(--kai-typo-sys-display-lg-font-weight);
          line-height: var(--kai-typo-sys-display-lg-line-height);
          letter-spacing: var(--kai-typo-sys-display-lg-letter-spacing);
        `
      default:
        return css`
          font-family: var(--kai-typo-sys-body-md-font-family), sans-serif;
          font-size: var(--kai-typo-sys-body-md-font-size);
          font-weight: var(--kai-typo-sys-body-md-font-weight);
          line-height: var(--kai-typo-sys-body-md-line-height);
          letter-spacing: var(--kai-typo-sys-body-md-letter-spacing);
        `
    }
  }, [as, typo, typoStyle, typoHeight])

  return (
    <Skelton
      isLoading={isLoading}
      width={width === 'auto' ? '100%' : width}
      height={height !== 'auto' ? height : typoHeight}
    >
      <Component
        className={css`
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: ${color};
          ${typoStyles}
          text-align: ${align};
          text-overflow: ellipsis;
          width: ${width};
          height: ${height !== 'auto' ? height : typoHeight};
          margin: 0;
          pointer-events: none;
          word-break: ${workBreak};
          ${lineClamp &&
          `
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: ${lineClamp};
            -webkit-box-orient: vertical;
          `}
        `}
        {...props}
      >
        {as === 'p' ? (
          <>{children}</>
        ) : (
          <>
            {startContent && (
              <IconStyle size={height !== 'auto' ? height : typoHeight}>{startContent}</IconStyle>
            )}
            <span
              className={css`
                display: inline-flex;
                align-items: center;
                gap: 2px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              `}
            >
              {children}
              {endContent && (
                <IconStyle size={height !== 'auto' ? height : typoHeight}>{endContent}</IconStyle>
              )}
            </span>
          </>
        )}
      </Component>
    </Skelton>
  )
}

const IconStyle = styled.div<{ size?: string }>`
  width: ${(props) => props.size};
  display: inline-block;
  aspect-ratio: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`
