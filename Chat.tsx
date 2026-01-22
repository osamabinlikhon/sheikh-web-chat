import React, { useState } from 'react'
import {
  Layout,
  Typography,
  Button,
  Avatar,
  Dropdown,
  Space,
  message,
  Badge,
  ConfigProvider
} from 'antd'
import {
  UserOutlined,
  LogoutOutlined,
  RobotOutlined,
  PlusOutlined,
  MenuOutlined,
  SettingOutlined,
  BulbOutlined,
  CodeOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { 
  XProvider, 
  Bubble, 
  Sender, 
  Prompts, 
  Conversations, 
  Welcome
} from '@ant-design/x'
import { XMarkdown } from '@ant-design/x-markdown'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

const { Text } = Typography
const { Header, Content, Sider } = Layout

// API Configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

interface PromptItem {
  key: string
  label: React.ReactNode
  description: string
  value: string
}

interface Message {
  id: string | number
  role: 'user' | 'assistant'
  content: string
}

const Chat: React.FC = () => {
  const { user, logout } = useAuth()
  const [messageApi, contextHolder] = message.useMessage()
  const [siderCollapsed, setSiderCollapsed] = useState(false)
  const [apiKeyMissing] = useState(!GEMINI_API_KEY)
  const [activeConversation, setActiveConversation] = useState('1')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your AI assistant powered by Sheikh AI. How can I help you today?',
    }
  ])
  const [loading, setLoading] = useState(false)

  const brandColors = {
    red: '#E31837',
    green: '#009639',
    black: '#1D1D1B',
    lightGray: '#F5F5F5',
    border: '#E8E8E8'
  }

  const handleSend = async (userInput: string) => {
    if (!userInput.trim() || loading) return

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: userInput
    }

    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    if (!GEMINI_API_KEY) {
      setTimeout(() => {
        const aiMsg: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `I understand you're asking about "${userInput}". (Demo Mode: Please configure VITE_GEMINI_API_KEY)`
        }
        setMessages(prev => [...prev, aiMsg])
        setLoading(false)
      }, 1000)
      return
    }

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userInput }] }]
        })
      })

      if (!response.ok) throw new Error('API request failed')
      const data = await response.json()
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
      
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: content
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async (): Promise<void> => {
    try {
      await logout()
      messageApi.success('Successfully logged out')
    } catch {
      messageApi.error('Failed to logout')
    }
  }

  const userMenuItems = [
    { key: 'profile', label: 'Profile Settings', icon: <SettingOutlined /> },
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true, onClick: handleLogout }
  ]

  const promptItems: PromptItem[] = [
    {
      key: '1',
      label: <Space><BulbOutlined /><span>Explain quantum computing</span></Space>,
      description: 'Simple explanation for beginners',
      value: 'Explain quantum computing in simple terms'
    },
    {
      key: '2',
      label: <Space><CodeOutlined /><span>Help me write code</span></Space>,
      description: 'React component examples',
      value: 'Help me write a React component'
    },
    {
      key: '3',
      label: <Space><BarChartOutlined /><span>Analyze data</span></Space>,
      description: 'Efficiency tips',
      value: 'How to analyze large datasets efficiently'
    }
  ]

  const conversationItems = [
    { key: '1', label: 'Getting Started with AI' },
    { key: '2', label: 'Code Review Assistant' },
    { key: '3', label: 'Creative Writing Help' }
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: brandColors.green,
          borderRadius: 8
        }
      }}
    >
      <XProvider>
        <Layout style={styles.layout}>
          {contextHolder}

          {apiKeyMissing && (
            <div style={styles.warningBanner}>
              <Text style={{ color: '#994B00' }}>
                ⚠️ Gemini API key not configured. Using demo responses.
              </Text>
            </div>
          )}

          <Sider
            width={280}
            collapsed={siderCollapsed}
            collapsedWidth={0}
            style={styles.sider}
            trigger={null}
          >
            <div style={styles.siderHeader}>
              {!siderCollapsed && (
                <div style={styles.siderLogo}>
                  <Logo size="small" />
                </div>
              )}
              <Button
                type="text"
                icon={<PlusOutlined />}
                style={styles.newChatButton}
                onClick={() => setMessages([{
                  id: 'welcome',
                  role: 'assistant',
                  content: 'Hello! I am your AI assistant powered by Sheikh AI. How can I help you today?',
                }])}
              >
                {!siderCollapsed && 'New Chat'}
              </Button>
            </div>

            {!siderCollapsed && (
              <div style={styles.conversations}>
                <Text style={styles.sectionTitle}>Recent Conversations</Text>
                <Conversations
                  items={conversationItems}
                  activeKey={activeConversation}
                  onActiveChange={setActiveConversation}
                />
              </div>
            )}
          </Sider>

          <Layout>
            <Header style={styles.header}>
              <Space size={16}>
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setSiderCollapsed(!siderCollapsed)}
                  style={styles.menuButton}
                />
                {!siderCollapsed && <Logo size="small" />}
              </Space>

              <Space size={16}>
                <Badge dot status="success">
                  <Text type="secondary" style={{ fontSize: '12px' }}>Online</Text>
                </Badge>
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                  <Space style={styles.userInfo}>
                    <Avatar 
                      src={user?.photoURL || undefined} 
                      icon={!user?.photoURL && <UserOutlined />} 
                      style={{ backgroundColor: brandColors.green }}
                    />
                    <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
                  </Space>
                </Dropdown>
              </Space>
            </Header>

            <Content style={styles.content}>
              <div style={styles.chatContainer}>
                <div style={styles.messagesArea}>
                  {messages.length <= 1 && (
                    <Welcome
                      variant="borderless"
                      icon={<Logo size="large" />}
                      title="Welcome to Sheikh AI"
                      description="Your intelligent companion for creative work and problem solving."
                    />
                  )}
                  
                  {messages.map((msg) => (
                    <Bubble
                      key={msg.id}
                      placement={msg.role === 'user' ? 'end' : 'start'}
                      content={msg.role === 'assistant' ? <XMarkdown>{msg.content}</XMarkdown> : msg.content}
                      avatar={msg.role === 'user' ? 
                        <Avatar icon={<UserOutlined />} style={{ backgroundColor: brandColors.green }} /> : 
                        <Avatar icon={<RobotOutlined />} style={{ backgroundColor: brandColors.black }} />
                      }
                    />
                  ))}
                </div>

                <div style={styles.inputArea}>
                  <Prompts
                    items={promptItems}
                    onItemClick={(info) => handleSend((info.data as PromptItem).value)}
                    styles={{ list: { marginBottom: 16 } }}
                  />
                  <Sender
                    loading={loading}
                    onSubmit={(value) => handleSend(value)}
                    placeholder="Type your message here..."
                    prefix={<Button type="text" icon={<PlusOutlined />} />}
                  />
                  <Text style={styles.disclaimer}>
                    Sheikh AI can make mistakes. Check important info.
                  </Text>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </XProvider>
    </ConfigProvider>
  )
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    height: '100vh',
    background: '#FFFFFF'
  },
  warningBanner: {
    background: '#FFFBE6',
    padding: '8px 24px',
    borderBottom: '1px solid #FFE58F',
    textAlign: 'center'
  },
  sider: {
    background: '#FFFFFF',
    borderRight: '1px solid #E8E8E8'
  },
  siderHeader: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  siderLogo: {
    padding: '0 8px'
  },
  newChatButton: {
    width: '100%',
    height: '40px',
    borderRadius: '8px',
    border: '1px solid #E8E8E8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#1D1D1B',
    fontWeight: 500
  },
  conversations: {
    padding: '16px',
    overflowY: 'auto'
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#8C8C8C',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
    display: 'block'
  },
  header: {
    background: '#FFFFFF',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #E8E8E8',
    height: '64px',
    lineHeight: '64px'
  },
  menuButton: {
    fontSize: '18px',
    color: '#1D1D1B'
  },
  userInfo: {
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '8px',
    transition: 'background-color 0.2s'
  },
  userName: {
    fontWeight: 500,
    color: '#1D1D1B'
  },
  content: {
    background: '#FAFAFA'
  },
  chatContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    height: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column'
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputArea: {
    padding: '16px 24px 24px',
    background: '#FFFFFF',
    borderTop: '1px solid #E8E8E8'
  },
  disclaimer: {
    display: 'block',
    textAlign: 'center',
    fontSize: '12px',
    color: '#8C8C8C',
    marginTop: '12px'
  }
}

export default Chat
