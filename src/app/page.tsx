import Link from "next/link";
import { Music, Video, Image as ImageIcon, BookOpen, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loadAudioData, loadVideoData, loadImageData, loadTutorialData } from "@/lib/data-loader";

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
      title: "Audio Collection",
      description: "Discover my curated audio files with built-in player controls",
      icon: Music,
      href: "/audio",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      count: `${audioFiles.length} tracks`,
    },
    {
      title: "Video Gallery",
      description: "Watch videos with thumbnail previews and modal playback",
      icon: Video,
      href: "/video",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      count: `${videoFiles.length} videos`,
    },
    {
      title: "Image Gallery",
      description: "Browse through images with lightbox preview functionality",
      icon: ImageIcon,
      href: "/images",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      count: `${imageFiles.length} images`,
    },
    {
      title: "Tutorials",
      description: "Read tutorials and documents with expandable content",
      icon: BookOpen,
      href: "/tutorials",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      count: `${tutorials.length} tutorials`,
    },
  ];
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Welcome to My Showcase
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore my collection of audio, video, images, and tutorials.
          A modern, clean interface designed to make content discovery enjoyable.
        </p>
        <Button size="lg" asChild>
          <Link href="/audio">
            Start Exploring
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
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
              <Link href={type.href}>
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
              </Link>
            </Card>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-8">Built with Modern Technologies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="font-semibold mb-1">Next.js 15</div>
            <div>React Framework</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="font-semibold mb-1">shadcn/ui</div>
            <div>UI Components</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="font-semibold mb-1">TailwindCSS</div>
            <div>Styling</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="font-semibold mb-1">TypeScript</div>
            <div>Type Safety</div>
          </div>
        </div>
      </div>
    </div>
  );
}
