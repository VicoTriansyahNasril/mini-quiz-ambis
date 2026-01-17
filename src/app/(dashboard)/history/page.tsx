import HistoryList from '@/features/history/components/HistoryList';

export default function HistoryPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Riwayat Pengerjaan</h1>
            <HistoryList />
        </div>
    );
}