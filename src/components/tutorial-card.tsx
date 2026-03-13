import Link from "next/link";
import { Clock, User, Calendar, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  return (
    <Link href={`/tutorials/${tutorial.id}`} className="block h-full">
      <Card className="group h-full cursor-pointer border border-border/70 bg-card/90 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md">
        <CardHeader>
          <div className="mb-3 flex items-start justify-between gap-3">
            <Badge variant="outline" className="mb-2 font-normal">
              {tutorial.category}
            </Badge>
            <Badge variant={getDifficultyVariant(tutorial.difficulty)}>
              {tutorial.difficulty}
            </Badge>
          </div>
          <CardTitle className="mb-2 text-xl leading-snug group-hover:text-primary transition-colors">
            {tutorial.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-base leading-7">
            {tutorial.excerpt}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
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

          <div className="mb-5 flex flex-wrap gap-1.5">
            {tutorial.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between border-t pt-4 text-sm">
            <span className="text-muted-foreground">阅读全文</span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
