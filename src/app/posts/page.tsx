import { postService } from "@/services/post.service"
import { PostList } from "@/components/posts/PostList"

export default async function PostsPage() {
  const response = await postService.findAndPaginate({
    page: 1,
    limit: 10,
    filter: { is_active: "true" }
  })

  const initialPosts = response.data || []

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8">
      <PostList initialPosts={initialPosts} />
    </main>
  )
}
