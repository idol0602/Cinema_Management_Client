"use client"

import Image from "next/image"
import Link from "next/link"
import type { PostType } from "@/types/post.type"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface PostCardProps {
  post: PostType
}

function stripHtml(html: string): string {
  if (!html) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}


export function PostCard({ post }: PostCardProps) {
  // Truncate content for excerpt (first 200 chars)
  const content = stripHtml(post.content)
  const excerpt = content.length > 200 
    ? content.substring(0, 200) + "..." 
    : content

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="grid md:grid-cols-[300px_1fr] gap-6 p-6">
        {/* Image */}
        {post.image && (
          <div className="relative aspect-[16/10] md:aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
        )}

        {/* Content */}
        <div className={`flex flex-col justify-between space-y-4 ${!post.image ? "md:col-span-2" : ""}`}>
          <div className="space-y-3">
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-2xl font-bold hover:text-orange-600 dark:hover:text-orange-400 transition-colors line-clamp-2">
                {post.title}
              </h2>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
              {excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {post.created_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(post.created_at), "dd/MM/yyyy", { locale: vi })}</span>
                </div>
              )}
            </div>

            <Link href={`/posts/${post.id}`}>
              <Button 
                variant="ghost" 
                className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950"
              >
                Đọc thêm
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
