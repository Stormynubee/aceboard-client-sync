import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink, MoreVertical } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  createdAt: Date;
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow group">
          <CardHeader className="p-0">
            <div className="aspect-video bg-muted relative flex items-center justify-center">
              <span className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Preview</span>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg truncate">{project.title}</CardTitle>
            {project.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {project.description}
              </p>
            )}
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(project.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(project.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 border-t bg-muted/5 group-hover:bg-muted/10 transition-colors">
            <Link href={`/review/${project.id}`} className="w-full">
              <Button variant="ghost" className="w-full justify-between text-xs h-9" size="sm">
                View Review Link
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
