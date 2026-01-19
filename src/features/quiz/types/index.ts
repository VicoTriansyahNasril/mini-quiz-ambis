// [DOCS] File ini mendefinisikan tipe data TypeScript yang sesuai dengan respon JSON dari API Backend.
// Digunakan di seluruh fitur quiz untuk memastikan integritas data.

export interface Subtest {
    // [DOCS] ID unik untuk kategori kuis (misal: "mathematics", "logical")
    id: string;
    title: string;
    description: string;
    // [DOCS] Jumlah soal yang akan digenerate untuk subtest ini
    question_count: number;
}

export interface Question {
    // [DOCS] Nomor urut soal (1, 2, 3...)
    question_number: number;
    question_text: string;
    // [DOCS] Array pilihan jawaban, biasanya ["A", "B", "C", "D"]
    options: string[];
}

export interface QuizSession {
    // [DOCS] ID sesi unik yang didapat saat /start
    session_id: string;
    subtest_name: string;
    questions: Question[];
    // [DOCS] Timestamp ISO 8601 kapan sesi ini berakhir otomatis
    expires_at: string;
}

export interface QuizResult {
    // [DOCS] Nilai akhir yang dikembalikan setelah submit
    score: number;
}