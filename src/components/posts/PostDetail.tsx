"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { PostType } from "@/types/post.type"
import { ArrowLeft, Calendar } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface PostDetailProps {
  post: PostType
}

export function PostDetail({ post }: PostDetailProps) {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
        <Link href="/" className="hover:text-orange-600 transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/posts" className="hover:text-orange-600 transition-colors">
          Bài viết
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100">{post.title}</span>
      </div>

      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="mb-6 hover:bg-orange-50 dark:hover:bg-orange-950"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          {post.image && (
            <div className="relative aspect-[21/9] w-full">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12 space-y-6">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
              {post.created_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(post.created_at), "dd MMMM yyyy", { locale: vi })}</span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="prose dark:prose-invert max-w-none">
              <div 
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link href="/posts">
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
              Xem thêm bài viết khác
            </Button>
          </Link>
        </div>
      </article>
    </div>
  )
}
