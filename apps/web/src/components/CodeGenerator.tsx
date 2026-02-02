import { useState, useRef } from 'react'
import './CodeGenerator.css'
import { Navbar } from './Navbar'
import { processImageFile } from '../utils/imageConverter'

export function CodeGenerator() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        console.log('📁 File selected:', {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: new Date(file.lastModified).toLocaleString(),
        })

        // Process the image and get base64
        const imageData = await processImageFile(file)
        
        // Set the image for preview (full data URI)
        setUploadedImage(imageData.base64)
        
        // Store pure base64 for API calls
        setImageBase64(imageData.base64Pure)
        
        console.log('✅ Image processed successfully')
        console.log('📊 Image Data:', {
          name: imageData.name,
          type: imageData.type,
          size: imageData.size,
          lastModified: new Date(imageData.lastModified).toLocaleString(),
        })
        
        console.log('🔗 Full Base64 (Data URI) - First 100 chars:', imageData.base64.substring(0, 100) + '...')
        console.log('🔗 Full Base64 (Data URI) - Length:', imageData.base64.length)
        
        console.log('📝 Pure Base64 - First 100 chars:', imageData.base64Pure.substring(0, 100) + '...')
        console.log('📝 Pure Base64 - Length:', imageData.base64Pure.length)
        
        console.log('💾 Ready for API call - Use imageBase64 state:', imageBase64)
      } catch (error) {
        console.error('❌ Error processing image:', error)
        alert('Error processing image. Please try again.')
      }
    }
  }

  const handleGenerate = () => {
    if (!uploadedImage) {
      alert('Please upload an image first')
      return
    }
    
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setGeneratedCode(`// Generated React Component
import React from 'react';
import './styles.css';

const MyComponent = () => {
  return (
    <div className="container">
      <h1>Welcome to Your Component</h1>
      <p>This code was generated from your design</p>
    </div>
  );
};

export default MyComponent;`)
      setIsGenerating(false)
    }, 1500)
  }

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      alert('Code copied to clipboard!')
    }
  }

  return (
    <div className="app-container">
      <Navbar />
      {/* Hero Section */}

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>AI-Powered Code Generation</span>
          </div>
          
          <h1 className="hero-title">
            Transform Designs into <span className="gradient-text">Production Code</span>
          </h1>
          
          <p className="hero-subtitle">
            Upload any design screenshot and get pixel-perfect, clean code instantly. 
            Powered by advanced AI technology.
          </p>
          
          {/* File Upload Section */}
          <div className="upload-section">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="file-input"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="upload-label">
              <svg className="upload-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>{uploadedImage ? '✓ Image Uploaded' : 'Upload Design Screenshot'}</span>
            </label>
            {uploadedImage && (
              <button className="generate-btn" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <span className="spinner"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Code
                  </>
                )}
              </button>
            )}
          </div>

          {/* Trusted By Section */}
          {!uploadedImage && (
            <div className="trusted-section">
              <p className="trusted-text">Trusted by developers at</p>
              <div className="brand-logos">
                <span className="brand">Google</span>
                <span className="brand">Meta</span>
                <span className="brand">Amazon</span>
                <span className="brand">Microsoft</span>
                <span className="brand">Apple</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Section */}
      {(uploadedImage || generatedCode) && (
        <div className="main-content">
          <div className="content-grid">
            {/* Preview Section */}
            <div className="preview-section">
              <div className="section-header">
                <div className="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Preview
                </div>
              </div>
              <div className="preview-container">
                {uploadedImage ? (
                  <img src={uploadedImage} alt="Uploaded design" className="preview-image" />
                ) : (
                  <div className="preview-placeholder">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" opacity="0.3">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Your design preview will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Code Output Section */}
            <div className="code-section">
              <div className="section-header">
                <div className="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Generated Code
                </div>
                {generatedCode && (
                  <button className="copy-btn-small" onClick={handleCopy}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                )}
              </div>
              <div className="code-container">
                {generatedCode ? (
                  <pre className="code-output">
                    <code>{generatedCode}</code>
                  </pre>
                ) : (
                  <div className="code-placeholder">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" opacity="0.3">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <p>Your generated code will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trusted By Section - Bottom */}
          {uploadedImage && (
            <div className="trusted-section-bottom">
              <p className="trusted-text">Trusted by developers at</p>
              <div className="brand-logos">
                <span className="brand">Google</span>
                <span className="brand">Meta</span>
                <span className="brand">Amazon</span>
                <span className="brand">Microsoft</span>
                <span className="brand">Apple</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}