import { Image as ImageIcon, Camera, Calendar, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "@/components/image-gallery";
import { loadImageData, type ImageFile } from "@/lib/data-loader";

export default async function ImagesPage() {
  const imageFiles: ImageFile[] = await loadImageData();

  // Get unique categories for stats
  const categories = [...new Set(imageFiles.map(img => img.category))];
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
            <ImageIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Image Gallery</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse through my collection of images with lightbox preview functionality. 
          Each image features detailed information and categorization.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">{imageFiles.length}</div>
          <div className="text-sm text-muted-foreground">Total Images</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">{categories.length}</div>
          <div className="text-sm text-muted-foreground">Categories</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">High Res</div>
          <div className="text-sm text-muted-foreground">Quality</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">Various</div>
          <div className="text-sm text-muted-foreground">Formats</div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          All
        </Badge>
        {categories.map((category) => (
          <Badge 
            key={category} 
            variant="outline" 
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Image Gallery */}
      <ImageGallery images={imageFiles} />
    </div>
  );
}
