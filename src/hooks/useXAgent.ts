import { useState, useCallback } from 'react';
import type { AgentConfig } from '../types';

export const useXAgent = () => {
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    language: 'typescript',
    strictness: 'medium',
    focusAreas: ['security', 'performance', 'best-practices'],
    reviewStyle: 'detailed'
  });

  const getPromptForLanguage = useCallback((language: string): string => {
    const prompts = {
      typescript: `You are a Senior TypeScript Engineer. Review for:\n1. Type safety\n2. React best practices\n3. Performance\n4. Error handling`,
      python: `You are a Senior Python Developer. Review for:\n1. PEP 8\n2. Security\n3. Performance\n4. Error handling`,
      javascript: `You are a Senior JavaScript Engineer. Review for:\n1. ES6+\n2. Security\n3. Performance\n4. Browser compatibility`
    };
    return prompts[language as keyof typeof prompts] || prompts.typescript;
  }, []);

  const updateAgentConfig = useCallback((config: Partial<AgentConfig>) => {
    setAgentConfig(prev => ({ ...prev, ...config }));
  }, []);

  return { agentConfig, getPromptForLanguage, updateAgentConfig };
};
