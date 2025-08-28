import { BookOpen, Clock, User, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TutorialCard } from "@/components/tutorial-card";
import { loadTutorialData, type Tutorial } from "@/lib/data-loader";

export default async function TutorialsPage() {
  const tutorials: Tutorial[] = await loadTutorialData();

  // Get unique categories and difficulties for stats
  const categories = [...new Set(tutorials.map(t => t.category))];
  const difficulties = [...new Set(tutorials.map(t => t.difficulty))];
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
            <BookOpen className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">教程文档</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          阅读详细的教程和文档，支持内容展开和收起。每篇教程都采用
          清晰的排版和详细的信息，帮助您高效学习。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">{tutorials.length}</div>
          <div className="text-sm text-muted-foreground">教程总数</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">{categories.length}</div>
          <div className="text-sm text-muted-foreground">教程分类</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">{difficulties.length}</div>
          <div className="text-sm text-muted-foreground">难度等级</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-primary">45 分钟</div>
          <div className="text-sm text-muted-foreground">总阅读时长</div>
        </div>
      </div>

      {/* Filters */}
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

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tutorials.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </div>
    </div>
  );
}
