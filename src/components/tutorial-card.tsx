"use client"

import * as React from "react"
import { Clock, User, Calendar, BookOpen, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Tutorial {
  id: number
  title: string
  excerpt: string
  content: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  readTime: string
  author: string
  publishDate: string
  tags: string[]
}

interface TutorialCardProps {
  tutorial: Tutorial
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "Advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge variant="outline" className="mb-2">
              {tutorial.category}
            </Badge>
            <Badge className={getDifficultyColor(tutorial.difficulty)}>
              {tutorial.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
            {tutorial.title}
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {tutorial.excerpt}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{tutorial.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{tutorial.author}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(tutorial.publishDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {tutorial.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Read Tutorial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{tutorial.category}</Badge>
                      <Badge className={getDifficultyColor(tutorial.difficulty)}>
                        {tutorial.difficulty}
                      </Badge>
                    </div>
                    <DialogTitle className="text-2xl mb-2">{tutorial.title}</DialogTitle>
                    <DialogDescription className="text-base">
                      <div className="flex items-center space-x-4 text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{tutorial.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{tutorial.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(tutorial.publishDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </DialogDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="overflow-y-auto max-h-[calc(90vh-200px)] pr-6">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {/* In a real app, you would use a markdown parser like react-markdown */}
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {tutorial.content}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-muted-foreground mr-2">Tags:</span>
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
  )
}
