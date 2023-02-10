import styled from '@emotion/styled'
import React, { createRef, FC, useCallback, useEffect, useMemo, useState } from 'react'
import Dropzone from 'react-dropzone'
import type { DropzoneRef, FileRejection } from 'react-dropzone'
import { IconButton } from '../Buttons/IconButton'
import { Icon, ICONS, IconSize, IconsType } from '../Icons/Icon'
import { Plate } from '../Plates/Plate'
import { useVESSTheme } from '@/hooks/useVESSTheme'

const MAX_SIZE = 5242880

type FileWithPreview = {
  file: File
  preview: string
}

interface Props {
  required: boolean
  label?: string
  supportingText?: string
  icon?: IconsType
  iconSize?: IconSize
  placeholder?: string
  width?: number
}

export const FileInput: FC<Props> = ({ required = false, label, supportingText, width }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const [files, setFiles] = useState<FileWithPreview[] | null>()
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
    ${getBasicFont(currentTypo.label.large)}
  `
  const SupportingText = styled.span`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.body.small)}
  `

  const RequiredMark = styled.span`
    padding: 0 4px;
    color: ${currentTheme.error};
    ${getBasicFont(currentTypo.label.large)}
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
    ${getBasicFont(currentTypo.title.medium)}
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
    ${getBasicFont(currentTypo.title.small)}
  `

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            setErrors(`Error: File size must be less than 5 MB`)
          }

          setErrors(`Error: ${err.message}`)
        })
      })
      setFiles(null)
    } else {
      setFiles(
        acceptedFiles.map((f) => Object.assign({}, { file: f, preview: URL.createObjectURL(f) })),
      )
      setErrors('')
    }
  }, [])

  useEffect(() => {
    return () => {
      files && files.forEach((file) => URL.revokeObjectURL(file.preview))
    }
  }, [])

  const dropzoneRef = createRef<DropzoneRef>()

  const clearFile = (file: FileWithPreview) => {
    URL.revokeObjectURL(file.preview)
    const newFiles = files?.filter((f) => f.preview !== file.preview)
    setFiles(newFiles)
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
      {files && files.length > 0 ? (
        <>
          {files.map((file, index) => {
            return (
              <>
                {file.file.type.includes('image') ? (
                  <FilePreviewContainer key={index}>
                    <Plate name={file.file.name} pfp={file.preview}></Plate>
                    <IconButton
                      icon={ICONS.CROSS}
                      size={'S'}
                      mainColor={currentTheme.depth1}
                      backgroundColor={currentTheme.outline}
                      onClick={() => clearFile(file)}
                    />
                  </FilePreviewContainer>
                ) : (
                  <FilePreviewContainer key={index}>
                    <Plate name={file.file.name} pfpIcon={ICONS.VOXEL}></Plate>
                    <IconButton
                      icon={ICONS.CROSS}
                      size={'S'}
                      mainColor={currentTheme.depth1}
                      backgroundColor={currentTheme.outline}
                      onClick={() => clearFile(file)}
                    />
                  </FilePreviewContainer>
                )}
              </>
            )
          })}
        </>
      ) : (
        <FilePreviewContainer>
          <FilePreviewText>No File yet</FilePreviewText>
        </FilePreviewContainer>
      )}
      <Dropzone ref={dropzoneRef} onDrop={onDrop} maxFiles={3} maxSize={MAX_SIZE}>
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
