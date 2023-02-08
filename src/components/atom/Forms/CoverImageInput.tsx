import styled from '@emotion/styled'
import React, { createRef, FC, useCallback, useMemo, useState } from 'react'
import Dropzone from 'react-dropzone'
import type { DropzoneRef, FileRejection } from 'react-dropzone'
import { IconButton } from '../Buttons/IconButton'
import { Icon, ICONS, IconSize, IconsType } from '../Icons/Icon'
import { CommonSpinner } from '../Loading/CommonSpinner'
import { Plate } from '../Plates/Plate'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useVESSTheme } from '@/hooks/useVESSTheme'

const MAX_SIZE = 5242880

interface Props {
  required?: boolean
  label?: string
  supportingText?: string
  icon?: IconsType
  iconSize?: IconSize
  placeholder?: string
  width?: number
}

export const CoverImageInput: FC<Props> = ({ required = false, label, supportingText, width }) => {
  const { currentTheme, currentTypo } = useVESSTheme()
  const { uploadCoverImage, status, coverImage, coverName, setCoverImage, setCoverName } =
    useFileUpload()
  const [errors, setErrors] = useState('')

  const ContainerWidth = useMemo(() => {
    return !width ? '100%' : `${width}px`
  }, [width])

  const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
    justify-content: center;
    width: ${ContainerWidth};
  `
  const Label = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    font-family: ${currentTypo.label.large.fontFamily};
    font-size: ${currentTypo.label.large.fontSize};
    line-height: ${currentTypo.label.large.lineHeight};
    font-weight: ${currentTypo.label.large.fontWeight};
  `
  const SupportingText = styled.span`
    color: ${currentTheme.onSurface};
    font-family: ${currentTypo.body.small.fontFamily};
    font-size: ${currentTypo.body.small.fontSize};
    line-height: ${currentTypo.body.small.lineHeight};
    font-weight: ${currentTypo.body.small.fontWeight};
  `

  const RequiredMark = styled.span`
    padding: 0 4px;
    color: ${currentTheme.error};
    font-family: ${currentTypo.label.large.fontFamily};
    font-size: ${currentTypo.label.large.fontSize};
    line-height: ${currentTypo.label.large.lineHeight};
    font-weight: ${currentTypo.label.large.fontWeight};
  `

  const DropzoneContainer = styled.div`
    background: ${currentTheme.depth2};
    &:hover {
      background: ${currentTheme.depth1};
    }
    &:focus {
      background: ${currentTheme.depth1};
    }
    border-radius: 16px;
    border: dashed ${currentTheme.outline};
    border-width: 1px;
    height: 204px;
    width: 100%;
    margin-top: 24px;
  `
  const DropzoneContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: 100%;
    margin: 0 auto;
  `

  const DropzoneInput = styled.input`
    width: 100%;
    height: 100%;
  `

  const DropzoneText = styled.p`
    color: ${currentTheme.onPrimaryContainer};
    font-family: ${currentTypo.title.medium.fontFamily};
    font-size: ${currentTypo.title.medium.fontSize};
    line-height: ${currentTypo.title.medium.lineHeight};
    font-weight: ${currentTypo.title.medium.fontWeight};
  `

  const FilePreviewContainer = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    align-self: stretch;
    flex-shrink: 0;
    position: relative;
    border: solid ${currentTheme.onPrimaryContainerOpacity40};
    border-width: 1px 0 1px 0;
    padding: 8px 16px;
    min-height: 48px;
  `

  const FilePreviewText = styled.div`
    color: ${currentTheme.onBackground};
    font-family: ${currentTypo.title.small.fontFamily};
    font-size: ${currentTypo.title.small.fontSize};
    line-height: ${currentTypo.title.small.lineHeight};
    font-weight: ${currentTypo.title.small.fontWeight};
  `
  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            setErrors(`Error: File size must be less than 5 MB`)
          }

          setErrors(`Error: ${err.message}`)
        })
      })
    } else {
      if (acceptedFiles[0]) {
        await uploadCoverImage(acceptedFiles[0])
        setErrors('')
      }
    }
  }, [])

  const dropzoneRef = createRef<DropzoneRef>()

  const clearFile = () => {
    setCoverImage('')
    setCoverName('')
  }

  return (
    <>
      <InputContainer>
        {label && (
          <Label>
            {label}
            {required && <RequiredMark>*</RequiredMark>}
          </Label>
        )}
        {supportingText && <SupportingText>{supportingText}</SupportingText>}
        {errors && <SupportingText>{errors}</SupportingText>}
      </InputContainer>
      <FilePreviewContainer>
        {status === 'uploading' ? (
          <CommonSpinner />
        ) : (
          <>
            {coverImage && coverName ? (
              <>
                <Plate name={coverName} pfp={coverImage}></Plate>
                <IconButton
                  icon={ICONS.CROSS}
                  size={'S'}
                  mainColor={currentTheme.depth1}
                  backgroundColor={currentTheme.outline}
                  onClick={() => clearFile()}
                />
              </>
            ) : (
              <FilePreviewText>No File yet</FilePreviewText>
            )}
          </>
        )}
      </FilePreviewContainer>
      <Dropzone ref={dropzoneRef} onDrop={onDrop} maxFiles={1} maxSize={MAX_SIZE}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <DropzoneContainer {...getRootProps()}>
            <DropzoneInput {...getInputProps()} />
            <DropzoneContent>
              <Icon icon={ICONS.ADD_FILE} size={'XXL'} />
              <DropzoneText>{isDragActive ? 'Drop Here' : 'Upload Files'}</DropzoneText>
            </DropzoneContent>
          </DropzoneContainer>
        )}
      </Dropzone>
    </>
  )
}
