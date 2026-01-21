export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thoughtChain?: string[];
  thoughtChainProgress?: number;
  status?: string;
  metadata?: {
    language?: string;
    type?: 'code' | 'text' | 'markdown';
    file?: string;
    lineNumbers?: number[];
  };
  createdAt?: Date;
}

export interface FeedbackData {
  messageId: string;
  type: 'like' | 'dislike' | 'copy';
  comment?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentConfig {
  language: string;
  strictness: 'low' | 'medium' | 'high';
  focusAreas: string[];
  reviewStyle: 'detailed' | 'concise' | 'actionable';
}

export interface CodeReviewResult {
  security: {
    issues: string[];
    score: number;
    recommendations: string[];
  };
  performance: {
    issues: string[];
    score: number;
    recommendations: string[];
  };
  bestPractices: {
    issues: string[];
    score: number;
    recommendations: string[];
  };
  overallScore: number;
}
