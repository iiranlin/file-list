"use client";

import * as React from "react";
import { Clock, User, Calendar, BookOpen, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MdViewer } from "@/components/md-viewer";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Tutorial {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  author: string;
  publishDate: string;
  tags: string[];
}

interface TutorialCardProps {
  tutorial: Tutorial;
}

const getDifficultyVariant = (difficulty: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (difficulty) {
    case "Beginner":
      return "secondary"; // Green-ish/Neutral
    case "Intermediate":
      return "default"; // Primary/Important
    case "Advanced":
      return "destructive"; // Red/Hard
    default:
      return "outline";
  }
};

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Card className="group h-full cursor-pointer border border-border/60 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge variant="outline" className="mb-2 font-normal">
              {tutorial.category}
            </Badge>
            <Badge variant={getDifficultyVariant(tutorial.difficulty)}>
              {tutorial.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
            {tutorial.title}
          </CardTitle>
          <CardDescription className="text-base leading-relaxed line-clamp-3">
            {tutorial.excerpt}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{tutorial.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-3.5 w-3.5" />
                <span>{tutorial.author}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(tutorial.publishDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {tutorial.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Read Tutorial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden sm:rounded-xl">
              <DialogHeader>
                <div className="flex items-start justify-between pr-8">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="outline">{tutorial.category}</Badge>
                      <Badge variant={getDifficultyVariant(tutorial.difficulty)}>
                        {tutorial.difficulty}
                      </Badge>
                    </div>
                    <DialogTitle className="text-2xl mb-4 leading-tight">
                      {tutorial.title}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          <span>{tutorial.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{tutorial.readTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(
                              tutorial.publishDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
                {/* 使用 relative 定位确保 rough-annotation 标注跟随内容滚动 */}
                <div className="relative">
                  <MdViewer value={tutorial.content} />
                </div>

                <div className="mt-8 pt-6 border-t">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium text-muted-foreground mr-2">
                      Tags:
                    </span>
                    {tutorial.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  );
}
