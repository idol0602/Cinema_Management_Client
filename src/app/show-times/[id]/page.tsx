import SeatBookingPage from "@/components/show-times/SeatBookingPage"

interface ShowTimeDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ShowTimeDetailPage({ params }: ShowTimeDetailPageProps) {
  const { id } = await params

  return (
    <main className="min-h-screen">
      <SeatBookingPage showTimeId={id} />
    </main>
  )
}
