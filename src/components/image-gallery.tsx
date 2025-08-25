"use client"

import * as React from "react"
import { X, ChevronLeft, ChevronRight, Calendar, Tag, Camera } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ImageData {
  id: number
  title: string
  description: string
  src: string
  category: string
  tags: string[]
  uploadDate: string
  dimensions: string
}

interface ImageGalleryProps {
  images: ImageData[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState<ImageData | null>(null)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const openLightbox = (image: ImageData, index: number) => {
    setSelectedImage(image)
    setCurrentIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
    setCurrentIndex(newIndex)
    setSelectedImage(images[newIndex])
  }

  const goToNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
    setSelectedImage(images[newIndex])
  }

  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    if (!selectedImage) return
    
    switch (event.key) {
      case 'ArrowLeft':
        goToPrevious()
        break
      case 'ArrowRight':
        goToNext()
        break
      case 'Escape':
        closeLightbox()
        break
    }
  }, [selectedImage, currentIndex])

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openLightbox(image, index)}
          >
            {/* Image placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground px-2">{image.title}</p>
              </div>
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center text-white p-4">
                <h3 className="font-semibold mb-1 text-sm">{image.title}</h3>
                <p className="text-xs opacity-90 line-clamp-2">{image.description}</p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {image.category}
                </Badge>
              </div>
            </div>
            
            {/* Category badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="text-xs">
                {image.category}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => closeLightbox()}>
        <DialogContent className="max-w-6xl w-full p-0 bg-black/95">
          {selectedImage && (
            <>
              {/* Header */}
              <DialogHeader className="p-6 pb-0 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl mb-2">{selectedImage.title}</DialogTitle>
                    <DialogDescription className="text-gray-300">
                      {selectedImage.description}
                    </DialogDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeLightbox}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              {/* Image Container */}
              <div className="relative px-6 pb-6">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                  {/* Image placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Image Preview</p>
                      <p className="text-sm opacity-75">
                        In a real implementation, this would show the actual image
                      </p>
                      <p className="text-xs opacity-50 mt-2">
                        Source: {selectedImage.src}
                      </p>
                      <p className="text-xs opacity-50">
                        Dimensions: {selectedImage.dimensions}
                      </p>
                    </div>
                  </div>
                  
                  {/* Navigation buttons */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>

                {/* Image Info */}
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(selectedImage.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Camera className="h-4 w-4" />
                      <span>{selectedImage.dimensions}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4" />
                    <div className="flex space-x-1">
                      {selectedImage.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs text-gray-300 border-gray-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image counter */}
                <div className="text-center mt-4 text-gray-400 text-sm">
                  {currentIndex + 1} of {images.length}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
