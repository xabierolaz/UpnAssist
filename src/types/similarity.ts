export interface SimilaritySource {
  id: string;
  title: string;
  url?: string;
  similarity: number;
  type: 'web' | 'academic' | 'student_work' | 'database';
  matchedText: string;
}
