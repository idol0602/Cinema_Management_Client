'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { PostType } from '@/types/post.type';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PostCardProps {
  post: PostType;
}

function stripHtml(html: string): string {
  if (!html) return '';

  // Remove HTML tags using regex
  return html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&quot;/g, '"') // Replace quotes
    .replace(/&apos;/g, "'") // Replace apostrophes
    .replace(/&amp;/g, '&') // Replace ampersands (must be last)
    .trim();
}

export function PostCard({ post }: PostCardProps) {
  // Truncate content for excerpt (first 200 chars)
  const content = stripHtml(post.content);
  const excerpt = content.length > 200 ? content.substring(0, 200) + '...' : content;

  return (
    <Card className="overflow-hidden border-gray-200 bg-white transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
      <div className="grid gap-6 p-6 md:grid-cols-[300px_1fr]">
        {/* Image */}
        {post.image && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg md:aspect-[4/3]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
        )}

        {/* Content */}
        <div
          className={`flex flex-col justify-between space-y-4 ${!post.image ? 'md:col-span-2' : ''}`}
        >
          <div className="space-y-3">
            <Link href={`/posts/${post.id}`}>
              <h2 className="line-clamp-2 text-2xl font-bold transition-colors hover:text-orange-600 dark:hover:text-orange-400">
                {post.title}
              </h2>
            </Link>

            <p className="line-clamp-3 text-gray-600 dark:text-gray-400">{excerpt}</p>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {post.created_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(post.created_at), 'dd/MM/yyyy', { locale: vi })}</span>
                </div>
              )}
            </div>

            <Link href={`/posts/${post.id}`}>
              <Button
                variant="ghost"
                className="text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:text-orange-400 dark:hover:bg-orange-950 dark:hover:text-orange-300"
              >
                Đọc thêm
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
