import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProtectedRoute } from '@/components/providers/protected-route';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { OrderHistory } from '@/components/profile/OrderHistory';
import { User, Receipt } from 'lucide-react';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 pb-16 pt-8 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Trang cá nhân
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Quản lý thông tin và lịch sử đơn hàng của bạn
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8 grid h-12 w-full grid-cols-2 rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
              <TabsTrigger
                value="profile"
                className="gap-2 rounded-lg transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30"
              >
                <User className="h-4 w-4" />
                Thông tin cá nhân
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="gap-2 rounded-lg transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30"
              >
                <Receipt className="h-4 w-4" />
                Lịch sử đơn hàng
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 md:p-8">
                <ProfileInfo />
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 md:p-8">
                <OrderHistory />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </ProtectedRoute>
  );
}
