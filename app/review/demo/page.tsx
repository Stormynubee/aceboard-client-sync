"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Send, User } from "lucide-react";

interface Comment {
  id: string;
  user: string;
  timestamp: string;
  text: string;
  date: string;
}

export default function ReviewDemo() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: "Client A",
      timestamp: "00:12",
      text: "Can we make this cut a bit faster? Feels a bit sluggish.",
      date: "2 mins ago",
    },
    {
      id: "2",
      user: "Client A",
      timestamp: "01:05",
      text: "Great color grade here! Keep this look for the whole segment.",
      date: "1 min ago",
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [currentTime, setCurrentTime] = useState("00:45");

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      user: "You",
      timestamp: currentTime,
      text: newComment,
      date: "Just now",
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-24 flex flex-col lg:flex-row gap-8">
        {/* Video Side */}
        <div className="flex-1 space-y-4">
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl relative group">
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              <p className="text-xl font-medium">Video Player Placeholder</p>
            </div>
            {/* Mock Video Controls */}
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-1 w-full bg-white/30 rounded-full mb-4 relative">
                <div className="absolute left-0 top-0 h-full bg-primary w-[45%]" />
              </div>
              <div className="flex items-center justify-between text-white text-sm">
                <p>00:45 / 03:20</p>
                <div className="flex gap-4">
                  <span>HD</span>
                  <span>Full Screen</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold mb-4">Project: Commercial Edit v2</h2>
            <div className="flex gap-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">In Review</span>
              <span className="bg-muted px-3 py-1 rounded-full text-xs font-medium">3 comments</span>
            </div>
          </div>
        </div>

        {/* Feedback Side */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-muted/20">
              <h3 className="font-bold flex items-center gap-2">
                Feedback
                <span className="text-xs font-normal text-muted-foreground">({comments.length})</span>
              </h3>
            </div>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
              {comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-muted/40 rounded-lg border-l-4 border-primary">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm flex items-center gap-1">
                      <User className="w-3 h-3" /> {comment.user}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{comment.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary text-xs font-bold mb-2">
                    <Clock className="w-3 h-3" /> {comment.timestamp}
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </CardContent>
            <div className="p-4 border-t bg-background">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="comment" className="text-xs">Add feedback at {currentTime}</Label>
                  <Input 
                    id="comment" 
                    placeholder="Type your comment here..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addComment()}
                  />
                </div>
                <Button className="w-full gap-2" size="sm" onClick={addComment}>
                  <Send className="w-4 h-4" /> Send Feedback
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
