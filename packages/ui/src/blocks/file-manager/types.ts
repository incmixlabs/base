import type * as React from 'react'

export type FileManagerViewMode = 'grid' | 'list'
export type FileManagerFileType = 'folder' | 'document' | 'image' | 'audio' | 'video' | 'file'

export interface FileManagerFolder {
  id: string
  name: string
  parentId?: string | null
  sizeLabel?: string
  disabled?: boolean
}

export interface FileManagerFile {
  id: string
  name: string
  type: FileManagerFileType
  folderId?: string | null
  sizeLabel?: string
  modifiedLabel?: string
  disabled?: boolean
}

export interface FileManagerProps extends React.ComponentPropsWithoutRef<'div'> {
  folders?: FileManagerFolder[]
  files?: FileManagerFile[]
  selectedFolderId?: string
  defaultSelectedFolderId?: string
  selectedFileId?: string
  defaultSelectedFileId?: string
  viewMode?: FileManagerViewMode
  defaultViewMode?: FileManagerViewMode
  onFolderChange?: (folder: FileManagerFolder) => void
  onFileSelect?: (file: FileManagerFile) => void
  onViewModeChange?: (viewMode: FileManagerViewMode) => void
  storageUsed?: number
}
