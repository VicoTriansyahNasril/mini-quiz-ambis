export interface Subtest {
    id: string;
    title: string;
    description: string;
    question_count: number;
}

export interface Question {
    question_number: number;
    question_text: string;
    options: string[];
}

export interface QuizSession {
    session_id: string;
    subtest_name: string;
    questions: Question[];
    expires_at: string;
}

export interface QuizResult {
    score: number;
}