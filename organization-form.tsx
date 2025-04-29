"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Check, ImageIcon, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

type DocumentType = "commercialRegister" | "declarationOfExistence" | "nif" | "nis"

interface UploadedFile {
  file: File
  preview: string
  status: "uploading" | "success" | "error"
  progress: number
  error?: string
}

type UploadedFiles = {
  [key in DocumentType]?: UploadedFile
}

export function OrganizationForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    companyName: "",
    commercialRegister: "",
    declarationNumber: "",
    nifNumber: "",
    nisNumber: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({})
  const fileInputRefs = {
    commercialRegister: useRef<HTMLInputElement>(null),
    declarationOfExistence: useRef<HTMLInputElement>(null),
    nif: useRef<HTMLInputElement>(null),
    nis: useRef<HTMLInputElement>(null),
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = (documentType: DocumentType) => {
    if (fileInputRefs[documentType].current) {
      fileInputRefs[documentType].current?.click()
    }
  }

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      return "Invalid file type. Please upload a JPG, PNG, GIF, or PDF file."
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return "File is too large. Maximum size is 5MB."
    }

    return null
  }

  const handleFileChange = (documentType: DocumentType, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    const error = validateFile(file)

    if (error) {
      toast({
        title: "Upload Error",
        description: error,
        variant: "destructive",
      })
      // Reset the input
      e.target.value = ""
      return
    }

    // Create a preview URL
    const preview = URL.createObjectURL(file)

    // Set the file in state with uploading status
    setUploadedFiles((prev) => ({
      ...prev,
      [documentType]: {
        file,
        preview,
        status: "uploading",
        progress: 0,
      },
    }))

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10

      if (progress <= 100) {
        setUploadedFiles((prev) => ({
          ...prev,
          [documentType]: {
            ...prev[documentType]!,
            progress,
            status: progress === 100 ? "success" : "uploading",
          },
        }))
      }

      if (progress >= 100) {
        clearInterval(interval)
        toast({
          title: "Upload Complete",
          description: `${file.name} has been successfully uploaded.`,
        })
      }
    }, 300)

    // Reset the input
    e.target.value = ""
  }

  const removeFile = (documentType: DocumentType) => {
    if (uploadedFiles[documentType]?.preview) {
      URL.revokeObjectURL(uploadedFiles[documentType]!.preview)
    }

    setUploadedFiles((prev) => {
      const newFiles = { ...prev }
      delete newFiles[documentType]
      return newFiles
    })

    toast({
      title: "File Removed",
      description: "The file has been removed.",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if all required documents are uploaded
    const requiredDocuments: DocumentType[] = ["commercialRegister", "declarationOfExistence", "nif", "nis"]
    const missingDocuments = requiredDocuments.filter(
      (doc) => !uploadedFiles[doc] || uploadedFiles[doc]?.status !== "success",
    )

    if (missingDocuments.length > 0) {
      toast({
        title: "Missing Documents",
        description: `Please upload all required documents before submitting.`,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Organization updated",
      description: "Your organization information has been updated successfully.",
    })
  }

  const handleReset = () => {
    // Clear form data
    setFormData({
      companyName: "",
      commercialRegister: "",
      declarationNumber: "",
      nifNumber: "",
      nisNumber: "",
    })

    // Clear uploaded files and revoke object URLs
    Object.keys(uploadedFiles).forEach((key) => {
      const docType = key as DocumentType
      if (uploadedFiles[docType]?.preview) {
        URL.revokeObjectURL(uploadedFiles[docType]!.preview)
      }
    })

    setUploadedFiles({})

    toast({
      title: "Form Reset",
      description: "All form fields and uploaded documents have been reset.",
    })
  }

  const documentLabels = {
    commercialRegister: "Commercial register",
    declarationOfExistence: "declaration of existence",
    nif: "NIF",
    nis: "NIS",
  }

  // Function to render the file upload component
  const renderFileUpload = (docType: DocumentType) => (
    <div className="space-y-1">
      <p className="text-xs text-gray-500">send your {documentLabels[docType]}</p>

      {!uploadedFiles[docType] ? (
        <div
          className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleFileSelect(docType)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleFileSelect(docType)
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Upload ${documentLabels[docType]} document`}
        >
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mb-1">
            <Upload className="h-3 w-3 text-green-600" />
          </div>
          <p className="text-xs text-gray-500">select your file or drag and drop</p>
          <input
            type="file"
            ref={fileInputRefs[docType]}
            className="hidden"
            accept="image/jpeg,image/png,image/gif,application/pdf"
            onChange={(e) => handleFileChange(docType, e)}
            aria-hidden="true"
          />
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          {uploadedFiles[docType]?.status === "error" ? (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadedFiles[docType]?.error || "An error occurred during upload."}</AlertDescription>
            </Alert>
          ) : null}

          <div className="p-3 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {uploadedFiles[docType]?.status === "success" ? (
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <ImageIcon className="h-3 w-3 text-blue-600" />
                </div>
              )}
              <span className="text-sm truncate max-w-[180px]">{uploadedFiles[docType]?.file.name}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeFile(docType)}
              aria-label={`Remove ${documentLabels[docType]} document`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {uploadedFiles[docType]?.status === "uploading" && (
            <div className="px-3 pb-3 pt-1 bg-gray-50">
              <Progress
                value={uploadedFiles[docType]?.progress}
                className="h-1"
                aria-label={`Upload progress: ${uploadedFiles[docType]?.progress}%`}
              />
              <p className="text-xs text-gray-500 mt-1">Uploading: {uploadedFiles[docType]?.progress}%</p>
            </div>
          )}

          {uploadedFiles[docType]?.status === "success" && (
            <div className="h-32 bg-gray-100 flex items-center justify-center">
              {uploadedFiles[docType]?.file.type.startsWith("image/") ? (
                <img
                  src={uploadedFiles[docType]?.preview || "/placeholder.svg"}
                  alt={`Preview of ${documentLabels[docType]}`}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                  <p className="text-xs text-gray-500 mt-1">PDF Document</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Organization</h2>
      </div>

      <Card className="border rounded-lg">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit}>
            {/* Company name field with optimized width */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                  Company name
                </Label>
                <Input
                  id="company-name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter your company name"
                  className="w-full"
                  required
                />
              </div>
              {/* Empty div to maintain grid alignment */}
              <div></div>
            </div>

            {/* Paired fields and upload components */}
            <div className="space-y-8">
              {/* Commercial Register pair */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-2">
                  <Label htmlFor="commercial-register" className="text-sm font-medium text-gray-700">
                    Number of commercial register
                  </Label>
                  <Input
                    id="commercial-register"
                    name="commercialRegister"
                    value={formData.commercialRegister}
                    onChange={handleInputChange}
                    placeholder="Enter your Number of commercial register"
                    className="w-full"
                    required
                  />
                </div>
                {renderFileUpload("commercialRegister")}
              </div>

              {/* Declaration of Existence pair */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-2">
                  <Label htmlFor="declaration-number" className="text-sm font-medium text-gray-700">
                    Number of declaration of existence
                  </Label>
                  <Input
                    id="declaration-number"
                    name="declarationNumber"
                    value={formData.declarationNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your number of declaration of existence"
                    className="w-full"
                    required
                  />
                </div>
                {renderFileUpload("declarationOfExistence")}
              </div>

              {/* NIF pair */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-2">
                  <Label htmlFor="nif-number" className="text-sm font-medium text-gray-700">
                    Number of NIF
                  </Label>
                  <Input
                    id="nif-number"
                    name="nifNumber"
                    value={formData.nifNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your number of NIF"
                    className="w-full"
                    required
                  />
                </div>
                {renderFileUpload("nif")}
              </div>

              {/* NIS pair */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-2">
                  <Label htmlFor="nis-number" className="text-sm font-medium text-gray-700">
                    Number of NIS
                  </Label>
                  <Input
                    id="nis-number"
                    name="nisNumber"
                    value={formData.nisNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your number of NIS"
                    className="w-full"
                    required
                  />
                </div>
                {renderFileUpload("nis")}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                aria-label="Reset all form fields and uploaded documents"
              >
                Reset settings
              </Button>
              <Button
                type="submit"
                className="bg-gray-900 text-white hover:bg-gray-800"
                aria-label="Save organization information"
              >
                Edit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
