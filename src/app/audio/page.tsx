import { Music, Clock, Play } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AudioPlayer } from "@/components/audio-player";
import { loadAudioData, type AudioFile } from "@/lib/data-loader";

export default async function AudioPage() {
  const audioFiles: AudioFile[] = await loadAudioData();
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <Music className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">音频收藏</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          探索并聆听我精心收藏的音频作品。每首音频都配备了
          内置播放器控件和详细信息展示。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">{audioFiles.length}</div>
          <div className="text-sm text-muted-foreground">音频总数</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">6</div>
          <div className="text-sm text-muted-foreground">音乐风格</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">30:23</div>
          <div className="text-sm text-muted-foreground">总时长</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">高品质</div>
          <div className="text-sm text-muted-foreground">音频格式</div>
        </div>
      </div>

      {/* Audio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {audioFiles.map((audio) => (
          <Card key={audio.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{audio.title}</CardTitle>
                  <CardDescription className="text-sm">{audio.artist}</CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {audio.genre}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {audio.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{audio.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Play className="h-4 w-4" />
                  <span>MP3</span>
                </div>
              </div>

              <AudioPlayer 
                src={audio.src}
                title={audio.title}
                artist={audio.artist}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
