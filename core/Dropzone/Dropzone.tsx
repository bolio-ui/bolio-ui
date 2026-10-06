import React, { useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import DropzoneThumbnail from './DropzoneThumbnail'
import styles from './Dropzone.module.css'

export type FileRejectionReason =
  'file-type' | 'file-too-large' | 'too-many-files'

export interface FileRejection {
  file: File
  reason: FileRejectionReason
}

interface Props {
  // same format as the `accept` of a file input: ".pdf", "image/*", "image/png"
  accept?: string
  multiple?: boolean
  // bytes
  maxSize?: number
  // only with `multiple`; one file otherwise
  maxFiles?: number
  // called with the files that passed and the ones that did not, from a drop or
  // from the file picker
  onDrop?: (accepted: Array<File>, rejected: Array<FileRejection>) => void
  // keeps the accepted files and shows them below the area as thumbnails, with
  // the format of each one and a preview of the images
  thumbnails?: boolean
  // the files shown with `thumbnails`, to control them
  value?: Array<File>
  onChange?: (files: Array<File>) => void
  removeLabel?: (file: File) => string
  disabled?: boolean
  className?: string
}

type NativeAttrs = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  keyof Props | 'type' | 'value' | 'defaultValue' | 'onChange'
>
export type DropzoneProps = Props & NativeAttrs

const matchesAccept = (file: File, accept?: string) => {
  if (!accept) return true
  const name = file.name.toLowerCase()
  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) =>
      token.startsWith('.')
        ? name.endsWith(token)
        : token.endsWith('/*')
          ? file.type.toLowerCase().startsWith(token.slice(0, -1))
          : file.type.toLowerCase() === token
    )
}

const DropzoneComponent = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<DropzoneProps>
>(
  (
    {
      accept,
      multiple = false,
      maxSize,
      maxFiles,
      onDrop,
      thumbnails = false,
      value,
      onChange,
      removeLabel = (file) => `Remove ${file.name}`,
      disabled = false,
      className = '',
      children = 'Drag files here or click to choose them',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const [dragging, setDragging] = useState(false)
    const [selfFiles, setSelfFiles] = useState<Array<File>>([])
    const files = value !== undefined ? value : selfFiles

    const updateFiles = (next: Array<File>) => {
      if (value === undefined) setSelfFiles(next)
      if (onChange) onChange(next)
    }

    const receive = (list: FileList | null) => {
      if (disabled || !list) return
      // with thumbnails, the files already there count against the limit
      const kept = thumbnails && multiple ? files : []
      const limit = multiple ? (maxFiles ?? Infinity) - kept.length : 1
      const accepted: Array<File> = []
      const rejected: Array<FileRejection> = []
      Array.from(list).forEach((file) => {
        if (!matchesAccept(file, accept))
          rejected.push({ file, reason: 'file-type' })
        else if (maxSize !== undefined && file.size > maxSize)
          rejected.push({ file, reason: 'file-too-large' })
        else if (accepted.length >= limit)
          rejected.push({ file, reason: 'too-many-files' })
        else accepted.push(file)
      })
      if (thumbnails && accepted.length)
        updateFiles(multiple ? [...kept, ...accepted] : accepted)
      if (onDrop) onDrop(accepted, rejected)
    }

    const dragHandler = (event: React.DragEvent<HTMLLabelElement>) => {
      if (disabled) return
      event.preventDefault()
      // moving over a child fires a dragleave on the area
      if (
        event.type === 'dragleave' &&
        event.currentTarget.contains(event.relatedTarget as Node | null)
      )
        return
      setDragging(event.type !== 'dragleave')
    }

    const dropHandler = (event: React.DragEvent<HTMLLabelElement>) => {
      if (disabled) return
      event.preventDefault()
      setDragging(false)
      receive(event.dataTransfer.files)
    }

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      receive(event.target.files)
      // the same file can be chosen again
      event.target.value = ''
    }

    const dropzoneStyle = {
      width: SCALES.width(1, '100%'),
      height: SCALES.height(1, 'auto'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      fontSize: SCALES.font(0.875),
      '--dropzone-color': theme.palette.accents_6,
      '--dropzone-bg': theme.palette.background,
      '--dropzone-border': theme.palette.accents_3,
      '--dropzone-hover-border': theme.palette.accents_5,
      '--dropzone-active': theme.palette.primary,
      '--dropzone-radius': theme.layout.radius,
      '--dropzone-tile-bg': theme.palette.accents_1,
      '--dropzone-tile-color': theme.palette.accents_4,
      '--dropzone-name-color': theme.palette.accents_6,
      '--dropzone-badge-bg': theme.palette.foreground,
      '--dropzone-badge-color': theme.palette.background,
      '--dropzone-remove-bg': theme.palette.background,
      '--dropzone-remove-color': theme.palette.accents_6,
      '--dropzone-remove-hover-color': theme.palette.foreground,
      ...style
    } as React.CSSProperties

    return (
      <div className={className} style={dropzoneStyle}>
        <label
          className={useClasses(styles.dropzone, {
            [styles.dragging]: dragging,
            [styles.disabled]: disabled
          })}
          onDragEnter={dragHandler}
          onDragOver={dragHandler}
          onDragLeave={dragHandler}
          onDrop={dropHandler}
        >
          <input
            ref={ref}
            type="file"
            className={styles.input}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={changeHandler}
            {...props}
          />
          <span className={styles.content}>{children}</span>
        </label>
        {thumbnails && files.length > 0 && (
          <ul className={styles.thumbnails}>
            {files.map((file, index) => (
              <DropzoneThumbnail
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                file={file}
                removeLabel={removeLabel(file)}
                disabled={disabled}
                onRemove={() =>
                  updateFiles(files.filter((_, i) => i !== index))
                }
              />
            ))}
          </ul>
        )}
      </div>
    )
  }
)

DropzoneComponent.displayName = 'BolioUIDropzone'
const Dropzone = withScale(DropzoneComponent)
export default Dropzone
