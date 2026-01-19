// [DOCS] Definisi tipe data untuk riwayat pengerjaan kuis.
// Digunakan untuk mapping data dari endpoint /quiz/history dan /quiz/result.

export interface HistoryItem {
    id: string;
    session_id: string;
    subtest_id: string;
    subtest_name: string;
    score: number;
    percentage: number;
    total_questions: number;
    correct_answers: number;
    total_time_seconds: number;
    average_time_per_question: number;
    completed_at: string;
    created_at: string;
}

export interface HistoryResponse {
    results: HistoryItem[];
}

export interface HistoryDetailResponse {
    result: HistoryItem;
}