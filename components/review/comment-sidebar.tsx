"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, Send, User, MessageSquare } from "lucide-react";
import { addComment } from "@/lib/actions";

interface Comment {
  id: string;
  text: string;
  timestamp: string;
  author: string;
  createdAt: Date;
}

interface CommentSidebarProps {
  projectId: string;
  initialComments: Comment[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export function CommentSidebar({ projectId, initialComments, currentTime, onSeek }: CommentSidebarProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const timestamp = formatTime(currentTime);
      const author = "Client"; // In a real app, this might come from a prompt or session

      const comment = await addComment(projectId, newComment, timestamp, author);
      
      setComments([comment as any, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const parseTimestamp = (ts: string) => {
    const [mins, secs] = ts.split(':').map(Number);
    return mins * 60 + secs;
  };

  return (
    <Card className="h-full flex flex-col shadow-xl border-muted-foreground/10 overflow-hidden">
      <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Feedback
          <span className="text-xs font-normal text-muted-foreground">({comments.length})</span>
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground italic text-sm px-6">
              No feedback yet. Scrub to a moment and leave a comment.
            </div>
          ) : (
            comments.map((comment) => (
              <div 
                key={comment.id} 
                className="p-3 bg-muted/20 rounded-lg border border-transparent hover:border-primary/20 transition-all cursor-pointer group"
                onClick={() => onSeek(parseTimestamp(comment.timestamp))}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
                    <User className="w-3 h-3" /> {comment.author}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-2">
                  <Clock className="w-3.5 h-3.5" /> 
                  {comment.timestamp}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">New Feedback at</label>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {formatTime(currentTime)}
              </span>
            </div>
            <Input 
              placeholder="Type your feedback here..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              className="bg-muted/30 focus-visible:ring-primary/30"
              disabled={isSubmitting}
            />
          </div>
          <Button 
            className="w-full gap-2 font-bold shadow-lg shadow-primary/20" 
            size="sm" 
            onClick={handleAddComment}
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? "Sending..." : (
              <>
                <Send className="w-4 h-4" /> Send Feedback
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
