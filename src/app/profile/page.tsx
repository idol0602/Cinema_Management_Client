import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileInfo } from "@/components/profile/ProfileInfo"
import { OrderHistory } from "@/components/profile/OrderHistory"
import { User, Receipt } from "lucide-react"

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Trang cá nhân
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý thông tin và lịch sử đơn hàng của bạn
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-12 rounded-xl p-1">
            <TabsTrigger
              value="profile"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 rounded-lg transition-all"
            >
              <User className="w-4 h-4" />
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 rounded-lg transition-all"
            >
              <Receipt className="w-4 h-4" />
              Lịch sử đơn hàng
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 border border-gray-200 dark:border-gray-700">
              <ProfileInfo />
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 border border-gray-200 dark:border-gray-700">
              <OrderHistory />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
