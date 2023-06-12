import styled from '@emotion/styled'
import { extractColors } from 'extract-colors'
import React, { createRef, FC, useCallback, useMemo, useState } from 'react'
import Dropzone from 'react-dropzone'
import type { DropzoneRef, FileRejection } from 'react-dropzone'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { IconButton } from '../Buttons/IconButton'
import { Icon, ICONS, IconSize, IconsType } from '../Icons/Icon'
import { CommonSpinner } from '../Loading/CommonSpinner'
import { Plate } from '../Plates/Plate'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useVESSTheme } from '@/hooks/useVESSTheme'


const MAX_SIZE = 5242880

interface Props {
  required: boolean
  label?: string
  supportingText?: string
  icon?: IconsType
  iconSize?: IconSize
  placeholder?: string
  width?: number
  recommendText?: string
}

export const IconInput: FC<Props> = ({
  required = false,
  label,
  supportingText,
  width,
  recommendText,
}) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { uploadIcon, status, icon, setIcon, name, setName } = useFileUpload()
  const [errors, setErrors] = useState('')

  const ContainerWidth = useMemo(() => {
    return !width ? '100%' : `${width}px`
  }, [width])

  const IconInputContariner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  `

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
    ${getBasicFont(currentTypo.label.large)};
  `
  const SupportingText = styled.span`
    color: ${currentTheme.error};
    ${getBasicFont(currentTypo.body.small)};
  `

  const RequiredMark = styled.span`
    padding: 0 4px;
    color: ${currentTheme.error};
    ${getBasicFont(currentTypo.label.large)};
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

  const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
  `

  const DropzoneText = styled.p`
    color: ${currentTheme.onPrimaryContainer};
    ${getBasicFont(currentTypo.title.medium)};
  `

  const RecommendText = styled.p`
    color: ${currentTheme.onPrimaryContainer};
    ${getBasicFont(currentTypo.body.small)};
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
    ${getBasicFont(currentTypo.title.small)};
  `
  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
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
          await uploadIcon(acceptedFiles[0])
          const objectURL = URL.createObjectURL(acceptedFiles[0])
          const colors = await extractColors(objectURL)
          URL.revokeObjectURL(objectURL)
          setErrors('')
        }
      }
    },
    [uploadIcon],
  )

  const dropzoneRef = createRef<DropzoneRef>()

  const clearFile = () => {
    setIcon('')
    setName('')
  }

  return (
    <IconInputContariner>
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
            {icon && name ? (
              <>
                <Plate name={name} pfp={icon}></Plate>
                <IconButton
                  icon={ICONS.CROSS}
                  size={'S'}
                  mainColor={currentTheme.depth1}
                  backgroundColor={currentTheme.outline}
                  onClick={() => clearFile()}
                />
              </>
            ) : (
              <>
                <FilePreviewText>No File yet</FilePreviewText>
                <FilePreviewText>Upload</FilePreviewText>


              </>
            )}
          </>
        )}
      </FilePreviewContainer>
      <Dropzone ref={dropzoneRef} onDrop={onDrop} maxFiles={1} maxSize={MAX_SIZE}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <DropzoneContainer {...getRootProps()}>
            <DropzoneInput {...getInputProps()} />
            <DropzoneContent>
              <Icon
                icon={ICONS.ADD_FILE}
                size={'XXL'}
                mainColor={currentTheme.onPrimaryContainer}
              />
              <TextContainer>
                <DropzoneText>{isDragActive ? 'Drop Here' : 'Upload Files'}</DropzoneText>
                {recommendText && <RecommendText>{recommendText}</RecommendText>}
              </TextContainer>
            </DropzoneContent>
          </DropzoneContainer>
        )}
      </Dropzone>
    </IconInputContariner>
  )
}
