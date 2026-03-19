'use client';

import React, { useState, useEffect } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { postPaginateConfig } from '@/config/paginate/post.config';
import { PostCard } from './PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PostType } from '@/types/post.type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { PaginationMeta } from '@/types/pagination.type';

interface PostListProps {
  initialPosts?: PostType[];
  initialMetaData?: PaginationMeta;
}

export function PostList({
  initialPosts = [],
  initialMetaData = {
    totalItems: 0,
    itemsPerPage: 0,
    totalPages: 0,
    currentPage: 0,
  },
}: PostListProps) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchColumn, setSearchColumn] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [orderColumn, setOrderColumn] = useState('');

  // Build filter object - NO status filter for posts
  const buildFilter = () => {
    return { is_active: 'true' };
  };

  // Build sortBy string
  const buildSortBy = () => {
    if (sortColumn && orderColumn) {
      return `${sortColumn}:${orderColumn}`;
    } else if (sortColumn) {
      return `${sortColumn}:DESC`;
    }
    return postPaginateConfig.defaultSortBy[0] + ':' + postPaginateConfig.defaultSortBy[1];
  };

  const { data: postsResponse, isLoading } = usePosts({
    page,
    limit: postPaginateConfig.defaultLimit,
    search: searchQuery || undefined,
    searchBy: searchColumn || undefined,
    sortBy: buildSortBy(),
    filter: buildFilter(),
    initialData: page === 1 && !searchQuery ? initialPosts : undefined,
    metaData: initialMetaData,
  });

  const posts = postsResponse?.data || [];
  const meta = postsResponse?.meta;

  // Reset to page 1 when filters change
  const handleSearch = () => {
    setPage(1);
  };

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Auto-search when filters change
  useEffect(() => {
    setPage(1);
  }, [sortColumn, orderColumn, searchColumn]);

  // Clear filter
  const handleClearFilter = (filterType: string) => {
    if (filterType === 'sort') {
      setSortColumn('');
      setOrderColumn('');
    }
    if (filterType === 'search') {
      setSearchQuery('');
      setSearchColumn('');
    }
  };

  return (
    <section className="bg-gray-50 py-8 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Bài viết
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Tin tức và cập nhật mới nhất</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-gray-300 pl-10 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600"
              />
            </div>

            {/* Search By */}
            <Select
              value={searchColumn || 'ALL'}
              onValueChange={(val) => setSearchColumn(val === 'ALL' ? '' : val)}
            >
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600">
                <SelectValue placeholder="Tìm theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                {postPaginateConfig.searchableColumns.map((col) => (
                  <SelectItem key={col.value} value={col.value}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select
              value={sortColumn || 'DEFAULT'}
              onValueChange={(val) => setSortColumn(val === 'DEFAULT' ? '' : val)}
            >
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">Mặc định</SelectItem>
                {postPaginateConfig.sortableColumns.map((col) => (
                  <SelectItem key={col.value} value={col.value}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select value={orderColumn} onValueChange={setOrderColumn} disabled={!sortColumn}>
              <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600">
                <SelectValue placeholder="Thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">Tăng dần</SelectItem>
                <SelectItem value="DESC">Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || searchColumn || sortColumn) && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                Bộ lọc đang áp dụng:
              </span>
              {searchQuery && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter('search')}
                  className="h-7 text-xs"
                >
                  Tìm: "{searchQuery}" ×
                </Button>
              )}
              {sortColumn && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClearFilter('sort')}
                  className="h-7 text-xs"
                >
                  Sắp xếp:{' '}
                  {postPaginateConfig.sortableColumns.find((c) => c.value === sortColumn)?.label}{' '}
                  {orderColumn === 'ASC' ? '↑' : '↓'} ×
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <>
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between">
                {/* Meta info */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Hiển thị {(meta.currentPage - 1) * meta.itemsPerPage + 1} -{' '}
                  {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} của{' '}
                  {meta.totalItems} bài viết
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === meta.totalPages || Math.abs(p - page) <= 1)
                      .map((p, index, array) => (
                        <div key={p} className="flex items-center">
                          {index > 0 && array[index - 1] !== p - 1 && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <Button
                            variant={page === p ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPage(p)}
                            className={
                              page === p
                                ? 'min-w-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                                : 'min-w-10 hover:bg-orange-50 dark:hover:bg-orange-950'
                            }
                          >
                            {p}
                          </Button>
                        </div>
                      ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(meta.totalPages, prev + 1))}
                    disabled={page === meta.totalPages}
                    className="gap-1"
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
              Không tìm thấy bài viết nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Thử thay đổi bộ lọc hoặc tìm kiếm khác
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
