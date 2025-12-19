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
        <h1 className="text-4xl font-bold mb-4">图片展览</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          浏览我收藏的精美图片，配备灯箱预览功能。
          每张图片都包含详细信息和分类标签。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">{imageFiles.length}</div>
          <div className="text-sm text-muted-foreground">图片总数</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">{categories.length}</div>
          <div className="text-sm text-muted-foreground">图片分类</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">高清</div>
          <div className="text-sm text-muted-foreground">图片质量</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">多种</div>
          <div className="text-sm text-muted-foreground">图片格式</div>
        </div>
      </div>

      {/* Image Gallery */}
      <ImageGallery images={imageFiles} />
    </div>
  );
}
