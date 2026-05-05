import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { acceptPresets, FileUpload, type UploadedFile } from './FileUpload'
import { Label } from './Label'

const meta: Meta<typeof FileUpload> = {
  title: 'Form/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'minimal', 'card'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    error: {
      control: 'boolean',
    },
    multiple: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    showFileList: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof FileUpload>

// Simulated upload function
const simulateUpload = async (_file: File, onProgress: (progress: number) => void): Promise<void> => {
  const totalSteps = 10
  for (let i = 1; i <= totalSteps; i++) {
    await new Promise(resolve => setTimeout(resolve, 200))
    onProgress((i / totalSteps) * 100)
  }
}

// Simulated upload that sometimes fails
const simulateUploadWithError = async (file: File, onProgress: (progress: number) => void): Promise<void> => {
  const totalSteps = 10
  const shouldFail = file.size > 1024 * 1024
  for (let i = 1; i <= totalSteps; i++) {
    await new Promise(resolve => setTimeout(resolve, 150))
    onProgress((i / totalSteps) * 100)
    // Fail at 60% for files larger than 1MB
    if (i === 6 && shouldFail) {
      throw new Error('File too large for demo')
    }
  }
}

// Default dropzone
export const Default: Story = {
  render: args => (
    <div className="w-[400px]">
      <FileUpload {...args} />
    </div>
  ),
}

// With label
export const WithLabel: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label>Upload documents</Label>
      <FileUpload accept={acceptPresets.documents} />
    </div>
  ),
}

// Single file
export const SingleFile: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label>Profile picture</Label>
      <FileUpload
        multiple={false}
        accept={acceptPresets.images}
        maxSize={5 * 1024 * 1024}
        placeholder="Upload your profile picture"
        description="PNG, JPG up to 5MB"
      />
    </div>
  ),
}

// Images only
export const ImagesOnly: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label>Upload images</Label>
      <FileUpload
        accept={acceptPresets.images}
        maxFiles={5}
        placeholder="Drop images here"
        description="PNG, JPG, GIF, WebP (max 5 files)"
      />
    </div>
  ),
}

// Documents only
export const DocumentsOnly: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label>Upload documents</Label>
      <FileUpload
        accept={acceptPresets.documents}
        placeholder="Drop documents here"
        description="PDF, DOC, DOCX, TXT"
      />
    </div>
  ),
}

// Spreadsheets
export const Spreadsheets: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label>Import data</Label>
      <FileUpload
        accept={acceptPresets.spreadsheets}
        multiple={false}
        placeholder="Drop spreadsheet here"
        description="CSV, XLS, XLSX"
      />
    </div>
  ),
}

// Variants
export const Variants: Story = {
  render: () => (
    <div className="w-[400px] space-y-8">
      <div className="space-y-2">
        <Label>Default variant</Label>
        <FileUpload variant="default" />
      </div>
      <div className="space-y-2">
        <Label>Minimal variant</Label>
        <FileUpload variant="minimal" />
      </div>
      <div className="space-y-2">
        <Label>Card variant</Label>
        <FileUpload variant="card" />
      </div>
    </div>
  ),
}

// With simulated upload
export const WithUploadProgress: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([])

    return (
      <div className="w-[400px] space-y-2">
        <Label>Upload with progress</Label>
        <FileUpload value={files} onChange={setFiles} onUpload={simulateUpload} accept={acceptPresets.images} />
        <p className="text-xs text-muted-foreground">Files will upload automatically with progress indicator</p>
      </div>
    )
  },
}

// With upload errors
export const WithUploadErrors: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([])

    return (
      <div className="w-[400px] space-y-2">
        <Label>Upload with potential errors</Label>
        <FileUpload value={files} onChange={setFiles} onUpload={simulateUploadWithError} maxSize={50 * 1024 * 1024} />
        <p className="text-xs text-muted-foreground">Files larger than 1MB will fail at 60% (for demo purposes)</p>
      </div>
    )
  },
}

// Controlled state
export const Controlled: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([])

    return (
      <div className="w-[400px] space-y-4">
        <div className="space-y-2">
          <Label>Controlled file upload</Label>
          <FileUpload
            value={files}
            onChange={setFiles}
            onFilesAdded={newFiles => {
              console.log('Files added:', newFiles)
            }}
            onFileRemove={file => {
              console.log('File removed:', file.file.name)
            }}
          />
        </div>
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium">Selected files:</p>
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground">No files selected</p>
          ) : (
            <ul className="text-sm text-muted-foreground">
              {files.map(f => (
                <li key={f.id}>{f.file.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  },
}

// Disabled
export const Disabled: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label>Disabled upload</Label>
      <FileUpload disabled />
    </div>
  ),
}

// Max files reached
export const MaxFilesReached: Story = {
  render: () => {
    const initialFiles: UploadedFile[] = [
      {
        id: '1',
        file: new File([''], 'document1.pdf', { type: 'application/pdf' }),
        progress: 100,
        status: 'success',
      },
      {
        id: '2',
        file: new File([''], 'document2.pdf', { type: 'application/pdf' }),
        progress: 100,
        status: 'success',
      },
      {
        id: '3',
        file: new File([''], 'document3.pdf', { type: 'application/pdf' }),
        progress: 100,
        status: 'success',
      },
    ]

    const [files, setFiles] = useState<UploadedFile[]>(initialFiles)

    return (
      <div className="w-[400px] space-y-2">
        <Label>Max 3 files</Label>
        <FileUpload value={files} onChange={setFiles} maxFiles={3} accept={acceptPresets.documents} />
        <p className="text-xs text-muted-foreground">Remove a file to upload more</p>
      </div>
    )
  },
}

// Without file list
export const WithoutFileList: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([])

    return (
      <div className="w-[400px] space-y-4">
        <div className="space-y-2">
          <Label>Hidden file list</Label>
          <FileUpload value={files} onChange={setFiles} showFileList={false} />
        </div>
        {files.length > 0 && <p className="text-sm text-muted-foreground">{files.length} file(s) selected</p>}
      </div>
    )
  },
}

// Large file size
export const LargeFileSize: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label>Large file upload</Label>
      <FileUpload maxSize={100 * 1024 * 1024} description="Up to 100MB per file" />
    </div>
  ),
}

// Custom placeholder
export const CustomPlaceholder: Story = {
  render: () => (
    <div className="w-[400px] space-y-2">
      <Label>Product images</Label>
      <FileUpload
        accept={acceptPresets.images}
        maxFiles={4}
        placeholder="Add product photos"
        description="Add up to 4 high-quality images. First image will be the cover."
      />
    </div>
  ),
}

// Form example
export const FormExample: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([])

    return (
      <div className="w-[450px] p-6 border rounded-lg space-y-6">
        <div>
          <h3 className="font-semibold text-lg">Submit Application</h3>
          <p className="text-sm text-muted-foreground">Please upload your required documents</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume / CV *</Label>
            <FileUpload
              multiple={false}
              accept={acceptPresets.documents}
              maxSize={5 * 1024 * 1024}
              placeholder="Upload your resume"
              description="PDF or DOC up to 5MB"
              variant="minimal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio (optional)</Label>
            <FileUpload
              accept={{
                ...acceptPresets.images,
                ...acceptPresets.documents,
              }}
              maxFiles={5}
              placeholder="Upload portfolio items"
              description="Images or PDFs, up to 5 files"
              variant="minimal"
              value={files}
              onChange={setFiles}
            />
          </div>
        </div>

        <button
          type="button"
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          Submit Application
        </button>
      </div>
    )
  },
}

// With status sections
export const WithStatusSections: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadedFile[]>([])

    return (
      <div className="w-[400px] space-y-2">
        <Label>Upload with status sections</Label>
        <FileUpload value={files} onChange={setFiles} onUpload={simulateUpload} showStatusSections />
        <p className="text-xs text-muted-foreground">Files are grouped into "Uploading" and "Completed" sections</p>
      </div>
    )
  },
}

// Status sections with mixed states
export const StatusSectionsMixed: Story = {
  render: () => {
    const initialFiles: UploadedFile[] = [
      {
        id: '1',
        file: new File([''], 'uploading-file.pdf', { type: 'application/pdf' }),
        progress: 45,
        status: 'uploading',
      },
      {
        id: '2',
        file: new File([''], 'pending-file.doc', { type: 'application/msword' }),
        progress: 0,
        status: 'pending',
      },
      {
        id: '3',
        file: new File([''], 'completed-file.pdf', { type: 'application/pdf' }),
        progress: 100,
        status: 'success',
      },
      {
        id: '4',
        file: new File([''], 'failed-file.pdf', { type: 'application/pdf' }),
        progress: 60,
        status: 'error',
        error: 'Network error',
      },
      {
        id: '5',
        file: new File([''], 'another-completed.doc', { type: 'application/msword' }),
        progress: 100,
        status: 'success',
      },
    ]

    const [files, setFiles] = useState<UploadedFile[]>(initialFiles)

    return (
      <div className="w-[400px] space-y-2">
        <Label>Mixed status files</Label>
        <FileUpload value={files} onChange={setFiles} showStatusSections />
      </div>
    )
  },
}

// All accept presets
export const AcceptPresetsShowcase: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <div className="space-y-2">
        <Label>Images</Label>
        <FileUpload accept={acceptPresets.images} variant="minimal" />
      </div>
      <div className="space-y-2">
        <Label>Documents</Label>
        <FileUpload accept={acceptPresets.documents} variant="minimal" />
      </div>
      <div className="space-y-2">
        <Label>Spreadsheets</Label>
        <FileUpload accept={acceptPresets.spreadsheets} variant="minimal" />
      </div>
      <div className="space-y-2">
        <Label>Videos</Label>
        <FileUpload accept={acceptPresets.videos} variant="minimal" />
      </div>
      <div className="space-y-2">
        <Label>Audio</Label>
        <FileUpload accept={acceptPresets.audio} variant="minimal" />
      </div>
    </div>
  ),
}
