import { Target, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { HistoryItem } from '../types';

export default function HistoryStats({ result }: { result: HistoryItem }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group">
                <div className="p-3 bg-green-50 text-green-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <Target size={28} />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{result.percentage}%</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Akurasi</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={28} />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                    {result.correct_answers}<span className="text-lg text-slate-400 font-medium">/{result.total_questions}</span>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jawaban Benar</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <Clock size={28} />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                    {Math.floor(result.total_time_seconds / 60)}<span className="text-base text-slate-400 font-medium">m</span> {result.total_time_seconds % 60}<span className="text-base text-slate-400 font-medium">s</span>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Durasi</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <Calendar size={28} />
                </div>
                <div className="text-lg font-bold text-slate-900 mb-1 mt-1 line-clamp-1">
                    {result.completed_at ? format(new Date(result.completed_at), 'dd MMM yyyy', { locale: id }) : '-'}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal</div>
            </div>
        </div>
    );
}