export interface FileValidation {
  /**
   * File types, e.g. ['image/*', '.jpg', '.png']
   */
  accept?: string[]
  /**
   * Max file size in bytes
   */
  maxSize?: number
  /**
   * Min file size in bytes
   */
  minSize?: number
  /**
   * Max file count
   * @default 1
   */
  maxCount?: number
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

/**
 * Validate files against the validation rules,
 * if no validation rules are provided, return { isValid: true, errors: [] }
 *
 * @param {FileList} files - Files to validate
 * @param {FileValidation} [validation] - Optional validation rules
 * @returns {ValidationResult} ValidationResult
 */
export function validateFiles(
  files: FileList,
  validation?: FileValidation,
): ValidationResult {
  const errors: string[] = []

  if (!validation) {
    return { isValid: true, errors: [] }
  }

  // check file count
  if (validation.maxCount && files.length > validation.maxCount) {
    errors.push(`You can only select up to ${validation.maxCount} files`)
  }

  Array.from(files).forEach((file) => {
    if (validation.accept && validation.accept.length > 0) {
      const isValidType = validation.accept.some((acceptType) => {
        if (acceptType.startsWith('.')) {
          // extension match
          return file.name.toLowerCase().endsWith(acceptType.toLowerCase())
        } else if (acceptType.includes('*')) {
          // MIME type wildcard match
          const [mainType] = acceptType.split('/')
          return file.type.startsWith(mainType)
        } else {
          // exact MIME type match
          return file.type === acceptType
        }
      })

      if (!isValidType) {
        errors.push(`File "${file.name}" type not supported`)
      }
    }

    // check file size
    if (validation.maxSize && file.size > validation.maxSize) {
      errors.push(
        `File "${file.name}" size exceeds the limit (${formatFileSize(validation.maxSize)})`,
      )
    }

    if (validation.minSize && file.size < validation.minSize) {
      errors.push(
        `File "${file.name}" size is less than the minimum limit (${formatFileSize(validation.minSize)})`,
      )
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}
