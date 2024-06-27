import styled from '@emotion/styled'
import { FlexVertical, Text, Button } from 'kai-kit'
import type { ButtonProps } from 'kai-kit'
import { ComponentPropsWithoutRef, FC } from 'react'
import { IconContext } from 'react-icons'
import { PiPlus } from 'react-icons/pi'

type EmptyViewProps = {
  icon?: React.ReactNode
  title: string
  description?: string
  isButton?: boolean
  buttonOptions?: ButtonProps
} & ComponentPropsWithoutRef<'div'>

const EmptyView: FC<EmptyViewProps> = ({
  icon,
  title,
  description,
  isButton,
  buttonOptions,
  ...props
}) => {
  return (
    <Container {...props}>
      <IconContext.Provider value={{ size: '3rem', color: 'var(--kai-color-sys-dominant)' }}>
        {icon && <IconFrame>{icon}</IconFrame>}
      </IconContext.Provider>
      <FlexVertical
        gap='var(--kai-size-sys-space-xs)'
        width='100%'
        height='100%'
        justifyContent='center'
        alignItems='center'
        style={{
          maxWidth: 'var(--kai-size-ref-208)',
        }}
      >
        {title && (
          <Text typo='title-lg' color='var(--kai-color-sys-on-dominant-backing)' align='center'>
            {title}
          </Text>
        )}

        {description && (
          <Text typo='body-md' color='var(--kai-color-sys-neutral-minor)' align='center'>
            {description}
          </Text>
        )}
      </FlexVertical>
      {isButton && (
        <Button
          startContent={<PiPlus />}
          {...buttonOptions}
          variant='text'
          size='sm'
          style={{ flexShrink: 0 }}
        >
          {buttonOptions?.children}
        </Button>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
  background: transparent;
  padding: var(--kai-size-sys-space-md);
  gap: var(--kai-size-sys-space-md);
`

const IconFrame = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4rem;
  height: 4rem;
  border: 1px solid var(--kai-color-sys-neutral-outline);
  border-radius: 16px;
`

export default EmptyView
