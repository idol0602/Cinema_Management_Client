import { postService } from '@/services/post.service';
import { PostList } from '@/components/posts/PostList';
import type { PostType } from '@/types/post.type';
import type { PaginationMeta } from '@/types/pagination.type';

export default async function PostsPage() {
  const response = await postService.findAndPaginate({
    page: 1,
    limit: 10,
    filter: { is_active: 'true' },
  });

  const initialPosts = Array.isArray(response.data) ? (response.data as PostType[]) : [];

  const initialMeta: PaginationMeta = response.meta || {
    totalItems: 0,
    itemsPerPage: 0,
    totalPages: 0,
    currentPage: 0,
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-8 dark:bg-gray-900">
      <PostList initialPosts={initialPosts} initialMetaData={initialMeta} />
    </main>
  );
}
