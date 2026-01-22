import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './styles/global.css'

const theme = {
  token: {
    colorPrimary: '#009639',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#E31837',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
  },
  components: {
    Button: {
      controlHeight: 44,
      borderRadius: 8,
      fontWeight: 500
    },
    Input: {
      controlHeight: 44,
      borderRadius: 8
    },
    Card: {
      borderRadius: 16
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConfigProvider>
  </React.StrictMode>
)
