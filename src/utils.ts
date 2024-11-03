import { PDFDocument } from 'pdf-lib'
import type { SupportedFile, FileValidationError } from './types'

export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export async function calculateFileHash(file: File | Blob): Promise<string> {
  try {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch (error) {
    console.error('Hash calculation error:', error)
    throw new Error(`Failed to calculate file hash: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function isDuplicateFile(newFile: File, existingFiles: SupportedFile[]): Promise<boolean> {
  try {
    // Quick check: If no files exist with same name and size, it's definitely not a duplicate
    const potentialDuplicates = existingFiles.filter(
      existing => existing.name === newFile.name && existing.size === newFile.size
    )

    if (potentialDuplicates.length === 0) {
      return false
    }

    // For potential duplicates, compare content hashes
    const newFileHash = await calculateFileHash(newFile)
    
    for (const existingFile of potentialDuplicates) {
      try {
        // For SupportedFile, we need to get the actual file content
        let existingContent: ArrayBuffer
        if (existingFile.previewUrl) {
          // If we have a previewUrl, fetch the content from there
          existingContent = await fetch(existingFile.previewUrl).then(res => res.arrayBuffer())
        } else {
          // Otherwise use the file directly
          existingContent = await existingFile.arrayBuffer()
        }
        
        const existingHash = await crypto.subtle.digest('SHA-256', existingContent)
        const existingHashStr = Array.from(new Uint8Array(existingHash))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')

        if (newFileHash === existingHashStr) {
          return true
        }
      } catch (err) {
        console.error('Error comparing file:', err)
        continue
      }
    }
    
    return false
  } catch (error) {
    console.error('Duplicate check error:', error)
    throw new Error(`Failed to check for duplicate file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function validateFile(file: File): FileValidationError | null {
  if (!(file instanceof File)) {
    return {
      code: 'INVALID_FILE',
      message: 'Invalid file object'
    }
  }

  const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
  if (file.size > MAX_FILE_SIZE) {
    return {
      code: 'INVALID_FILE',
      message: `File "${file.name}" exceeds maximum size of 100MB`
    }
  }

  const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  if (!isPDF) {
    return {
      code: 'UNSUPPORTED_TYPE',
      message: `File "${file.name}" is not a PDF file. Only PDF files can be processed.`
    }
  }

  return null
}

export async function createFileWithMetadata(file: File): Promise<SupportedFile> {
  try {
    const validationError = validateFile(file)
    if (validationError) {
      return {
        ...file,
        id: generateUniqueId(),
        error: validationError.message,
        previewUrl: null
      } as SupportedFile
    }

    // Create a URL for preview
    const previewUrl = URL.createObjectURL(file)

    // Get number of pages
    let numPages = 0
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      numPages = pdfDoc.getPageCount()
    } catch (error) {
      console.error('Error reading PDF:', error)
    }

    const supportedFile: SupportedFile = {
      ...file,
      id: generateUniqueId(),
      previewUrl,
      error: null,
      rotation: 0,
      numPages
    }

    return supportedFile
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error creating file with metadata:', errorMessage)
    
    return {
      ...file,
      id: generateUniqueId(),
      error: `Failed to process file "${file.name}": ${errorMessage}`,
      previewUrl: null
    } as SupportedFile
  }
}

export async function extractPDF(file: SupportedFile, rotation: number = 0): Promise<Blob> {
  try {
    // Get the raw data from the file
    const rawData = await fetch(file.previewUrl!).then(res => res.arrayBuffer())
    if (!rawData) {
      throw new Error('Failed to read the PDF file')
    }

    // Load and process the PDF
    const pdfDoc = await PDFDocument.load(rawData)
    if (!pdfDoc) {
      throw new Error('Failed to load the PDF document')
    }

    // Apply rotation if needed
    if (rotation !== 0) {
      const pages = pdfDoc.getPages()
      pages.forEach(page => {
        const currentRotation = page.getRotation().angle
        page.setRotation({ angle: (currentRotation + rotation) % 360 })
      })
    }

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save()
    return new Blob([pdfBytes], { type: 'application/pdf' })
  } catch (error) {
    console.error('Error extracting PDF:', error)
    throw new Error(`Failed to process PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}