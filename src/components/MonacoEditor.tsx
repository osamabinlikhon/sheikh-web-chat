import React from 'react';
import MonacoEditor, { type OnChange } from '@monaco-editor/react';
import { Card } from 'antd';

interface EnhancedMonacoEditorProps {
  value: string;
  language: string;
  readOnly?: boolean;
  height?: string;
  onChange?: (value: string | undefined) => void;
}

const EnhancedMonacoEditor: React.FC<EnhancedMonacoEditorProps> = ({
  value,
  language,
  readOnly = false,
  height = '300px',
  onChange
}) => {
  return (
    <Card
      size="small"
      style={{ border: '1px solid #d9d9d9', borderRadius: '6px', overflow: 'hidden' }}
      styles={{ body: { padding: 0 } }}
    >
      <MonacoEditor
        height={height}
        language={language}
        value={value}
        onChange={onChange as OnChange}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
          lineNumbers: 'on',
          folding: true,
          lineDecorationsWidth: 5,
          lineNumbersMinChars: 3,
        }}
        theme="vs-dark"
      />
    </Card>
  );
};

export default EnhancedMonacoEditor;
