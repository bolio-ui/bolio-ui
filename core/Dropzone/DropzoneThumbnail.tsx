import React, { useEffect, useState } from 'react'
import styles from './Dropzone.module.css'

interface Props {
  file: File
  removeLabel: string
  disabled: boolean
  onRemove: () => void
}

// the format shown on the tile: the extension, or the subtype of the type
const formatOf = (file: File) => {
  const extension = file.name.includes('.')
    ? file.name.split('.').pop()
    : file.type.split('/')[1]
  return (extension || 'file').slice(0, 4).toUpperCase()
}

function DropzoneThumbnail({ file, removeLabel, disabled, onRemove }: Props) {
  // only images can be shown as they are; the other formats get an icon
  const previewable = file.type.startsWith('image/')
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    if (!previewable) return
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file, previewable])

  return (
    <li className={styles.thumbnail}>
      <div className={styles.tile}>
        {previewable ? (
          // the name below the tile describes the file
          url && <img src={url} alt="" className={styles.preview} />
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="2.5em"
            height="2.5em"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.fileIcon}
            aria-hidden="true"
          >
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
          </svg>
        )}
        <span className={styles.format}>{formatOf(file)}</span>
        <button
          type="button"
          className={styles.remove}
          aria-label={removeLabel}
          disabled={disabled}
          onClick={onRemove}
        >
          <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <span className={styles.name} title={file.name}>
        {file.name}
      </span>
    </li>
  )
}

export default DropzoneThumbnail
