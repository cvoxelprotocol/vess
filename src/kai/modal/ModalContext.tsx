import styled from '@emotion/styled'
import React, { FC, ReactNode, useEffect, useMemo } from 'react'

export type ModalContextType = {
  isOpen: {
    [name: string]: boolean
  }
  setIsOpen: (v: { [name: string]: boolean }) => void
  name?: string
  attachToRef?: React.RefObject<HTMLDivElement>
}

export const ModalContext = React.createContext<ModalContextType>({
  isOpen: { default: false },
  setIsOpen: () => {},
  attachToRef: undefined,
})

export type ModalProviderProps = {
  children?: React.ReactNode
}

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState({})
  const attachToRef = React.useRef<HTMLDivElement>(null)

  return (
    <ModalContext.Provider
      value={{ isOpen: isOpen, setIsOpen: setIsOpen, attachToRef: attachToRef }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = (name?: string) => {
  const { isOpen, setIsOpen, attachToRef } = React.useContext(ModalContext)

  useEffect(() => {
    if (name) {
      setIsOpen({ ...isOpen, [name]: false })
    }
  }, [])

  const isOpenSomeModal = useMemo(() => {
    return Object.values(isOpen).some((v) => v === true)
  }, [isOpen])

  const isOpenModal = useMemo(() => {
    if (name) {
      if (name in isOpen) {
        return isOpen[name]
      } else {
        return false
      }
    } else {
      return isOpen['default']
    }
  }, [isOpen, name])

  const setIsOpenModal = (v: boolean) => {
    if (name) {
      setIsOpen({ ...isOpen, [name]: v })
    } else {
      setIsOpen({ ...isOpen, default: v })
    }
  }

  const openModal = () => {
    if (name) {
      setIsOpen({ ...isOpen, [name]: true })
    } else {
      setIsOpen({ ...isOpen, default: true })
    }
  }

  const closeModal = () => {
    if (name) {
      setIsOpen({ ...isOpen, [name]: false })
    } else {
      setIsOpen({ ...isOpen, default: false })
    }
  }

  const toggleModal = () => {
    if (name) {
      setIsOpen({ ...isOpen, [name]: !isOpen[name] })
    } else {
      setIsOpen({ ...isOpen, default: !isOpen['default'] })
    }
  }

  return {
    isOpenModal,
    isOpenSomeModal,
    setIsOpenModal,
    openModal,
    closeModal,
    toggleModal,
    attachToRef,
  }
}

export const useModal = () => {
  const { isOpen, setIsOpen, attachToRef } = React.useContext(ModalContext)

  const openModal = (name?: string) => {
    if (name) {
      setIsOpen({ ...isOpen, [name]: true })
    } else {
      setIsOpen({ ...isOpen, default: true })
    }
  }

  const closeModal = (name?: string) => {
    if (name) {
      setIsOpen({ ...isOpen, [name]: false })
    } else {
      setIsOpen({ ...isOpen, default: false })
    }
  }

  const toggleModal = (name?: string) => {
    if (name) {
      setIsOpen({ ...isOpen, [name]: !isOpen[name] })
    } else {
      setIsOpen({ ...isOpen, default: !isOpen['default'] })
    }
  }

  return {
    openModal,
    closeModal,
    toggleModal,
    attachToRef,
  }
}
