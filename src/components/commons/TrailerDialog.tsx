'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TrailerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trailerUrl?: string;
  title?: string;
}

function getYouTubeVideoId(url: string): string | null {
  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/i;
  const match = url.match(ytRegex);
  return match?.[1] || null;
}

function getVimeoVideoId(url: string): string | null {
  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/i;
  const match = url.match(vimeoRegex);
  return match?.[1] || null;
}

function buildEmbedUrl(url: string): string {
  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
  }

  const vimeoId = getVimeoVideoId(url);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
  }

  return url;
}

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export function TrailerDialog({
  open,
  onOpenChange,
  trailerUrl,
  title = 'Trailer',
}: TrailerDialogProps) {
  if (!trailerUrl) {
    return null;
  }

  const embedUrl = buildEmbedUrl(trailerUrl);
  const useVideoTag = isDirectVideo(trailerUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl border-orange-100 p-3 dark:border-gray-700 sm:p-4">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
        </DialogHeader>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-black dark:border-gray-700">
          <div className="relative aspect-video w-full">
            {useVideoTag ? (
              <video
                src={trailerUrl}
                controls
                autoPlay
                className="h-full w-full"
                preload="metadata"
              />
            ) : (
              <iframe
                src={embedUrl}
                title={title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
