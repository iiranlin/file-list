import Link from "next/link";
import { Music, Video, Image as ImageIcon, BookOpen, ArrowUpRight, Terminal, Code2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { loadAudioData, loadVideoData, loadImageData, loadTutorialData } from "@/lib/data-loader";

export default async function Home() {
  const [audioFiles, videoFiles, imageFiles, tutorials] = await Promise.all([
    loadAudioData(),
    loadVideoData(),
    loadImageData(),
    loadTutorialData(),
  ]);

  const contentTypes = [
    {
      title: "音频",
      subtitle: "Audio",
      description: "精选音频收藏，支持在线播放与管理",
      icon: Music,
      href: "/audio",
      count: audioFiles.length,
      gradient: "from-violet-500/10 to-purple-500/10",
      iconColor: "text-violet-500",
      borderColor: "hover:border-violet-500/30",
    },
    {
      title: "视频",
      subtitle: "Video",
      description: "视频库，支持预览与流媒体播放",
      icon: Video,
      href: "/video",
      count: videoFiles.length,
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-500",
      borderColor: "hover:border-blue-500/30",
    },
    {
      title: "图片",
      subtitle: "Images",
      description: "图片画廊，记录视觉灵感与创意",
      icon: ImageIcon,
      href: "/images",
      count: imageFiles.length,
      gradient: "from-emerald-500/10 to-teal-500/10",
      iconColor: "text-emerald-500",
      borderColor: "hover:border-emerald-500/30",
    },
    {
      title: "教程",
      subtitle: "Tutorials",
      description: "技术文档、指南与学习资源",
      icon: BookOpen,
      href: "/tutorials",
      count: tutorials.length,
      gradient: "from-amber-500/10 to-orange-500/10",
      iconColor: "text-amber-500",
      borderColor: "hover:border-amber-500/30",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/30 to-background">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 max-w-6xl">
          <div className="flex flex-col items-center text-center gap-6">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium text-primary">
              <Terminal className="h-4 w-4" />
              <span>个人数字资源库</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                数字资源管理中心
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              一个专注于<span className="text-foreground font-medium">媒体资源</span>与<span className="text-foreground font-medium">知识管理</span>的个人平台，
              <br className="hidden md:block" />
              简洁、高效、无干扰地探索与组织数字内容。
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/tutorials">
                <Button size="lg" className="gap-2 px-6 shadow-lg shadow-primary/20">
                  <BookOpen className="h-4 w-4" />
                  浏览教程
                </Button>
              </Link>
              <Link href="/audio">
                <Button size="lg" variant="outline" className="gap-2 px-6">
                  开始探索
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-8 pt-8 border-t border-border/50">
              {[
                { label: "音频文件", count: audioFiles.length },
                { label: "视频内容", count: videoFiles.length },
                { label: "图片收藏", count: imageFiles.length },
                { label: "技术文档", count: tutorials.length },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.count}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <div className="flex flex-col gap-12">
          {/* Section Header */}
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>内容分类</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">
              资源浏览
            </h2>
            <p className="text-muted-foreground max-w-lg">
              探索不同类型的数字内容，所有资源均已分类整理，便于快速访问。
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Link href={type.href} key={type.title} className="group block">
                  <div
                    className={`
                      relative h-full p-6 md:p-8
                      rounded-2xl border border-border/60
                      bg-gradient-to-br ${type.gradient}
                      backdrop-blur-sm
                      transition-all duration-300 ease-out
                      hover:shadow-xl hover:shadow-black/5
                      ${type.borderColor}
                      hover:-translate-y-1
                    `}
                  >
                    {/* Icon */}
                    <div className={`
                      w-12 h-12 rounded-xl 
                      bg-background/80 border border-border/50
                      flex items-center justify-center
                      mb-5 transition-transform duration-300
                      group-hover:scale-110
                    `}>
                      <Icon className={`h-6 w-6 ${type.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {type.title}
                        </h3>
                        <span className="text-xs font-mono text-muted-foreground/70 uppercase tracking-wider">
                          {type.subtitle}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {type.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{type.count}</span>
                        <span className="text-sm text-muted-foreground">个项目</span>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="border-t bg-muted/20">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Code2 className="h-4 w-4" />
              <span>© {new Date().getFullYear()} 个人资源管理系统</span>
            </div>
            <div className="flex items-center gap-6">
              {[
                { name: "Next.js", color: "text-foreground" },
                { name: "React", color: "text-blue-500" },
                { name: "TypeScript", color: "text-blue-600" },
                { name: "Tailwind", color: "text-cyan-500" },
              ].map((tech) => (
                <span key={tech.name} className={`font-medium ${tech.color}/80 hover:${tech.color} transition-colors`}>
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
