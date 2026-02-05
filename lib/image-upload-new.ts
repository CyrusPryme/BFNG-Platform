/**
 * Image Upload Handler
 * Client-side image upload with temporary local preview system
 * Designed to integrate with Cloudinary or Supabase Storage later
 */

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export interface UploadedImage {
  id: string
  file: File
  preview: string
  name: string
  size: number
  type: string
  width?: number
  height?: number
  uploadProgress?: UploadProgress
  url?: string // Will be populated by cloud storage
  publicId?: string // Cloudinary public ID
  path?: string // Supabase Storage path
}

export interface ImageUploadConfig {
  maxFileSize: number // in bytes
  maxFiles: number
  allowedTypes: string[]
  previewMaxWidth: number
  previewMaxHeight: number
  quality: number // 0-100 for JPEG compression
}

export interface CloudStorageConfig {
  provider: 'cloudinary' | 'supabase' | 'local'
  cloudinary?: {
    cloudName: string
    uploadPreset: string
    apiKey: string
  }
  supabase?: {
    url: string
    bucket: string
    apiKey: string
  }
}

export interface UploadResult {
  success: boolean
  images: UploadedImage[]
  errors: string[]
}

export class ImageUploadHandler {
  private config: ImageUploadConfig
  private storageConfig: CloudStorageConfig

  constructor(config: Partial<ImageUploadConfig> = {}, storageConfig: CloudStorageConfig = { provider: 'local' }) {
    this.config = {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      previewMaxWidth: 800,
      previewMaxHeight: 600,
      quality: 85,
      ...config
    }
    this.storageConfig = storageConfig
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!this.config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${this.config.allowedTypes.join(', ')}`
      }
    }

    // Check file size
    if (file.size > this.config.maxFileSize) {
      return {
        valid: false,
        error: `File size ${this.formatFileSize(file.size)} exceeds maximum size of ${this.formatFileSize(this.config.maxFileSize)}`
      }
    }

    return { valid: true }
  }

  /**
   * Create preview from file
   */
  private createPreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (typeof result === 'string') {
          resolve(result)
        } else {
          reject(new Error('Failed to create preview'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsDataURL(file)
    })
  }

  /**
   * Get image dimensions
   */
  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image for dimension detection'))
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Compress image if needed
   */
  private compressImage(file: File, quality: number = this.config.quality): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file) // Return original if canvas context fails
        return
      }
      
      this.getImageDimensions(file).then(({ width, height }) => {
        // Calculate new dimensions to fit within max size
        let newWidth = width
        let newHeight = height
        
        if (width > this.config.previewMaxWidth || height > this.config.previewMaxHeight) {
          const aspectRatio = width / height
          const maxWidth = this.config.previewMaxWidth
          const maxHeight = this.config.previewMaxHeight
          
          if (width > height) {
            newWidth = Math.min(width, maxWidth)
            newHeight = newWidth / aspectRatio
          } else {
            newHeight = Math.min(height, maxHeight)
            newWidth = newHeight * aspectRatio
          }
        }
        
        canvas.width = newWidth
        canvas.height = newHeight
        
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0, newWidth, newHeight)
          
          canvas.toBlob((blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: file.lastModified
              })
              resolve(compressedFile)
            } else {
              resolve(file) // Return original if compression fails
            }
          }, file.type, quality / 100)
        }
        
        img.src = URL.createObjectURL(file)
      }).catch(() => {
        resolve(file) // Return original if dimension detection fails
      })
    })
  }

  /**
   * Process single file
   */
  private async processFile(file: File, index: number): Promise<UploadedImage> {
    const validation = this.validateFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // Create preview
    const preview = await this.createPreview(file)
    
    // Get dimensions
    let dimensions
    try {
      dimensions = await this.getImageDimensions(file)
    } catch (error) {
      console.warn('Could not get image dimensions:', error)
      dimensions = { width: 0, height: 0 }
    }

    // Compress image if needed
    const processedFile = await this.compressImage(file)

    return {
      id: `upload-${Date.now()}-${index}`,
      file: processedFile,
      preview,
      name: file.name,
      size: processedFile.size,
      type: processedFile.type,
      width: dimensions.width,
      height: dimensions.height,
      uploadProgress: {
        loaded: 0,
        total: processedFile.size,
        percentage: 0,
        status: 'pending'
      }
    }
  }

  /**
   * Upload to Cloudinary
   */
  private async uploadToCloudinary(image: UploadedImage): Promise<UploadedImage> {
    if (!this.storageConfig.cloudinary) {
      throw new Error('Cloudinary configuration not provided')
    }

    const formData = new FormData()
    formData.append('file', image.file)
    formData.append('upload_preset', this.storageConfig.cloudinary.uploadPreset)
    formData.append('folder', 'bfng-products')

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.storageConfig.cloudinary.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      throw new Error('Cloudinary upload failed')
    }

    const result = await response.json()
    
    return {
      ...image,
      url: result.secure_url,
      publicId: result.public_id,
      uploadProgress: {
        loaded: image.file.size,
        total: image.file.size,
        percentage: 100,
        status: 'success'
      }
    }
  }

  /**
   * Upload to Supabase Storage
   */
  private async uploadToSupabase(image: UploadedImage): Promise<UploadedImage> {
    if (!this.storageConfig.supabase) {
      throw new Error('Supabase configuration not provided')
    }

    const filePath = `products/${Date.now()}-${image.name}`
    
    // Note: This would require the Supabase client library
    // For now, we'll simulate the upload
    try {
      // Simulate Supabase upload
      const data = {
        publicUrl: image.preview, // In real implementation, this would be the Supabase URL
        path: filePath
      }
      
      return {
        ...image,
        url: data.publicUrl,
        path: filePath,
        uploadProgress: {
          loaded: image.file.size,
          total: image.file.size,
          percentage: 100,
          status: 'success'
        }
      }
    } catch (error) {
      throw new Error(`Supabase upload failed: ${error instanceof Error ? error.message : 'Upload failed'}`)
    }
  }

  /**
   * Upload to local storage (temporary)
   */
  private async uploadToLocal(image: UploadedImage): Promise<UploadedImage> {
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      const currentProgress = image.uploadProgress!.loaded + (image.file.size / 10)
      const percentage = Math.min((currentProgress / image.file.size) * 100, 100)
      
      image.uploadProgress = {
        ...image.uploadProgress!,
        loaded: currentProgress,
        percentage,
        status: percentage < 100 ? 'uploading' : 'success'
      }
    }, 100)

    return new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(progressInterval)
        resolve({
          ...image,
          url: image.preview, // Use preview as temporary URL
          uploadProgress: {
            loaded: image.file.size,
            total: image.file.size,
            percentage: 100,
            status: 'success'
          }
        })
      }, 1000)
    })
  }

  /**
   * Upload single image
   */
  private async uploadImage(image: UploadedImage): Promise<UploadedImage> {
    // Update progress to uploading
    image.uploadProgress = {
      ...image.uploadProgress!,
      status: 'uploading'
    }

    try {
      switch (this.storageConfig.provider) {
        case 'cloudinary':
          return await this.uploadToCloudinary(image)
        case 'supabase':
          return await this.uploadToSupabase(image)
        case 'local':
        default:
          return await this.uploadToLocal(image)
      }
    } catch (error) {
      image.uploadProgress = {
        ...image.uploadProgress!,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      }
      throw error
    }
  }

  /**
   * Handle multiple file uploads
   */
  async uploadFiles(files: File[]): Promise<UploadResult> {
    const results: UploadResult = {
      success: true,
      images: [],
      errors: []
    }

    // Validate file count
    if (files.length > this.config.maxFiles) {
      results.errors.push(`Maximum ${this.config.maxFiles} files allowed. ${files.length} files selected.`)
      results.success = false
      return results
    }

    // Process each file
    const uploadPromises = files.map(async (file, index) => {
      try {
        const processedImage = await this.processFile(file, index)
        const uploadedImage = await this.uploadImage(processedImage)
        return uploadedImage
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed'
        results.errors.push(`${file.name}: ${errorMessage}`)
        return null
      }
    })

    const uploadedImages = await Promise.all(uploadPromises)
    results.images = uploadedImages.filter((img): img is UploadedImage => img !== null)

    if (results.errors.length > 0) {
      results.success = false
    }

    return results
  }

  /**
   * Remove uploaded image
   */
  removeImage(image: UploadedImage): void {
    // Revoke object URL to free memory
    if (image.url && image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url)
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Get configuration
   */
  getConfig(): ImageUploadConfig {
    return this.config
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ImageUploadConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Update storage configuration
   */
  updateStorageConfig(newStorageConfig: Partial<CloudStorageConfig>): void {
    this.storageConfig = { ...this.storageConfig, ...newStorageConfig }
  }
}

/**
 * Default image upload handler instance
 */
export const defaultImageUploadHandler = new ImageUploadHandler()

/**
 * Utility functions for image handling
 */
export const imageUtils = {
  /**
   * Check if file is an image
   */
  isImageFile(file: File): boolean {
    return file.type.startsWith('image/')
  },

  /**
   * Get file extension
   */
  getFileExtension(file: File): string {
    return file.name.split('.').pop()?.toLowerCase() || ''
  },

  /**
   * Generate unique filename
   */
  generateUniqueFilename(originalName: string): string {
    const extension = this.getFileExtension({ name: originalName } as File)
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    return `${timestamp}-${randomString}.${extension}`
  },

  /**
   * Create image preview URL
   */
  createPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error('Failed to create preview'))
      reader.readAsDataURL(file)
    })
  },

  /**
   * Validate image dimensions
   */
  validateDimensions(width: number, height: number, minWidth?: number, minHeight?: number, maxWidth?: number, maxHeight?: number): boolean {
    if (minWidth && width < minWidth) return false
    if (minHeight && height < minHeight) return false
    if (maxWidth && width > maxWidth) return false
    if (maxHeight && height > maxHeight) return false
    return true
  }
}

export default ImageUploadHandler
