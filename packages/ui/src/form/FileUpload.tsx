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
import { Button } from '@/elements/button/Button'
import { IconButton } from '@/elements/button/IconButton'
import { AlertDialog } from '@/elements/dialog/AlertDialog'
import { Image } from '@/elements/image/Image'
import { Progress } from '@/elements/progress/Progress'
import { getRadiusStyles, useThemeRadius } from '@/elements/utils'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { fileUploadSizeVar } from '@/theme/runtime/component-vars'
import { Text } from '@/typography/text/Text'
import { useFieldGroup } from './FieldGroupContext'
import type {
  FileUploadConfirmationConfig,
  FileUploadFileListDisplay,
  FileUploadProps,
  UploadedFile,
} from './file-upload.props'
import { resolveFormSize } from './form-size'

export {
  type FileUploadFileListDisplay,
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

function resolveConfirmationConfig(
  value: boolean | FileUploadConfirmationConfig | undefined,
  defaults: Required<FileUploadConfirmationConfig>,
): Required<FileUploadConfirmationConfig> | null {
  if (value === undefined || value === false) return null
  if (value === true) return defaults
  if (value.ask === false) return null
  return { ...defaults, ...value }
}

function buildUploadConfirmationDefaults(files: File[]): Required<FileUploadConfirmationConfig> {
  return {
    ask: true,
    cancelLabel: 'Cancel',
    confirmLabel: 'Upload',
    message:
      files.length === 1 ? `Add "${files[0]?.name}" to this upload field?` : 'Add these files to this upload field?',
    title: files.length === 1 ? 'Upload this file?' : `Upload ${files.length} files?`,
  }
}

function buildRemoveConfirmationDefaults(file: UploadedFile): Required<FileUploadConfirmationConfig> {
  return {
    ask: true,
    cancelLabel: 'Keep file',
    confirmLabel: file.status === 'uploading' ? 'Cancel upload' : 'Remove',
    message:
      file.status === 'uploading'
        ? `Cancel upload "${file.file.name}" from this field?`
        : `Remove "${file.file.name}"? This action cannot be undone.`,
    title: file.status === 'uploading' ? 'Cancel this upload?' : 'Remove file?',
  }
}

// ============================================================================
// File Item Component
// ============================================================================

interface FileItemProps {
  file: UploadedFile
  onRemove: () => void
  disabled?: boolean
  display?: FileUploadFileListDisplay
}

const FileItem: React.FC<FileItemProps> = ({ file, onRemove, disabled, display = 'full' }) => {
  const isImage = file.file.type.startsWith('image/')
  const isThumbnailDisplay = display === 'thumbnail'

  return (
    <Flex
      align="center"
      bg={isThumbnailDisplay ? undefined : 'neutral-surface'}
      gap={isThumbnailDisplay ? '1' : '3'}
      p={isThumbnailDisplay ? '1' : '3'}
      radius="lg"
      className="group"
    >
      {/* Preview or Icon */}
      <Flex
        align="center"
        justify="center"
        flexShrink="0"
        overflow="hidden"
        radius="md"
        bg="neutral-background"
        borderColor="neutral-border-subtle"
        className={cn(isThumbnailDisplay ? 'h-12 w-12' : 'h-10 w-10')}
      >
        {isImage && file.preview ? (
          <Image src={file.preview} alt={file.file.name} objectFit="cover" className="h-full w-full" />
        ) : (
          <Text as="span" color="neutral" variant="muted">
            {getFileIcon(file.file)}
          </Text>
        )}
      </Flex>

      {/* File Info */}
      {!isThumbnailDisplay ? (
        <Flex direction="column" flexBasis="0%" flexGrow="1" className="min-w-0">
          <Text size="sm" weight="medium" truncate>
            {file.file.name}
          </Text>
          <Text as="p" size="xs" color="neutral" variant="muted">
            {formatFileSize(file.file.size)}
            {file.status === 'error' && file.error && (
              <Text as="span" size="xs" color="error" ml="2">
                {file.error}
              </Text>
            )}
          </Text>

          {/* Progress bar */}
          {file.status === 'uploading' && <Progress value={file.progress} size="xs" className="mt-1.5" />}
        </Flex>
      ) : null}

      {/* Status Icon / Remove Button */}
      <Flex align="center" gap="1" flexShrink="0">
        {file.status === 'uploading' && (
          <Text asChild color="neutral" variant="muted">
            <Loader2 className="h-4 w-4 animate-spin" />
          </Text>
        )}
        {file.status === 'success' && (
          <Text asChild color="success" variant="soft">
            <CheckCircle2 className="h-4 w-4" />
          </Text>
        )}
        {file.status === 'error' && (
          <Text asChild color="error">
            <AlertCircle className="h-4 w-4" />
          </Text>
        )}
        {(file.status === 'pending' ||
          file.status === 'uploading' ||
          file.status === 'success' ||
          file.status === 'error') && (
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
            title={file.status === 'uploading' ? `Cancel upload ${file.file.name}` : `Remove ${file.file.name}`}
            aria-label={file.status === 'uploading' ? `Cancel upload ${file.file.name}` : `Remove ${file.file.name}`}
          >
            <X className="h-3 w-3" />
          </IconButton>
        )}
      </Flex>
    </Flex>
  )
}

// ============================================================================
// File List with Status Sections Component
// ============================================================================

interface FileListWithSectionsProps {
  files: UploadedFile[]
  onRemove: (file: UploadedFile) => void
  disabled?: boolean
  display?: FileUploadFileListDisplay
}

const FileListWithSections: React.FC<FileListWithSectionsProps> = ({ files, onRemove, disabled, display }) => {
  const uploadingFiles = files.filter(f => f.status === 'pending' || f.status === 'uploading')
  const completedFiles = files.filter(f => f.status === 'success' || f.status === 'error')

  return (
    <Flex direction="column" gap="4" mt="4">
      {/* Uploading Section */}
      {uploadingFiles.length > 0 && (
        <Flex direction="column" gap="2">
          <Flex align="center" gap="2">
            <Text asChild color="primary">
              <Loader2 className="h-4 w-4 animate-spin" />
            </Text>
            <Text size="sm" weight="medium" color="neutral" variant="muted">
              Uploading ({uploadingFiles.length})
            </Text>
          </Flex>
          <Flex direction="column" gap="2">
            {uploadingFiles.map(file => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={() => onRemove(file)}
                disabled={disabled}
                display={display}
              />
            ))}
          </Flex>
        </Flex>
      )}

      {/* Completed Section */}
      {completedFiles.length > 0 && (
        <Flex direction="column" gap="2">
          <Flex align="center" gap="2">
            <Text asChild color="success" variant="soft">
              <CheckCircle2 className="h-4 w-4" />
            </Text>
            <Text size="sm" weight="medium" color="neutral" variant="muted">
              Completed ({completedFiles.length})
            </Text>
          </Flex>
          <Flex direction="column" gap="2">
            {completedFiles.map(file => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={() => onRemove(file)}
                disabled={disabled}
                display={display}
              />
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
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
      disabled: disabledProp = false,
      value,
      onChange,
      onFilesAdded,
      onFileRemove,
      onUpload,
      confirmBeforeUpload = false,
      confirmBeforeRemove = false,
      placeholder,
      description,
      icon,
      showFileList = true,
      fileListDisplay = 'full',
      hideDropzoneWhenFull = false,
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
    const radius = useThemeRadius(radiusProp ?? fieldGroup.radius)
    const radiusStyles = getRadiusStyles(radius)
    const disabled = disabledProp || fieldGroup.disabled
    const [files, setFiles] = React.useState<UploadedFile[]>(() => value ?? [])
    const [pendingUploadFiles, setPendingUploadFiles] = React.useState<File[] | null>(null)
    const [pendingRemoveFile, setPendingRemoveFile] = React.useState<UploadedFile | null>(null)
    const isControlled = value !== undefined
    const resolvedFiles = value ?? files
    const filesRef = React.useRef<UploadedFile[]>(resolvedFiles)

    const commitFiles = React.useCallback(
      (nextFiles: UploadedFile[]) => {
        if (!isControlled) {
          setFiles(nextFiles)
        }
        onChange?.(nextFiles)
      },
      [isControlled, onChange],
    )

    // Keep ref in sync with state for cleanup
    React.useEffect(() => {
      filesRef.current = resolvedFiles
    }, [resolvedFiles])

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
        const availableSlots = multiple
          ? Math.max(0, maxFiles - resolvedFiles.length)
          : resolvedFiles.length >= 1
            ? 0
            : 1
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

        let currentFiles = [...resolvedFiles, ...newFiles]
        commitFiles(currentFiles)
        onFilesAdded?.(accepted)

        // If onUpload is provided, handle upload automatically
        if (onUpload) {
          for (const uploadFile of newFiles) {
            // Update status to uploading
            currentFiles = currentFiles.map(f => (f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f))
            commitFiles(currentFiles)

            try {
              await onUpload(uploadFile.file, progress => {
                currentFiles = currentFiles.map(f => (f.id === uploadFile.id ? { ...f, progress } : f))
                commitFiles(currentFiles)
              })

              // Success
              currentFiles = currentFiles.map(f =>
                f.id === uploadFile.id ? { ...f, status: 'success' as const, progress: 100 } : f,
              )
              commitFiles(currentFiles)
            } catch (error) {
              // Error
              currentFiles = currentFiles.map(f =>
                f.id === uploadFile.id
                  ? {
                      ...f,
                      status: 'error' as const,
                      error: error instanceof Error ? error.message : 'Upload failed',
                    }
                  : f,
              )
              commitFiles(currentFiles)
            }
          }
        }
      },
      [commitFiles, maxFiles, multiple, onFilesAdded, onUpload, resolvedFiles],
    )

    const handleRemoveConfirmed = React.useCallback(
      (fileToRemove: UploadedFile) => {
        if (fileToRemove.preview) {
          URL.revokeObjectURL(fileToRemove.preview)
        }
        const updatedFiles = resolvedFiles.filter(f => f.id !== fileToRemove.id)
        commitFiles(updatedFiles)
        onFileRemove?.(fileToRemove)
      },
      [commitFiles, onFileRemove, resolvedFiles],
    )

    const requestRemove = React.useCallback(
      (fileToRemove: UploadedFile) => {
        const confirmation = resolveConfirmationConfig(
          confirmBeforeRemove,
          buildRemoveConfirmationDefaults(fileToRemove),
        )
        if (!confirmation) {
          handleRemoveConfirmed(fileToRemove)
          return
        }
        setPendingRemoveFile(fileToRemove)
      },
      [confirmBeforeRemove, handleRemoveConfirmed],
    )

    const isPickerDisabled = disabled || (!multiple && resolvedFiles.length >= 1) || resolvedFiles.length >= maxFiles
    const shouldHideDropzone = hideDropzoneWhenFull && isPickerDisabled && !disabled

    const onDrop = React.useCallback(
      (acceptedFiles: File[], _nextRejectedFiles: FileRejection[]) => {
        if (isPickerDisabled) return
        if (acceptedFiles.length > 0) {
          const confirmation = resolveConfirmationConfig(
            confirmBeforeUpload,
            buildUploadConfirmationDefaults(acceptedFiles),
          )
          if (confirmation) {
            setPendingUploadFiles(acceptedFiles)
            return
          }
          handleFilesAdded(acceptedFiles)
        }
      },
      [confirmBeforeUpload, handleFilesAdded, isPickerDisabled],
    )

    const { getRootProps, getInputProps, inputRef, isDragActive, isDragReject } = useDropzone({
      onDrop,
      accept,
      maxSize,
      maxFiles: multiple ? Math.max(0, maxFiles - resolvedFiles.length) : 1,
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

    const uploadConfirmation = pendingUploadFiles
      ? resolveConfirmationConfig(confirmBeforeUpload, buildUploadConfirmationDefaults(pendingUploadFiles))
      : null

    const removeConfirmation = pendingRemoveFile
      ? resolveConfirmationConfig(confirmBeforeRemove, buildRemoveConfirmationDefaults(pendingRemoveFile))
      : null

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
            shouldHideDropzone && 'hidden',
            isPickerDisabled ? 'cursor-not-allowed' : 'cursor-pointer',

            // Variant styles
            variant === 'default' && [
              'border-2 border-dashed rounded-[var(--element-border-radius)]',
              'p-[var(--file-upload-container-padding)]',
              !error &&
                'hover:border-[color:var(--color-primary-border)] hover:bg-[var(--color-neutral-surface-hover)]',
              isDragActive && 'border-[color:var(--color-primary-border)] bg-[var(--color-primary-surface)]',
              isDragReject && 'border-[color:var(--color-error-border)] bg-[var(--color-error-surface)]',
              error &&
                !isDragActive &&
                !isDragReject &&
                'border-[color:var(--color-error-border)] bg-[var(--color-error-surface)] hover:border-[color:var(--color-error-border)]',
              isPickerDisabled &&
                'opacity-50 cursor-not-allowed hover:border-[color:var(--color-neutral-border)] hover:bg-transparent',
            ],

            variant === 'minimal' && [
              'border border-[color:var(--color-neutral-border)] rounded-[var(--element-border-radius)]',
              'p-[var(--file-upload-container-padding)]',
              !error && 'hover:bg-[var(--color-neutral-surface-hover)]',
              isDragActive && 'border-[color:var(--color-primary-border)] bg-[var(--color-primary-surface)]',
              isDragReject && 'border-[color:var(--color-error-border)] bg-[var(--color-error-surface)]',
              error && !isDragActive && 'border-[color:var(--color-error-border)] bg-[var(--color-error-surface)]',
              isPickerDisabled && 'opacity-50 cursor-not-allowed',
            ],

            variant === 'card' && [
              'border rounded-[var(--element-border-radius)] bg-[var(--color-neutral-background)] shadow-sm',
              'p-[var(--file-upload-container-padding)]',
              !error && 'hover:shadow-md hover:border-[color:var(--color-primary-border)]',
              isDragActive && 'border-[color:var(--color-primary-border)] shadow-md',
              isDragReject && 'border-[color:var(--color-error-border)] bg-[var(--color-error-surface)]',
              error && !isDragActive && 'border-[color:var(--color-error-border)] bg-[var(--color-error-surface)]',
              isPickerDisabled && 'opacity-50 cursor-not-allowed hover:shadow-sm',
            ],
          )}
        >
          <input
            {...getInputProps({
              id,
            })}
          />

          <Flex direction="column" align="center" justify="center" gap="2" className="text-center">
            <Flex
              align="center"
              justify="center"
              bg={isDragActive ? 'primary-soft' : 'neutral-surface'}
              radius="full"
              className={cn(
                'p-[var(--file-upload-icon-shell-padding)]',
                'transition-colors',
                !isPickerDisabled && 'hover:bg-[var(--color-neutral-surface-hover)]',
              )}
              aria-hidden="true"
            >
              {icon ?? (
                <Text asChild color={isDragActive ? 'primary' : 'neutral'} variant={isDragActive ? 'soft' : 'muted'}>
                  <Upload className="h-[var(--file-upload-icon-size)] w-[var(--file-upload-icon-size)]" />
                </Text>
              )}
            </Flex>

            <Flex direction="column">
              <Text id={titleId} as="p" weight="medium" className="text-[length:var(--file-upload-title-font-size)]">
                {placeholder || defaultPlaceholder}
              </Text>
              <Text
                id={descriptionId}
                as="p"
                color="neutral"
                variant="muted"
                mt="1"
                className="text-[length:var(--file-upload-description-font-size)]"
              >
                {description || defaultDescription}
              </Text>
            </Flex>
          </Flex>
        </div>

        {/* File List */}
        {showFileList && resolvedFiles.length > 0 && !showStatusSections && (
          <Flex direction="column" gap="2" mt="4">
            {resolvedFiles.map(file => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={() => requestRemove(file)}
                disabled={disabled}
                display={fileListDisplay}
              />
            ))}
          </Flex>
        )}

        {/* File List with Status Sections */}
        {showFileList && resolvedFiles.length > 0 && showStatusSections && (
          <FileListWithSections
            files={resolvedFiles}
            onRemove={requestRemove}
            disabled={disabled}
            display={fileListDisplay}
          />
        )}

        <AlertDialog.Root open={uploadConfirmation != null} onOpenChange={open => !open && setPendingUploadFiles(null)}>
          <AlertDialog.Content size="sm">
            <AlertDialog.Title>{uploadConfirmation?.title}</AlertDialog.Title>
            {uploadConfirmation?.message ? (
              <AlertDialog.Description>{uploadConfirmation.message}</AlertDialog.Description>
            ) : null}
            <AlertDialog.Footer>
              <AlertDialog.Cancel>{uploadConfirmation?.cancelLabel ?? 'Cancel'}</AlertDialog.Cancel>
              <Button
                size="xs"
                onClick={() => {
                  const filesToUpload = pendingUploadFiles
                  setPendingUploadFiles(null)
                  if (filesToUpload) void handleFilesAdded(filesToUpload)
                }}
              >
                {uploadConfirmation?.confirmLabel ?? 'Upload'}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>

        <AlertDialog.Root open={removeConfirmation != null} onOpenChange={open => !open && setPendingRemoveFile(null)}>
          <AlertDialog.Content size="sm">
            <AlertDialog.Title>{removeConfirmation?.title}</AlertDialog.Title>
            {removeConfirmation?.message ? (
              <AlertDialog.Description>{removeConfirmation.message}</AlertDialog.Description>
            ) : null}
            <AlertDialog.Footer>
              <AlertDialog.Cancel>{removeConfirmation?.cancelLabel ?? 'Keep file'}</AlertDialog.Cancel>
              <Button
                size="xs"
                color="error"
                onClick={() => {
                  const fileToRemove = pendingRemoveFile
                  setPendingRemoveFile(null)
                  if (fileToRemove) handleRemoveConfirmed(fileToRemove)
                }}
              >
                {removeConfirmation?.confirmLabel ?? 'Remove'}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
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
