import Link from "next/link";
import { Music, Video, Image as ImageIcon, BookOpen, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadAudioData, loadVideoData, loadImageData, loadTutorialData } from "@/lib/data-loader";
import { LoadingButton, LoadingLink } from "@/components/loading-link";

export default async function Home() {
  // 从JSON文件加载数据来获取实际数量
  const [audioFiles, videoFiles, imageFiles, tutorials] = await Promise.all([
    loadAudioData(),
    loadVideoData(),
    loadImageData(),
    loadTutorialData(),
  ]);

  const contentTypes = [
    {
      title: "音频收藏",
      description: "聆听精心挑选的音频作品，享受内置播放器的便捷体验",
      icon: Music,
      href: "/audio",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      count: `${audioFiles.length} 首音频`,
    },
    {
      title: "视频画廊",
      description: "观赏精彩视频内容，支持缩略图预览和弹窗播放",
      icon: Video,
      href: "/video",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      count: `${videoFiles.length} 个视频`,
    },
    {
      title: "图片展览",
      description: "浏览美丽的图片作品，配备灯箱预览功能",
      icon: ImageIcon,
      href: "/images",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      count: `${imageFiles.length} 张图片`,
    },
    {
      title: "教程文档",
      description: "阅读详细的教程和文档，支持内容展开和收起",
      icon: BookOpen,
      href: "/tutorials",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      count: `${tutorials.length} 篇教程`,
    },
  ];
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          欢迎来到我的数字收藏馆
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          在这里，您可以探索我精心收藏的音频、视频、图片和教程。
          现代简洁的界面设计，让内容发现变得更加愉悦。
        </p>
        <LoadingButton
          href="/audio"
          className="px-8 py-3 text-lg"
          variant="default"
        >
          开始探索
          <ArrowRight className="ml-2 h-4 w-4" />
        </LoadingButton>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.title}
              className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <LoadingLink href={type.href}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${type.bgColor}`}>
                      <Icon className={`h-6 w-6 ${type.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {type.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {type.count}
                      </CardDescription>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {type.description}
                  </p>
                </CardContent>
              </LoadingLink>
            </Card>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-8">采用现代化技术构建</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="font-semibold mb-1">Next.js 15</div>
            <div>React 框架</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="font-semibold mb-1">shadcn/ui</div>
            <div>UI 组件库</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="font-semibold mb-1">TailwindCSS</div>
            <div>样式框架</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="font-semibold mb-1">TypeScript</div>
            <div>类型安全</div>
          </div>
        </div>
      </div>
    </div>
  );
}
