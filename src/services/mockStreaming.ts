import { AbstractXRequestClass } from '@ant-design/x-sdk';

export class MockCodeReviewStream extends AbstractXRequestClass<any, any> {
  private _isRequesting = false;
  private timer: any = null;

  get asyncHandler() {
    return Promise.resolve();
  }
  get isTimeout() { return false; }
  get isStreamTimeout() { return false; }
  get isRequesting() { return this._isRequesting; }
  get manual() { return true; }

  run() {
    this._isRequesting = true;
    const chunks = [
      "THOUGHT: Analyzing code structure and dependencies...\n",
      "THOUGHT: Checking for security vulnerabilities (OWASP Top 10)...\n",
      "THOUGHT: Reviewing performance patterns and bottlenecks...\n",
      "THOUGHT: Validating against language-specific best practices...\n",
      "THOUGHT: Generating actionable recommendations...\n",
      "\n",
      "## Code Review Analysis\n\n",
      "I've reviewed your code snippet. Here are my findings:\n\n",
      "### 1. Performance\n",
      "The current implementation uses a nested loop which might lead to $O(n^2)$ complexity. Consider using a Map for $O(n)$ lookup.\n\n",
      "### 2. Best Practices\n",
      "- Use `const` instead of `let` where possible.\n",
      "- Add error handling for the API call.\n\n",
      "### Suggested Refactoring:\n",
      "```typescript\n",
      "const processData = (items) => {\n",
      "  const itemMap = new Map(items.map(i => [i.id, i]));\n",
      "  // ... optimized logic\n",
      "}\n",
      "```\n"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < chunks.length) {
        this.options.callbacks?.onUpdate?.({ event: 'message', data: chunks[i] }, new Headers());
        i++;
      } else {
        clearInterval(interval);
        this._isRequesting = false;
        this.options.callbacks?.onSuccess?.([], new Headers());
      }
    }, 200);
    this.timer = interval;
  }

  abort() {
    if (this.timer) clearInterval(this.timer);
    this._isRequesting = false;
  }
}
