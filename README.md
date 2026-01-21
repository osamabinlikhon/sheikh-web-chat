# AI Code Review Assistant (Ant Design X)

This project is a comprehensive demonstration of **Ant Design X**, a specialized React UI library for building AI-driven interfaces. It implements an **AI Code Review Assistant** that leverages the **RICH** interaction paradigm.

## Core Features Analysis

### 1. RICH Interaction Paradigm
- **Role**: Establishes the AI's identity as a specialized code reviewer.
- **Intention**: Uses `Sender` and `Prompts` to facilitate clear communication of code review goals.
- **Conversation**: Manages dialogue flow via `useXChat` SDK hook and `Bubble.List`.
- **Hybrid UI**: Combines traditional GUI (buttons, cards) with LUI (Markdown, ThoughtChain) for a seamless experience.

### 2. Specialized AI Components Integrated
- **`Bubble.List`**: Displays the conversation with role-based placement and typing effects.
- **`Sender`**: Versatile input for code snippets.
- **`ThoughtChain`**: Visualizes the AI's reasoning process (e.g., "Analyzing structure", "Security check").
- **`XMarkdown`**: High-performance, stream-friendly Markdown rendering for AI responses.
- **`Welcome` & `Prompts`**: Onboarding experience with quick-start actions.
- **`Conversations`**: Sidebar for managing multiple review sessions.

### 3. Robust Data Management (X SDK)
- **`useXChat`**: Handles complex chat states, loading indicators, and message history.
- **Custom Chat Provider**: Implements a structured way to connect the UI to a streaming backend (mocked in this project).

## Application Architecture

The application follows a modern client-server model:
1. **Frontend (React)**: Uses `@ant-design/x` components and `@ant-design/x-sdk` for state management.
2. **Streaming Mock Backend**: Simulates real-time LLM responses with thought processes using `AbstractXRequestClass`.

## Technical Stack
- **Frontend**: React 19, Ant Design 6.x (Dev), Ant Design X 2.x.
- **Tooling**: Vite, TypeScript.
- **Markdown**: `@ant-design/x-markdown`.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

---

*This project was developed based on the research and implementation plan for Ant Design X.*
