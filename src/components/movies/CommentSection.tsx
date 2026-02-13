"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Star, ChevronLeft, ChevronRight, Send, Edit, Trash2, MoreVertical } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import type { CommentWithUserType } from "@/types/comment.type"
import { useComments } from "@/hooks/useComments"
import { useRate } from "@/hooks/useRate"
import { commentPaginateConfig } from "@/config/paginate/comment.config"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CommentSectionProps {
  movieId: string
  initialComments?: CommentWithUserType[]
}

export function CommentSection({ movieId, initialComments = [] }: CommentSectionProps) {
  const { user } = useAuthStore()
  
  // Rating State
  const [hoverRating, setHoverRating] = useState(0)
  
  // Comment State
  const [commentContent, setCommentContent] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)

  // Pagination & Sorting
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC")

  // Hooks
  const { 
    data: commentsResponse, 
    isLoading: isLoadingComments,
    createCommentAsync, 
    updateCommentAsync, 
    deleteCommentAsync 
  } = useComments({
    page,
    limit: commentPaginateConfig.defaultLimit,
    search: searchQuery || undefined,
    searchBy: "content",
    sortBy: `created_at:${sortOrder}`,
    filter: { movie_id: movieId, is_active: "true" },
    initialData: page === 1 && !searchQuery && sortOrder === "DESC" ? initialComments : undefined,
  })

  const { 
    userRate, 
    isLoadingUserRate, 
    createRate, 
    updateRate 
  } = useRate({ 
    userId: user?.id, 
    movieId 
  })

  const comments = commentsResponse?.data || []
  const meta = commentsResponse?.meta

  // Handlers - Rate
  const handleRate = async (stars: number) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đánh giá")
      return
    }

    try {
      if (userRate) {
        // Update existing rate
        if (userRate.stars !== stars) {
          if (userRate.id) {
            await updateRate({ 
              id: userRate.id as string, 
              data: { stars } 
            })
            toast.success("Cập nhật đánh giá thành công")
          }
        }
      } else {
        // Create new rate
        await createRate({
          movie_id: movieId,
          user_id: user.id as string,
          stars
        })
        toast.success("Đánh giá thành công")
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi đánh giá")
    }
  }

  // Handlers - Comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!commentContent.trim()) return

    try {
      await createCommentAsync({
        movie_id: movieId,
        user_id: user.id as string,
        content: commentContent,
        is_active: true
      })
      setCommentContent("")
      setPage(1) // Return to first page to see new comment
      toast.success("Đăng bình luận thành công")
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi đăng bình luận")
    }
  }

  const handleUpdateComment = async () => {
    if (!editingCommentId || !editContent.trim()) return

    try {
      await updateCommentAsync({
        id: editingCommentId as string,
        data: { content: editContent }
      })
      setEditingCommentId(null)
      setEditContent("")
      toast.success("Cập nhật bình luận thành công")
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra")
    }
  }

  const handleDeleteComment = async () => {
    if (!deleteCommentId) return

    try {
      await deleteCommentAsync(deleteCommentId as string)
      setDeleteCommentId(null)
      toast.success("Xóa bình luận thành công")
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra")
    }
  }

  const startEdit = (comment: CommentWithUserType) => {
    setEditingCommentId(comment.id as string)
    setEditContent(comment.content)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* RATING SECTION */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Đánh giá của bạn
          </h2>
          
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
                disabled={isLoadingUserRate}
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoverRating || (userRate?.stars || 0))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>
          
          {!user ? (
            <p className="text-sm text-gray-500">Đăng nhập để đánh giá phim này</p>
          ) : (
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {userRate ? "Bạn đã đánh giá phim này" : "Hãy để lại đánh giá của bạn"}
            </p>
          )}
        </div>

        {/* COMMENT FORM */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Viết bình luận</h3>
          
          {user ? (
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                rows={3}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!commentContent.trim()}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Gửi bình luận
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Vui lòng <span className="font-semibold text-orange-500 cursor-pointer">đăng nhập</span> để bình luận
              </p>
            </div>
          )}
        </div>

        {/* COMMENTS LIST */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">
              Bình luận ({meta?.totalItems || 0})
            </h3>
            
            <Select 
              value={sortOrder} 
              onValueChange={(val: "ASC" | "DESC") => setSortOrder(val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">Mới nhất</SelectItem>
                <SelectItem value="ASC">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {isLoadingComments ? (
              <div className="text-center py-8">Đang tải bình luận...</div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow hover:shadow-md transition-shadow relative group"
                >
                  {/* Actions Dropdown for Owner */}
                  {user && user.id === comment.user_id && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEdit(comment)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteCommentId(comment.id as string)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage name={comment.users.name} />
                    </Avatar>

                    <div className="flex-1 space-y-2">
                       {/* Header */}
                      <div>
                        <p className="font-semibold text-sm">{comment.users.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {comment.created_at && format(new Date(comment.created_at), "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                        </p>
                      </div>

                      {/* Content */}
                      {editingCommentId === comment.id ? (
                        <div className="space-y-2 mt-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setEditingCommentId(null)}
                            >
                              Hủy
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={handleUpdateComment}
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              Lưu
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
              </div>
            )}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(p)}
                    className={
                      page === p
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                        : ""
                    }
                  >
                    {p}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCommentId} onOpenChange={(open) => !open && setDeleteCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bình luận của bạn sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteComment}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

