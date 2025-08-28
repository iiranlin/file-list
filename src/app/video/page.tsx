import { Video, Clock, Play, Eye } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "@/components/video-player";
import { loadVideoData, type VideoFile } from "@/lib/data-loader";

export default async function VideoPage() {
  const videoFiles: VideoFile[] = await loadVideoData();
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
            <Video className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">视频画廊</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          观赏我收藏的视频作品，支持缩略图预览和弹窗播放。
          每个视频都包含详细信息和观看统计数据。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">{videoFiles.length}</div>
          <div className="text-sm text-muted-foreground">视频总数</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">6</div>
          <div className="text-sm text-muted-foreground">视频分类</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">87:05</div>
          <div className="text-sm text-muted-foreground">总时长</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">12.1k</div>
          <div className="text-sm text-muted-foreground">总观看量</div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoFiles.map((video) => (
          <Card key={video.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative aspect-video bg-muted">
              {/* Thumbnail placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Video Thumbnail</p>
                </div>
              </div>
              
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <VideoPlayer video={video} />
              </div>
              
              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1 line-clamp-2">{video.title}</CardTitle>
                  <CardDescription className="text-sm">{video.category}</CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {video.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {video.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{video.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{video.duration}</span>
                  </div>
                </div>
                <span className="text-xs">
                  {new Date(video.uploadDate).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
