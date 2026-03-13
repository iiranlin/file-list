import { BookOpen, Library, Layers3, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TutorialCard } from "@/components/tutorial-card";
import { loadTutorialData, type Tutorial } from "@/lib/data-loader";

// 强制动态渲染，确保每次访问都获取最新数据
export const dynamic = "force-dynamic";

export default async function TutorialsPage() {
  const tutorials: Tutorial[] = await loadTutorialData();

  // Get unique categories and difficulties for stats
  const categories = [...new Set(tutorials.map(t => t.category))];
  const difficulties = [...new Set(tutorials.map(t => t.difficulty))];

  const totalReadMinutes = tutorials.reduce((sum, tutorial) => {
    const minutes = parseInt(tutorial.readTime, 10);
    return Number.isNaN(minutes) ? sum : sum + minutes;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 via-background to-background">
      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-12 rounded-2xl border bg-card/80 p-6 md:p-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            教程文档
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">系统化学习空间</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
            每篇教程都支持独立页面阅读。点击任意卡片即可进入详情页，获得更舒适的阅读排版与更清晰的知识结构。
          </p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-2 text-muted-foreground">
              <Library className="h-4 w-4" />
            </div>
            <div className="text-2xl font-semibold">{tutorials.length}</div>
            <div className="text-sm text-muted-foreground">教程总数</div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-2 text-muted-foreground">
              <Layers3 className="h-4 w-4" />
            </div>
            <div className="text-2xl font-semibold">{categories.length}</div>
            <div className="text-sm text-muted-foreground">分类数量</div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-2 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="text-2xl font-semibold">{difficulties.length}</div>
            <div className="text-sm text-muted-foreground">难度等级</div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="mb-2 text-muted-foreground">
              <Timer className="h-4 w-4" />
            </div>
            <div className="text-2xl font-semibold">{totalReadMinutes} 分钟</div>
            <div className="text-sm text-muted-foreground">总阅读时长</div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-full px-3 py-1">
            全部
          </Badge>
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="rounded-full px-3 py-1">
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {tutorials.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </div>
      </div>
    </div>
  );
}
