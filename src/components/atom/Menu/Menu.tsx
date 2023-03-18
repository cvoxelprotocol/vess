import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { forwardRef } from 'react'
import { Icon, ICONS } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const Menu = forwardRef<HTMLDivElement, PopoverPrimitive.PopoverContentProps>(
  ({ children, ...props }, forwardedRef) => {
    const { currentTheme } = useVESSTheme()

    const slideUpAndFade = keyframes({
      '0%': { opacity: 0, transform: 'translateY(2px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    })

    const slideRightAndFade = keyframes({
      '0%': { opacity: 0, transform: 'translateX(-2px)' },
      '100%': { opacity: 1, transform: 'translateX(0)' },
    })

    const slideDownAndFade = keyframes({
      '0%': { opacity: 0, transform: 'translateY(-2px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    })

    const slideLeftAndFade = keyframes({
      '0%': { opacity: 0, transform: 'translateX(2px)' },
      '100%': { opacity: 1, transform: 'translateX(0)' },
    })

    const PopoverContent = styled(PopoverPrimitive.Content)`
      background: ${currentTheme.surface3};
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0px;
      overflow: hidden;

      &:focus {
        outline: none;
      }
      padding: 4px 0px;
      border-radius: 12px;
      will-change: transform, opacity;
      box-shadow: 0px 2px 0px #afa9ad;
      &[data-state='open'][data-side='top'] {
        animation: ${slideUpAndFade};
        animation-duration: 300ms;
        animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
      }
      &[data-state='open'][data-side='right'] {
        animation: ${slideRightAndFade};
        animation-duration: 300ms;
        animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
      }
      &[data-state='open'][data-side='bottom'] {
        animation: ${slideDownAndFade};
        animation-duration: 300ms;
        animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
      }
      &[data-state='open'][data-side='left'] {
        animation: ${slideLeftAndFade};
        animation-duration: 300ms;
        animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
      }

      z-index: 999;
    `

    const PopoverArrow = styled(PopoverPrimitive.Arrow)`
      left: 32px;
      position: absolute;
    `

    const PopoverClose = styled(PopoverPrimitive.Close)`
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
    `
    const IconContainer = styled.div`
      background: none;
    `

    return (
      <PopoverPrimitive.Portal>
        <PopoverContent
          side={props.side}
          align={'end'}
          sideOffset={16}
          {...props}
          ref={forwardedRef}
        >
          {children}
        </PopoverContent>
      </PopoverPrimitive.Portal>
    )
  },
)

Menu.displayName = 'BasePopover'

const TriggerWrapper = styled(PopoverPrimitive.Trigger)`
  background: none;
  border: none;
  cursor: pointer;
`

export const PopoverContainer = PopoverPrimitive.Root
export const PopoverTrigger = TriggerWrapper
