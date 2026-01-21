import React from 'react';
import { ConfigProvider, theme } from 'antd';
import CodeReviewAssistant from './components/CodeReviewAssistant';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          colorBgContainer: '#ffffff',
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <div className="App">
        <CodeReviewAssistant />
      </div>
    </ConfigProvider>
  );
};

export default App;
