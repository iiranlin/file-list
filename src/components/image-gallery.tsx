"use client"

import * as React from "react"
import { X, ChevronLeft, ChevronRight, Calendar, Tag, Camera, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

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
  const [selectedCategory, setSelectedCategory] = React.useState<string>("全部")

  // 获取所有唯一分类
  const categories = React.useMemo(() => {
    return ["全部", ...Array.from(new Set(images.map((img) => img.category)))]
  }, [images])

  // 根据分类过滤图片
  const filteredImages = React.useMemo(() => {
    if (selectedCategory === "全部") return images
    return images.filter((img) => img.category === selectedCategory)
  }, [images, selectedCategory])

  const openLightbox = (image: ImageData, index: number) => {
    setSelectedImage(image)
    setCurrentIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1
    setCurrentIndex(newIndex)
    setSelectedImage(filteredImages[newIndex])
  }

  const goToNext = () => {
    const newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
    setSelectedImage(filteredImages[newIndex])
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
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer px-4 py-1 text-sm transition-all hover:bg-primary hover:text-primary-foreground"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer"
            onClick={() => openLightbox(image, index)}
          >
            {/* Image display */}
            <div className="absolute inset-0">
              <Image
                src={image.src}
                alt={image.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>

            {/* Loading placeholder */}
            <div className="absolute inset-0 bg-muted flex items-center justify-center -z-10">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground/50 px-2">{image.title}</p>
              </div>
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center text-white p-4">
                <h3 className="font-semibold mb-1 text-sm">{image.title}</h3>
                <p className="text-xs opacity-90 line-clamp-2">{image.description}</p>
              </div>
            </div>
            
            {/* Category badge */}
            <div className="absolute top-2 left-2">
              <Badge 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-secondary/80"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCategory(image.category);
                }}
              >
                {image.category}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => closeLightbox()}>
        <DialogContent className="max-w-[90vw] lg:max-w-7xl w-full p-0 bg-black/95 border-none overflow-hidden flex flex-col max-h-[95vh]">
          {selectedImage && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <DialogHeader className="p-6 pb-2 text-white shrink-0">
                <div className="flex items-start justify-between">
                  <div className="pr-8">
                    <DialogTitle className="text-2xl font-bold mb-1">{selectedImage.title}</DialogTitle>
                    <DialogDescription className="text-gray-400 text-base">
                      {selectedImage.description}
                    </DialogDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeLightbox}
                    className="h-9 w-9 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </DialogHeader>

              {/* Image Container */}
              <div className="relative flex-1 min-h-0 w-full overflow-hidden group/modal">
                <div className="w-full h-full flex items-center justify-center p-4">
                  {/* Image display */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={selectedImage.src}
                      alt={selectedImage.title}
                      className="max-w-full max-h-full object-contain shadow-2xl transition-opacity duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Loading placeholder fallback */}
                  <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center -z-10">
                    <div className="text-center text-white/30">
                      <ImageIcon className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                      <p className="text-lg">加载中...</p>
                    </div>
                  </div>
                </div>
                
                {/* Navigation buttons - overlay style */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/10 opacity-0 group-hover/modal:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/10 opacity-0 group-hover/modal:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>

              {/* Footer / Info */}
              <div className="p-6 pt-2 bg-black/50 shrink-0 border-t border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(selectedImage.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Camera className="h-4 w-4" />
                      <span>{selectedImage.dimensions}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Tag className="h-4 w-4 shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-primary/20 hover:bg-primary/30 text-primary-foreground cursor-pointer border-none"
                        onClick={() => {
                          setSelectedCategory(selectedImage.category);
                          closeLightbox();
                        }}
                      >
                        {selectedImage.category}
                      </Badge>
                      {selectedImage.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs text-gray-400 border-gray-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image counter */}
                <div className="text-center mt-4 text-gray-500 text-xs font-medium tracking-widest uppercase">
                  {currentIndex + 1} / {filteredImages.length}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
