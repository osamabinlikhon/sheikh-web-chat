import { useState, useCallback } from 'react';
import type { CodeReviewResult } from '../types';

export const useCodeReview = () => {
  const [reviewResults, setReviewResults] = useState<CodeReviewResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeCode = useCallback(async (_code: string, language: string) => {
    setLoading(true);
    console.log(`Analyzing ${language} code...`);
    try {
      // Mock analysis
      const mockResult: CodeReviewResult = {
        security: {
          issues: ['Potential XSS vulnerability', 'Hardcoded API key'],
          score: 7,
          recommendations: ['Implement CSP headers', 'Use environment variables']
        },
        performance: {
          issues: ['Unnecessary re-renders', 'O(n²) algorithm'],
          score: 8,
          recommendations: ['Use React.memo()', 'Optimize algorithm to O(n log n)']
        },
        bestPractices: {
          issues: ['Missing error boundaries', 'No TypeScript strict mode'],
          score: 6,
          recommendations: ['Add error boundaries', 'Enable strict mode']
        },
        overallScore: 7
      };
      await new Promise(resolve => setTimeout(resolve, 1500));
      setReviewResults(mockResult);
      return mockResult;
    } catch (error) {
      console.error('Code review failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyzeCode, reviewResults, loading };
};
