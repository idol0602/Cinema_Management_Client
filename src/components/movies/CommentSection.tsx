"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ChevronLeft, ChevronRight, Send } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface CommentSectionProps {
  movieId: string
}

// Generate fake comments
const generateFakeComments = () => {
  const names = [
    "Nguyễn Văn An", "Trần Thị Bình", "Lê Hoàng Cường", "Phạm Thu Duyên",
    "Hoàng Minh Đức", "Võ Thị Hương", "Đặng Quốc Gia", "Bùi Kim Hạnh",
    "Ngô Văn Hùng", "Phan Thị Lan", "Trương Minh Khoa", "Lý Thu Linh",
    "Đinh Văn Nam", "Dương Thị Oanh", "Mai Quốc Phong", "Cao Thị Quỳnh",
  ]

  const comments = [
    "Phim hay tuyệt vời! Đáng xem!",
    "Nội dung hấp dẫn, diễn viên đóng rất thực tế",
    "Cảm động quá, tôi đã khóc rồi",
    "Phim có nhiều twist bất ngờ, không đoán được kết thúc",
    "Chất lượng hình ảnh và âm thanh tuyệt vời",
    "Phim dài một chút nhưng không chán",
    "Đạo diễn làm rất tâm huyết",
    "Nhạc phim hay lắm, sau khi xem vẫn còn nhớ",
    "Diễn xuất của dàn cast rất ổn",
    "Phim này nên có phần 2",
    "Xem lại lần 2 vẫn thấy hay",
    "Hiệu ứng CGI tuyệt vời",
    "Câu chuyện sâu sắc, ý nghĩa",
    "Rạp đông quá, phim hot thật",
    "Đáng đồng tiền bát gạo",
  ]

  return Array.from({ length: 50 }, (_, i) => ({
    id: `comment-${i + 1}`,
    user: {
      name: names[Math.floor(Math.random() * names.length)],
      avatar: `https://i.pravatar.cc/150?img=${(i % 50) + 1}`,
    },
    rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
    content: comments[Math.floor(Math.random() * comments.length)],
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ),
  }))
}

export function CommentSection({ movieId }: CommentSectionProps) {
  const [page, setPage] = useState(1)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  
  const commentsPerPage = 10
  const fakeComments = generateFakeComments()
  const totalPages = Math.ceil(fakeComments.length / commentsPerPage)
  
  const currentComments = fakeComments.slice(
    (page - 1) * commentsPerPage,
    page * commentsPerPage
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement comment submission logic
    console.log("Submit comment:", { movieId, rating, comment })
    // Reset form
    setComment("")
    setRating(0)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Comment Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Đánh giá & Bình luận
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Đánh giá của bạn</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Text */}
            <div>
              <label className="block text-sm font-medium mb-2">Bình luận</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                rows={4}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
            >
              <Send className="w-4 h-4 mr-2" />
              Gửi bình luận
            </Button>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">
            Bình luận ({fakeComments.length})
          </h3>

          <div className="space-y-4">
            {currentComments.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={c.user.avatar} alt={c.user.name} />
                    <AvatarFallback>{c.user.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{c.user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {format(c.createdAt, "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < c.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{c.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
