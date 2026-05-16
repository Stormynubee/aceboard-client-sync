"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, Maximize, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  url: string;
  onTimeUpdate: (time: number) => void;
  seekTo?: number;
}

export function VideoPlayer({ url, onTimeUpdate, seekTo }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (seekTo !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekTo;
      // If was paused, keep it paused but show the frame
      if (!isPlaying) {
        videoRef.current.pause();
      }
    }
  }, [seekTo]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate(time);
      setPlaybackProgress((time / videoRef.current.duration) * 100);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  return (
    <div className="relative group bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
      <video
        ref={videoRef}
        src={url}
        className="w-full aspect-video cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={() => setDuration(videoRef.current?.duration || 0)}
        onClick={togglePlay}
      />
      
      {/* Overlay Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Progress Bar */}
        <div 
          className="h-1.5 w-full bg-white/20 rounded-full mb-4 cursor-pointer relative group/progress"
          onClick={handleSeek}
        >
          <div 
            className="absolute left-0 top-0 h-full bg-primary rounded-full"
            style={{ width: `${playbackProgress}%` }}
          />
          <div 
            className="absolute h-3 w-3 bg-white rounded-full shadow-lg -top-[3px] opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `${playbackProgress}%`, transform: 'translateX(-50%)' }}
          />
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10" onClick={() => videoRef.current && (videoRef.current.currentTime -= 5)}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium tabular-nums">
              {formatTime(currentTime)} <span className="text-white/40">/ {formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-white/70" />
            <Maximize className="h-4 w-4 text-white/70 cursor-pointer hover:text-white" onClick={() => videoRef.current?.requestFullscreen()} />
          </div>
        </div>
      </div>

      {/* Large Center Play Button (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-20 w-20 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-primary/40 animate-pulse">
            <Play className="h-10 w-10 text-white fill-current ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}
