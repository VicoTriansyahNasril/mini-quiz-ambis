import HistoryList from '@/features/history/components/HistoryList';

// [DOCS] Halaman Riwayat Kuis.
// Menampilkan daftar history dalam layout yang rapi.
export default function HistoryPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Riwayat Pengerjaan</h1>
            <HistoryList />
        </div>
    );
}