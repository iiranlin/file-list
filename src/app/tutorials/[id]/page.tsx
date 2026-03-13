import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Calendar, Clock, User } from "lucide-react";

import { TutorialReader } from "@/components/tutorial-reader";
import { Badge } from "@/components/ui/badge";
import { loadTutorialData } from "@/lib/data-loader";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TutorialDetailPage({ params }: PageProps) {
  const { id } = await params;
  const tutorialId = Number.parseInt(id, 10);

  if (Number.isNaN(tutorialId)) {
    notFound();
  }

  const tutorials = await loadTutorialData();
  const tutorial = tutorials.find((item) => item.id === tutorialId);

  if (!tutorial) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* 顶部柔和的渐变背景层 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-b from-muted/50 via-muted/10 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <Link
          href="/tutorials"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:mb-12"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          返回教程列表
        </Link>

        {/* 教程正文内容与边栏区 */}
        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80 md:prose-lg lg:prose-xl">
          <TutorialReader content={tutorial.content}>
            {/* 教程头部信息区（现在作为组件内部顶部与正文对齐） */}
            <header className="not-prose mb-8 border-b border-border/40 pb-10">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium hover:bg-secondary/80">
                  {tutorial.category}
                </Badge>
                <Badge variant="outline" className="rounded-full border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {tutorial.difficulty}
                </Badge>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-[1.15]">
                {tutorial.title}
              </h1>

              {/* <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
                {tutorial.excerpt}
              </p> */}

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-muted-foreground md:gap-x-8 md:text-base">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-foreground">{tutorial.author}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{tutorial.readTime}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={tutorial.publishDate}>
                    {new Date(tutorial.publishDate).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>教程文档</span>
                </div>
              </div>
            </header>
          </TutorialReader>
        </article>

        {/* 底部标签区 */}
        <div className="mt-16 border-t border-border/40 pt-10 md:mt-24">
          <span className="mb-4 block text-sm font-medium text-muted-foreground md:text-base">分类标签</span>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {tutorial.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full bg-secondary/40 px-3 py-1.5 text-sm hover:bg-secondary/60">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
