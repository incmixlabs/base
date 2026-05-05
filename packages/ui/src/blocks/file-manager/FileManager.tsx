'use client'

import { Contact, FileText, Trash2 } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/elements/button/Button'
import { Icon } from '@/elements/button/Icon'
import { IconButton } from '@/elements/button/IconButton'
import { Card } from '@/elements/card/Card'
import { Progress } from '@/elements/progress/Progress'
import { ToggleGroup } from '@/elements/toggle/Toggle'
import type { TreeDataItem, TreeRenderItemParams } from '@/elements/tree-view/TreeView'
import { TreeView } from '@/elements/tree-view/TreeView'
import { TextField } from '@/form/TextField'
import { Flex } from '@/layouts/flex/Flex'
import { Grid } from '@/layouts/grid/Grid'
import { cn } from '@/lib/utils'
import { Text } from '@/typography/text/Text'
import {
  fileManagerBody,
  fileManagerBreadcrumb,
  fileManagerBreadcrumbCurrent,
  fileManagerCard,
  fileManagerCardAction,
  fileManagerCardContent,
  fileManagerContent,
  fileManagerContentHeader,
  fileManagerContents,
  fileManagerContentTitle,
  fileManagerFileIcon,
  fileManagerFolderIcon,
  fileManagerGrid,
  fileManagerHeader,
  fileManagerIconButton,
  fileManagerListPlaceholder,
  fileManagerMain,
  fileManagerRoot,
  fileManagerSearchIcon,
  fileManagerSectionLabel,
  fileManagerSidebar,
  fileManagerToolbar,
  fileManagerTree,
  fileManagerUtility,
  fileManagerUtilityRow,
} from './FileManager.css'
import { sampleFileManagerFiles, sampleFileManagerFolders } from './sample-data'
import type { FileManagerFile, FileManagerFolder, FileManagerProps, FileManagerViewMode } from './types'

export type {
  FileManagerFile,
  FileManagerFileType,
  FileManagerFolder,
  FileManagerProps,
  FileManagerViewMode,
} from './types'

function buildFolderTree(folders: FileManagerFolder[], parentId: string | null = null): TreeDataItem[] {
  const foldersByParentId = new Map<string | null, FileManagerFolder[]>()

  for (const folder of folders) {
    const currentParentId = folder.parentId ?? null
    const siblingFolders = foldersByParentId.get(currentParentId)
    if (siblingFolders) {
      siblingFolders.push(folder)
    } else {
      foldersByParentId.set(currentParentId, [folder])
    }
  }

  const build = (currentParentId: string | null): TreeDataItem[] =>
    (foldersByParentId.get(currentParentId) ?? []).map(folder => ({
      id: folder.id,
      name: folder.name,
      disabled: folder.disabled,
      children: build(folder.id),
    }))

  return build(parentId)
}

function findFolder(folders: FileManagerFolder[], folderId: string | undefined) {
  return folders.find(folder => folder.id === folderId)
}

function getDefaultFolderId(folders: FileManagerFolder[], files: FileManagerFile[]) {
  const folderWithFiles = folders.find(folder => files.some(file => file.folderId === folder.id))
  return folderWithFiles?.id ?? folders[0]?.id
}

function renderFolderTreeItem({ item, isOpen, hasChildren }: TreeRenderItemParams) {
  const icon = isOpen ? 'folder-open' : 'folder'

  return (
    <>
      <IconButton
        className={fileManagerIconButton}
        color="secondary"
        fill
        icon={icon}
        size="sm"
        variant="ghost"
        title={item.name}
        tabIndex={-1}
      />
      <Text truncate>{item.name}</Text>
      {hasChildren ? null : <span />}
    </>
  )
}

function getFileIcon(file: FileManagerFile, selected: boolean) {
  if (file.type === 'folder') return selected ? 'folder-open' : 'folder'
  if (file.type === 'document') return 'file-text'
  if (file.type === 'image') return 'image'
  if (file.type === 'audio') return 'file-audio'
  if (file.type === 'video') return 'file-video'
  return 'file'
}

function FileGridCard({
  file,
  selected,
  onSelect,
}: {
  file: FileManagerFile
  selected: boolean
  onSelect: (file: FileManagerFile) => void
}) {
  const isFolder = file.type === 'folder'

  return (
    <Card.Root
      className={fileManagerCard}
      data-selected={selected ? '' : undefined}
      p="0"
      radius="md"
      size="sm"
      variant="surface"
      onClick={() => {
        if (!file.disabled) onSelect(file)
      }}
    >
      <Card.Content className={fileManagerCardContent}>
        <IconButton
          className={fileManagerCardAction}
          icon="ellipsis"
          size="sm"
          variant="ghost"
          title="More actions"
          onClick={event => {
            event.stopPropagation()
          }}
        />
        <Flex direction="column" align="center" justify="start" gap="2" height="100%" pt="4">
          <Icon
            className={isFolder ? fileManagerFolderIcon : fileManagerFileIcon}
            color={isFolder ? 'secondary' : 'slate'}
            fill={isFolder}
            icon={getFileIcon(file, selected)}
            size="xl"
          />
          <Grid gap="1" width="100%">
            <Text align="center" truncate weight="medium">
              {file.name}
            </Text>
            {file.sizeLabel ? (
              <Text align="center" color="neutral" size="sm">
                {file.sizeLabel}
              </Text>
            ) : null}
          </Grid>
        </Flex>
      </Card.Content>
    </Card.Root>
  )
}

export function FileManager({
  folders = sampleFileManagerFolders,
  files = sampleFileManagerFiles,
  selectedFolderId,
  defaultSelectedFolderId,
  selectedFileId,
  defaultSelectedFileId,
  viewMode,
  defaultViewMode = 'grid',
  onFolderChange,
  onFileSelect,
  onViewModeChange,
  storageUsed = 70,
  className,
  ...props
}: FileManagerProps) {
  const normalizedStorageUsed = Math.min(100, Math.max(0, storageUsed))
  const [internalSelectedId, setInternalSelectedId] = React.useState<string | undefined>(
    () => defaultSelectedFolderId ?? getDefaultFolderId(folders, files),
  )
  const [internalSelectedFileId, setInternalSelectedFileId] = React.useState(defaultSelectedFileId)
  const [internalViewMode, setInternalViewMode] = React.useState<FileManagerViewMode>(defaultViewMode)
  const [searchQuery, setSearchQuery] = React.useState('')
  const currentSelectedId = selectedFolderId ?? internalSelectedId
  const currentSelectedFileId = selectedFileId ?? internalSelectedFileId
  const currentViewMode = viewMode ?? internalViewMode
  const treeData = React.useMemo(() => buildFolderTree(folders), [folders])
  const selectedFolder = findFolder(folders, currentSelectedId)
  const visibleFiles = React.useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    return files.filter(file => {
      const matchesFolder = !currentSelectedId || file.folderId === currentSelectedId
      const matchesQuery = !normalizedQuery || file.name.toLowerCase().includes(normalizedQuery)
      return matchesFolder && matchesQuery
    })
  }, [currentSelectedId, files, searchQuery])

  const handleViewModeChange = React.useCallback(
    (nextViewMode: string[]) => {
      const normalizedViewMode: FileManagerViewMode = nextViewMode[0] === 'list' ? 'list' : 'grid'
      if (viewMode === undefined) setInternalViewMode(normalizedViewMode)
      onViewModeChange?.(normalizedViewMode)
    },
    [onViewModeChange, viewMode],
  )

  const handleFileSelect = React.useCallback(
    (file: FileManagerFile) => {
      if (selectedFileId === undefined) setInternalSelectedFileId(file.id)
      onFileSelect?.(file)
    },
    [onFileSelect, selectedFileId],
  )

  return (
    <div className={cn(fileManagerRoot, className)} {...props}>
      <aside className={fileManagerSidebar} aria-label="File manager folders">
        <Flex className={fileManagerHeader} align="center" gap="2">
          <IconButton
            className={fileManagerIconButton}
            color="secondary"
            fill
            icon="folder"
            size="sm"
            variant="ghost"
            title="File Manager"
            tabIndex={-1}
          />
          <Text weight="medium">File Manager</Text>
        </Flex>

        <Grid className={fileManagerBody} gap="4">
          <Text className={fileManagerSectionLabel}>Folders</Text>
          <TreeView.Root
            className={fileManagerTree}
            data={treeData}
            expandAll
            size="md"
            selectedItemId={currentSelectedId}
            renderItem={renderFolderTreeItem}
            onSelectChange={item => {
              const folder = findFolder(folders, item?.id)
              if (!folder) return
              if (selectedFolderId === undefined) setInternalSelectedId(folder.id)
              onFolderChange?.(folder)
            }}
          />

          <Grid className={fileManagerUtility} gap="4">
            <Flex className={fileManagerUtilityRow} align="center" gap="3">
              <Trash2 size={18} aria-hidden="true" />
              <Text>Trash</Text>
            </Flex>

            <Grid gap="2">
              <Flex className={fileManagerUtilityRow} align="center" justify="between" gap="3">
                <Text>Storage</Text>
                <Text color="neutral">{normalizedStorageUsed}%</Text>
              </Flex>
              <Progress value={normalizedStorageUsed} size="sm" color="success" />
            </Grid>

            <Flex className={fileManagerUtilityRow} align="center" gap="3">
              <FileText size={18} aria-hidden="true" />
              <Text>Notes</Text>
            </Flex>

            <Flex className={fileManagerUtilityRow} align="center" gap="3">
              <Contact size={18} aria-hidden="true" />
              <Text>Contacts</Text>
            </Flex>
          </Grid>
        </Grid>
      </aside>

      <main className={fileManagerContent} aria-label="File manager content">
        <Grid className={fileManagerContentHeader} gap="3">
          <Flex className={fileManagerBreadcrumb} align="center" gap="2">
            <Text weight="medium">File Manager</Text>
            <Text color="neutral">/</Text>
            <Text className={fileManagerBreadcrumbCurrent} weight="medium">
              {selectedFolder?.name ?? 'Files'}
            </Text>
          </Flex>

          <Grid className={fileManagerToolbar}>
            <TextField
              aria-label="Search files"
              placeholder="Search files..."
              size="sm"
              value={searchQuery}
              leftIcon={<Icon className={fileManagerSearchIcon} color="slate" icon="search" />}
              onChange={event => setSearchQuery(event.currentTarget.value)}
            />
            <span />
            <Button color="secondary" fill iconStart="folder-plus" size="sm" variant="solid">
              Add Folder
            </Button>
            <Button color="secondary" iconStart="upload" size="sm" variant="solid">
              Upload
            </Button>
          </Grid>
        </Grid>

        <Grid className={fileManagerMain} gap="5">
          <Flex align="center" justify="between" gap="3">
            <Text as="div" className={fileManagerContentTitle}>
              {selectedFolder?.name ?? 'Files'}
            </Text>
            <ToggleGroup.Root
              aria-label="View mode"
              size="sm"
              variant="solid"
              color="secondary"
              multiple={false}
              value={[currentViewMode]}
              onValueChange={handleViewModeChange}
            >
              <ToggleGroup.Item value="grid" aria-label="Grid view">
                <Icon icon="layout-grid" size="sm" style={{ color: 'inherit' }} />
              </ToggleGroup.Item>
              <ToggleGroup.Item value="list" aria-label="List view">
                <Icon icon="list" size="sm" style={{ color: 'inherit' }} />
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </Flex>

          <div className={fileManagerContents}>
            {currentViewMode === 'list' ? (
              <div className={fileManagerListPlaceholder}>List view coming soon.</div>
            ) : (
              <div className={fileManagerGrid}>
                {visibleFiles.map(file => (
                  <FileGridCard
                    key={file.id}
                    file={file}
                    selected={currentSelectedFileId === file.id}
                    onSelect={handleFileSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </Grid>
      </main>
    </div>
  )
}
