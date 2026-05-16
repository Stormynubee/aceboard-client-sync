"use client";

import { useState } from "react";
import { VideoPlayer } from "./video-player";
import { CommentSidebar } from "./comment-sidebar";

interface Project {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  comments: any[];
}

export function ReviewClient({ project }: { project: Project }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTo, setSeekTo] = useState<number | undefined>(undefined);

  const handleSeek = (time: number) => {
    setSeekTo(time);
    // Reset seekTo after a short delay to allow re-seeking to the same time
    setTimeout(() => setSeekTo(undefined), 100);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 w-full space-y-6">
        <VideoPlayer 
          url={project.videoUrl} 
          onTimeUpdate={setCurrentTime} 
          seekTo={seekTo}
        />
        
        <div className="bg-background p-8 rounded-2xl border shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{project.title}</h1>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Live Review
            </span>
          </div>
          {project.description && (
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      </div>

      <div className="w-full lg:w-96 lg:sticky lg:top-24 h-[calc(100vh-12rem)] min-h-[600px]">
        <CommentSidebar 
          projectId={project.id} 
          initialComments={project.comments} 
          currentTime={currentTime}
          onSeek={handleSeek}
        />
      </div>
    </div>
  );
}
