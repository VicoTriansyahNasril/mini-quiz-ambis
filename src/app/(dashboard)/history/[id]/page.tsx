import HistoryDetail from '@/features/history/components/HistoryDetail';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function HistoryDetailPage(props: PageProps) {
    const params = await props.params;
    return (
        <div className="max-w-4xl mx-auto pb-12">
            <HistoryDetail sessionId={params.id} />
        </div>
    );
}