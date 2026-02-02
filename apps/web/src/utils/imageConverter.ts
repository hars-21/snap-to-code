/**
 * Convert a file to base64 string
 * @param file - The file to convert
 * @returns Promise that resolves with the base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }
    reader.onerror = (error) => {
      reject(error)
    }
  })
}

/**
 * Convert a file to base64 without the data URI prefix
 * @param file - The file to convert
 * @returns Promise that resolves with the base64 string (without 'data:image/...;base64,' prefix)
 */
export function fileToBase64Pure(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove the data URI prefix to get pure base64
      const base64String = result.split(',')[1]
      resolve(base64String)
    }
    reader.onerror = (error) => {
      reject(error)
    }
  })
}

/**
 * Get file info along with base64 encoding
 * @param file - The file to process
 * @returns Promise that resolves with file info and base64 data
 */
export async function processImageFile(file: File) {
  const base64 = await fileToBase64(file)
  const base64Pure = await fileToBase64Pure(file)

  return {
    name: file.name,
    type: file.type,
    size: file.size,
    base64, // Full data URI
    base64Pure, // Pure base64 without prefix
    lastModified: file.lastModified,
  }
}
