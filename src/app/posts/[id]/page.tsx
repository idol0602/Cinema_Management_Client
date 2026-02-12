import { postService } from "@/services/post.service"
import { PostDetail } from "@/components/posts/PostDetail"
import { notFound } from "next/navigation"

interface PostDetailPageProps {
  params: {
    id: string
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { data: post, error } = await postService.getById(params.id)

  if (error || !post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PostDetail post={post} />
    </main>
  )
}
