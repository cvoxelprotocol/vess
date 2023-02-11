import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { forwardRef } from 'react'
import { Icon, ICONS } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const BasePopover = forwardRef<HTMLDivElement, PopoverPrimitive.PopoverContentProps>(
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
      background: ${currentTheme.surface2};
      &:focus {
        outline: none;
      }
      padding: 24px;
      border-radius: 32px;
      animation-duration: 400ms;
      animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform, opacity;
      &[data-state='open'] {
        &[data-side='top'] {
          animation: ${slideDownAndFade};
        }
        &[data-side='right'] {
          animation: ${slideLeftAndFade};
        }
        &[data-side='bottom'] {
          animation: ${slideUpAndFade};
        }
        &[data-side='left'] {
          animation: ${slideRightAndFade};
        }
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
        <PopoverContent side={'bottom'} align={'end'} sideOffset={5} {...props} ref={forwardedRef}>
          {children}
          <PopoverClose aria-label='Close'>
            <IconContainer>
              <Icon icon={ICONS.CROSS} size={'SS'} mainColor={currentTheme.onSecondaryContainer} />
            </IconContainer>
          </PopoverClose>
          <PopoverArrow width={30} height={15} fill={currentTheme.depth1} />
        </PopoverContent>
      </PopoverPrimitive.Portal>
    )
  },
)

BasePopover.displayName = 'BasePopover'

const TriggerWrapper = styled(PopoverPrimitive.Trigger)`
  background: none;
  border: none;
`

export const PopoverContainer = PopoverPrimitive.Root
export const PopoverTrigger = TriggerWrapper
