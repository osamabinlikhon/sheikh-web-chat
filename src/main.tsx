import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { XProvider } from '@ant-design/x'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <XProvider>
        <App />
      </XProvider>
    </ConfigProvider>
  </StrictMode>,
)
