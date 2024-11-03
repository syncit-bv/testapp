export interface SupportedFile extends File {
  id: string;
  previewUrl: string | null;
  error: string | null;
  rotation?: number;
  numPages?: number;
}

export interface FileValidationError {
  message: string;
  code: 'INVALID_FILE' | 'UNSUPPORTED_TYPE' | 'DUPLICATE_FILE' | 'PROCESSING_ERROR';
}