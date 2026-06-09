import type * as React from 'react'
import type { Accept } from 'react-dropzone'
import type { Radius, Size } from '@/theme/tokens'

export type FileUploadVariant = 'default' | 'minimal' | 'card'
export type FileUploadFileListDisplay = 'full' | 'list' | 'thumbnail'

export const uploadedFileStatuses = ['pending', 'uploading', 'success', 'error'] as const

export type UploadedFileStatus = (typeof uploadedFileStatuses)[number]

export type FileUploadConfirmationConfig = {
  /** Whether confirmation should be shown. Defaults to true when a config object is provided. */
  ask?: boolean
  /** Dialog title */
  title?: string
  /** Dialog message */
  message?: string
  /** Confirm button label */
  confirmLabel?: string
  /** Cancel button label */
  cancelLabel?: string
}

export interface UploadedFile {
  /** Unique identifier */
  id: string
  /** Original file object */
  file: File
  /** Preview URL for images */
  preview?: string
  /** Upload progress (0-100) */
  progress: number
  /** Upload status */
  status: UploadedFileStatus
  /** Error message if status is error */
  error?: string
}

export interface FileUploadProps {
  /** Visual variant */
  variant?: FileUploadVariant
  /** Shared form size token */
  size?: Size
  /** Border radius token */
  radius?: Radius
  /** Whether the field is in an error state */
  error?: boolean
  /** Accepted file types (e.g., { 'image/*': ['.png', '.jpg'] }) */
  accept?: Accept
  /** Maximum file size in bytes */
  maxSize?: number
  /** Maximum number of files */
  maxFiles?: number
  /** Allow multiple files */
  multiple?: boolean
  /** Whether the dropzone is disabled */
  disabled?: boolean
  /** Current files */
  value?: UploadedFile[]
  /** Called when files change */
  onChange?: (files: UploadedFile[]) => void
  /** Called when files are dropped/selected (for custom upload handling) */
  onFilesAdded?: (files: File[]) => void
  /** Called when a file is removed */
  onFileRemove?: (file: UploadedFile) => void
  /** Custom upload function - if provided, handles upload automatically */
  onUpload?: (file: File, onProgress: (progress: number) => void) => Promise<void>
  /** Ask for confirmation before removing a file */
  confirmBeforeRemove?: boolean | FileUploadConfirmationConfig
  /** Ask for confirmation before accepting newly selected files */
  confirmBeforeUpload?: boolean | FileUploadConfirmationConfig
  /** Placeholder text */
  placeholder?: string
  /** Description text */
  description?: string
  /** Icon shown in the dropzone trigger */
  icon?: React.ReactNode
  /** Show file list */
  showFileList?: boolean
  /** File list display style */
  fileListDisplay?: FileUploadFileListDisplay
  /** Hide the dropzone when the max file count has been reached */
  hideDropzoneWhenFull?: boolean
  /** Group files by status (Uploading / Completed sections) */
  showStatusSections?: boolean
  /** Additional class name */
  className?: string
  /** Inline styles for the dropzone surface */
  style?: React.CSSProperties
  /** Input id */
  id?: string
  /** External labelling relationship for the focusable dropzone */
  'aria-labelledby'?: string
  /** Described-by relationship for assistive tech */
  'aria-describedby'?: string
  /** Required semantics for the focusable dropzone */
  'aria-required'?: boolean
}
