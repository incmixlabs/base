'use client'

import {
  AlertCircle,
  Archive,
  CheckCircle2,
  File,
  FileText,
  Film,
  Image as ImageIcon,
  Loader2,
  Music,
  Upload,
  X,
} from 'lucide-react'
import * as React from 'react'
import { type Accept, type FileRejection, useDropzone } from 'react-dropzone'
import { IconButton } from '@/elements/button/IconButton'
import { Image } from '@/elements/image/Image'
import { Progress } from '@/elements/progress/Progress'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { fileUploadSizeVar } from '@/theme/runtime/component-vars'
import { useFieldGroup } from './FieldGroupContext'
import type { FileUploadProps, UploadedFile } from './file-upload.props'
import { resolveFormSize } from './form-size'

export {
  type FileUploadProps,
  type FileUploadVariant,
  type UploadedFile,
  type UploadedFileStatus,
  uploadedFileStatuses,
} from './file-upload.props'

// ============================================================================
// Helpers
// ============================================================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)))
  return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

function getFileIcon(file: File): React.ReactNode {
  const type = file.type
  if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5" />
  if (type.startsWith('video/')) return <Film className="h-5 w-5" />
  if (type.startsWith('audio/')) return <Music className="h-5 w-5" />
  if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
    return <FileText className="h-5 w-5" />
  }
  if (type.includes('zip') || type.includes('rar') || type.includes('tar') || type.includes('gz')) {
    return <Archive className="h-5 w-5" />
  }
  return <File className="h-5 w-5" />
}

function getAcceptDescription(accept?: Accept): string {
  if (!accept) return 'All files'
  const types: string[] = []
  for (const [mimeType, extensions] of Object.entries(accept)) {
    if (mimeType.includes('image')) types.push('Images')
    else if (mimeType.includes('video')) types.push('Videos')
    else if (mimeType.includes('audio')) types.push('Audio')
    else if (mimeType.includes('pdf')) types.push('PDF')
    else if (extensions.length > 0) types.push(extensions.join(', ').toUpperCase())
  }
  return [...new Set(types)].join(', ') || 'All files'
}

// ============================================================================
// File Item Component
// ============================================================================

interface FileItemProps {
  file: UploadedFile
  onRemove: () => void
  disabled?: boolean
}

const FileItem: React.FC<FileItemProps> = ({ file, onRemove, disabled }) => {
  const isImage = file.file.type.startsWith('image/')

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group">
      {/* Preview or Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-background border flex items-center justify-center overflow-hidden">
        {isImage && file.preview ? (
          <Image src={file.preview} alt={file.file.name} objectFit="cover" className="h-full w-full" />
        ) : (
          <span className="text-muted-foreground">{getFileIcon(file.file)}</span>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.file.size)}
          {file.status === 'error' && file.error && <span className="text-destructive ml-2">{file.error}</span>}
        </p>

        {/* Progress bar */}
        {file.status === 'uploading' && <Progress value={file.progress} size="xs" className="mt-1.5" />}
      </div>

      {/* Status Icon / Remove Button */}
      <div className="flex-shrink-0">
        {file.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {file.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
        {file.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
        {(file.status === 'pending' || file.status === 'success' || file.status === 'error') && (
          <IconButton
            onClick={onRemove}
            disabled={disabled}
            className={cn(
              'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring',
              disabled && 'pointer-events-none',
            )}
            variant="soft"
            color={SemanticColor.primary}
            radius="full"
            size="xs"
            aria-label={`Remove ${file.file.name}`}
          >
            <X className="h-3 w-3" />
          </IconButton>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// File List with Status Sections Component
// ============================================================================

interface FileListWithSectionsProps {
  files: UploadedFile[]
  onRemove: (file: UploadedFile) => void
  disabled?: boolean
}

const FileListWithSections: React.FC<FileListWithSectionsProps> = ({ files, onRemove, disabled }) => {
  const uploadingFiles = files.filter(f => f.status === 'pending' || f.status === 'uploading')
  const completedFiles = files.filter(f => f.status === 'success' || f.status === 'error')

  return (
    <div className="mt-4 space-y-4">
      {/* Uploading Section */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <h4 className="text-sm font-medium text-muted-foreground">Uploading ({uploadingFiles.length})</h4>
          </div>
          <div className="space-y-2">
            {uploadingFiles.map(file => (
              <FileItem key={file.id} file={file} onRemove={() => onRemove(file)} disabled={disabled} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Section */}
      {completedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <h4 className="text-sm font-medium text-muted-foreground">Completed ({completedFiles.length})</h4>
          </div>
          <div className="space-y-2">
            {completedFiles.map(file => (
              <FileItem key={file.id} file={file} onRemove={() => onRemove(file)} disabled={disabled} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

/** FileUpload export. */
export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      variant = 'default',
      size: sizeProp,
      radius: radiusProp,
      error = false,
      accept,
      maxSize = 10 * 1024 * 1024, // 10MB default
      maxFiles = 10,
      multiple = true,
      disabled = false,
      value,
      onChange,
      onFilesAdded,
      onFileRemove,
      onUpload,
      placeholder,
      description,
      icon,
      showFileList = true,
      showStatusSections = false,
      className,
      style,
      id,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-required': ariaRequired,
    },
    ref,
  ) => {
    'use no memo'
    const reactId = React.useId()
    const fieldGroup = useFieldGroup()
    const size = resolveFormSize(sizeProp ?? fieldGroup.size)
    const radius = useThemeRadius(radiusProp)
    const radiusStyles = getRadiusStyles(radius)
    const [files, setFiles] = React.useState<UploadedFile[]>(() => value ?? [])
    const filesRef = React.useRef<UploadedFile[]>(files)

    // Keep ref in sync with state for cleanup
    React.useEffect(() => {
      filesRef.current = files
    }, [files])

    // Sync with controlled value (only when explicitly provided)
    React.useEffect(() => {
      if (value !== undefined) setFiles(value)
    }, [value])

    // Cleanup previews on unmount
    React.useEffect(() => {
      return () => {
        for (const f of filesRef.current) {
          if (f.preview) URL.revokeObjectURL(f.preview)
        }
      }
    }, [])

    const handleFilesAdded = React.useCallback(
      async (acceptedFiles: File[]) => {
        // Calculate available slots to prevent uploading files that won't be tracked
        const availableSlots = multiple ? Math.max(0, maxFiles - files.length) : files.length >= 1 ? 0 : 1
        const accepted = availableSlots > 0 ? acceptedFiles.slice(0, availableSlots) : []
        if (accepted.length === 0) return

        // Create UploadedFile objects only for files that fit within maxFiles
        const newFiles: UploadedFile[] = accepted.map(file => ({
          id: generateId(),
          file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          progress: 0,
          status: 'pending' as const,
        }))

        const updatedFiles = [...files, ...newFiles]
        setFiles(updatedFiles)
        onChange?.(updatedFiles)
        onFilesAdded?.(accepted)

        // If onUpload is provided, handle upload automatically
        if (onUpload) {
          for (const uploadFile of newFiles) {
            // Update status to uploading
            setFiles(prev => prev.map(f => (f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f)))

            try {
              await onUpload(uploadFile.file, progress => {
                setFiles(prev => prev.map(f => (f.id === uploadFile.id ? { ...f, progress } : f)))
              })

              // Success
              setFiles(prev => {
                const updated = prev.map(f =>
                  f.id === uploadFile.id ? { ...f, status: 'success' as const, progress: 100 } : f,
                )
                onChange?.(updated)
                return updated
              })
            } catch (error) {
              // Error
              setFiles(prev => {
                const updated = prev.map(f =>
                  f.id === uploadFile.id
                    ? {
                        ...f,
                        status: 'error' as const,
                        error: error instanceof Error ? error.message : 'Upload failed',
                      }
                    : f,
                )
                onChange?.(updated)
                return updated
              })
            }
          }
        }
      },
      [files, maxFiles, multiple, onChange, onFilesAdded, onUpload],
    )

    const handleRemove = React.useCallback(
      (fileToRemove: UploadedFile) => {
        if (fileToRemove.preview) {
          URL.revokeObjectURL(fileToRemove.preview)
        }
        const updatedFiles = files.filter(f => f.id !== fileToRemove.id)
        setFiles(updatedFiles)
        onChange?.(updatedFiles)
        onFileRemove?.(fileToRemove)
      },
      [files, onChange, onFileRemove],
    )

    const isPickerDisabled = disabled || (!multiple && files.length >= 1) || files.length >= maxFiles

    const onDrop = React.useCallback(
      (acceptedFiles: File[], _nextRejectedFiles: FileRejection[]) => {
        if (isPickerDisabled) return
        if (acceptedFiles.length > 0) {
          handleFilesAdded(acceptedFiles)
        }
      },
      [handleFilesAdded, isPickerDisabled],
    )

    const { getRootProps, getInputProps, inputRef, isDragActive, isDragReject } = useDropzone({
      onDrop,
      accept,
      maxSize,
      maxFiles: multiple ? Math.max(0, maxFiles - files.length) : 1,
      multiple,
      noClick: true,
      disabled,
    })

    React.useImperativeHandle(ref, () => inputRef.current, [inputRef])

    const handleManualOpen = React.useCallback(
      (event?: React.MouseEvent | React.KeyboardEvent) => {
        event?.preventDefault()
        event?.stopPropagation()
        if (isPickerDisabled) return
        inputRef.current?.click()
      },
      [inputRef, isPickerDisabled],
    )

    const defaultPlaceholder = isDragActive
      ? 'Drop files here...'
      : multiple
        ? 'Drag & drop files here, or click to select'
        : 'Drag & drop a file here, or click to select'

    const defaultDescription = `${getAcceptDescription(accept)} up to ${formatFileSize(maxSize)}${multiple ? ` (max ${maxFiles} files)` : ''}`
    const titleId = `${id ?? reactId}-title`
    const descriptionId = `${id ?? reactId}-description`
    const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined

    const containerPaddingByVariant = {
      default: { xs: '1rem', sm: '1.25rem', md: '2rem', lg: '2.5rem' },
      minimal: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.25rem' },
      card: { xs: '1rem', sm: '1.25rem', md: '1.5rem', lg: '2rem' },
    } as const

    const iconShellSize = {
      xs: '0.5rem',
      sm: '0.625rem',
      md: '0.75rem',
      lg: '0.875rem',
    } as const

    const iconSize = {
      xs: '1rem',
      sm: '1.25rem',
      md: '1.5rem',
      lg: '1.75rem',
    } as const

    const titleSize = {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '0.875rem',
      lg: '1rem',
    } as const

    const descriptionSize = {
      xs: '11px',
      sm: '0.75rem',
      md: '0.75rem',
      lg: '0.875rem',
    } as const

    const containerPaddingVars = {
      default: fileUploadSizeVar(size, 'defaultPadding', containerPaddingByVariant.default[size]),
      minimal: fileUploadSizeVar(size, 'minimalPadding', containerPaddingByVariant.minimal[size]),
      card: fileUploadSizeVar(size, 'cardPadding', containerPaddingByVariant.card[size]),
    } as const

    const iconShellPaddingVar = fileUploadSizeVar(size, 'iconShellPadding', iconShellSize[size])
    const iconSizeVar = fileUploadSizeVar(size, 'iconSize', iconSize[size])
    const titleFontSizeVar = fileUploadSizeVar(size, 'titleFontSize', titleSize[size])
    const descriptionFontSizeVar = fileUploadSizeVar(size, 'descriptionFontSize', descriptionSize[size])

    const dropzoneStyles = {
      '--file-upload-container-padding': containerPaddingVars[variant],
      '--file-upload-icon-shell-padding': iconShellPaddingVar,
      '--file-upload-icon-size': iconSizeVar,
      '--file-upload-title-font-size': titleFontSizeVar,
      '--file-upload-description-font-size': descriptionFontSizeVar,
      ...radiusStyles,
      ...style,
    } as React.CSSProperties

    return (
      <div className={cn('w-full', className)}>
        {/* Dropzone */}
        <div
          {...getRootProps({
            onClick: handleManualOpen,
            onKeyDown: event => {
              if (event.key === 'Enter' || event.key === ' ') {
                handleManualOpen(event)
              }
            },
            role: 'button',
            tabIndex: isPickerDisabled ? -1 : 0,
            'aria-disabled': isPickerDisabled || undefined,
            'aria-invalid': error || undefined,
            'aria-labelledby': [ariaLabelledBy, titleId].filter(Boolean).join(' ') || undefined,
            'aria-describedby': describedBy,
            'aria-required': ariaRequired || undefined,
          })}
          data-slot="file-upload-dropzone"
          data-invalid={error || undefined}
          style={dropzoneStyles}
          className={cn(
            'relative transition-all duration-200',
            isPickerDisabled ? 'cursor-not-allowed' : 'cursor-pointer',

            // Variant styles
            variant === 'default' && [
              'border-2 border-dashed rounded-[var(--element-border-radius)]',
              'p-[var(--file-upload-container-padding)]',
              !error && 'hover:border-primary/50 hover:bg-muted/50',
              isDragActive && 'border-primary bg-primary/5',
              isDragReject && 'border-destructive bg-destructive/5',
              error &&
                !isDragActive &&
                !isDragReject &&
                'border-destructive bg-destructive/5 hover:border-destructive/60',
              isPickerDisabled && 'opacity-50 cursor-not-allowed hover:border-input hover:bg-transparent',
            ],

            variant === 'minimal' && [
              'border border-input rounded-[var(--element-border-radius)]',
              'p-[var(--file-upload-container-padding)]',
              !error && 'hover:bg-muted/50',
              isDragActive && 'border-primary bg-primary/5',
              error && !isDragActive && 'border-destructive bg-destructive/5',
              isPickerDisabled && 'opacity-50 cursor-not-allowed',
            ],

            variant === 'card' && [
              'border rounded-[var(--element-border-radius)] bg-card shadow-sm',
              'p-[var(--file-upload-container-padding)]',
              !error && 'hover:shadow-md hover:border-primary/30',
              isDragActive && 'border-primary shadow-md',
              error && !isDragActive && 'border-destructive bg-destructive/5',
              isPickerDisabled && 'opacity-50 cursor-not-allowed hover:shadow-sm',
            ],
          )}
        >
          <input
            {...getInputProps({
              id,
            })}
          />

          <div className="flex flex-col items-center justify-center text-center gap-2">
            <div
              className={cn(
                'p-[var(--file-upload-icon-shell-padding)]',
                'rounded-full bg-muted transition-colors',
                !isPickerDisabled && 'hover:bg-muted/80',
                isDragActive && 'bg-primary/10',
              )}
              aria-hidden="true"
            >
              {icon ?? (
                <Upload
                  className={cn(
                    'h-[var(--file-upload-icon-size)] w-[var(--file-upload-icon-size)]',
                    'text-muted-foreground',
                    isDragActive && 'text-primary',
                  )}
                />
              )}
            </div>

            <div>
              <p id={titleId} className="text-[length:var(--file-upload-title-font-size)] font-medium">
                {placeholder || defaultPlaceholder}
              </p>
              <p
                id={descriptionId}
                className="mt-1 text-[length:var(--file-upload-description-font-size)] text-muted-foreground"
              >
                {description || defaultDescription}
              </p>
            </div>
          </div>
        </div>

        {/* File List */}
        {showFileList && files.length > 0 && !showStatusSections && (
          <div className="mt-4 space-y-2">
            {files.map(file => (
              <FileItem key={file.id} file={file} onRemove={() => handleRemove(file)} disabled={disabled} />
            ))}
          </div>
        )}

        {/* File List with Status Sections */}
        {showFileList && files.length > 0 && showStatusSections && (
          <FileListWithSections files={files} onRemove={handleRemove} disabled={disabled} />
        )}
      </div>
    )
  },
)

FileUpload.displayName = 'FileUpload'

// ============================================================================
// Preset accept configurations
// ============================================================================

/** acceptPresets export. */
export const acceptPresets = {
  images: {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
  },
  documents: {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
  },
  spreadsheets: {
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/csv': ['.csv'],
  },
  videos: {
    'video/*': ['.mp4', '.webm', '.mov', '.avi'],
  },
  audio: {
    'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
  },
} as const
