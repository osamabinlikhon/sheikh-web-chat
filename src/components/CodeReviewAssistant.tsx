import React, { useMemo } from 'react';
import {
  Bubble,
  Sender,
  Welcome,
  ThoughtChain,
  Prompts,
  Conversations,
  type BubbleItemType,
  type ConversationItemType
} from '@ant-design/x';
import { useXChat } from '@ant-design/x-sdk';
import { Layout, Space, Typography, Card, Badge, Avatar, theme, Button, Flex } from 'antd';
import {
  CodeOutlined,
  RobotOutlined,
  UserOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { XMarkdown } from '@ant-design/x-markdown';
import MonacoEditor from './MonacoEditor';
import ReviewFeedback from './ReviewFeedback';
import { useXAgent } from '../hooks/useXAgent';
import { CodeReviewChatProvider } from '../services/DefaultChatProvider';

const { Header, Content, Sider } = Layout;

const CodeReviewAssistant: React.FC = () => {
  const { token } = theme.useToken();
  const [content, setContent] = React.useState('');
  const { agentConfig } = useXAgent();

  const chatProvider = useMemo(() => new CodeReviewChatProvider(), []);

  const { messages, onRequest, isRequesting, setMessages } = useXChat({
    provider: chatProvider,
  });

  const messageItems: BubbleItemType[] = useMemo(() => messages.map(({ id, message, status }) => {
    const index = messages.findIndex(m => m.id === id);
    const role = index % 2 === 0 ? 'user' : 'assistant';

    const strMessage = String(message);
    const lines = strMessage.split('\n');
    const thoughts = lines.filter((l: string) => l.trim().startsWith('THOUGHT:')).map((l: string) => l.trim().replace('THOUGHT:', '').trim());
    const mainContent = lines.filter((l: string) => !l.trim().startsWith('THOUGHT:')).join('\n').trim();

    return {
      key: id,
      loading: status === 'loading',
      role,
      content: (
        <div data-message-id={id}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {thoughts.length > 0 && (
                    <ThoughtChain
                        items={thoughts.map((t, idx) => ({ key: String(idx), title: t, status: 'success', collapsible: true }))}
                    />
                )}
                {mainContent && (
                    role === 'user' && mainContent.includes('const') ? (
                        <MonacoEditor value={mainContent} language={agentConfig.language} readOnly height="150px" />
                    ) : (
                        <XMarkdown>{mainContent}</XMarkdown>
                    )
                )}
            </Space>
        </div>
      ),
      footer: role === 'assistant' && id !== messages[0]?.id && (
          <ReviewFeedback messageId={String(id)} onFeedback={(f) => console.log('Feedback:', f)} />
      )
    };
  }), [messages, agentConfig.language]);

  const roles = useMemo(() => ({
    assistant: {
        placement: 'start' as const,
        typing: { effect: 'typing' as const, step: 1, interval: 20 },
        avatar: <Avatar icon={<RobotOutlined />} style={{ backgroundColor: token.colorPrimary }} />,
    },
    user: {
        placement: 'end' as const,
        avatar: <Avatar icon={<UserOutlined />} style={{ backgroundColor: token.colorSuccess }} />,
    },
  }), [token]);

  const onSearch = (val: string) => {
    if (!val.trim()) return;
    onRequest({ message: val });
    setContent('');
  };

  const conversationsItems: ConversationItemType[] = [
    { key: '1', label: 'TypeScript React Review' },
    { key: '2', label: 'Python API Review' },
  ];

  const promptItems = [
    { key: 'security', icon: <SafetyCertificateOutlined style={{ color: '#52c41a' }} />, label: 'Check Security', description: 'Analyze for vulnerabilities' },
    { key: 'performance', icon: <ThunderboltOutlined style={{ color: '#faad14' }} />, label: 'Optimize Performance', description: 'Find bottlenecks' },
    { key: 'style', icon: <LineChartOutlined style={{ color: '#1890ff' }} />, label: 'Best Practices', description: 'Code style & patterns' },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgContainer }}>
      <Sider theme="light" width={250} style={{ borderRight: `1px solid ${token.colorBorderSecondary}` }}>
        <div style={{ padding: '16px', fontWeight: 'bold', fontSize: '18px', color: token.colorPrimary }}>AI Reviewer</div>
        <div style={{ padding: '0 8px' }}>
          <Button type="primary" icon={<PlusOutlined />} block onClick={() => setMessages([])} style={{ marginBottom: 16 }}>
            New Review
          </Button>
          <Conversations items={conversationsItems} defaultActiveKey="1" />
        </div>
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 24px',
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Space>
            <CodeOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
            <Typography.Title level={4} style={{ margin: 0 }}>Code Review Assistant</Typography.Title>
          </Space>
          <Badge status={isRequesting ? 'processing' : 'default'} text={isRequesting ? 'AI is thinking...' : 'Idle'} />
        </Header>
        <Content style={{ padding: 24, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 24 }}>
            {messages.length === 0 ? (
              <Welcome
                icon={<RobotOutlined style={{ fontSize: 64, color: token.colorPrimary }} />}
                title="AI Code Review Assistant"
                description="Paste your code or describe your review needs"
                extra={
                  <Flex vertical gap="middle" style={{ marginTop: 24 }}>
                     <Typography.Text type="secondary">Quick Actions:</Typography.Text>
                     <Prompts items={promptItems} onItemClick={(info: any) => setContent(`Please check this code for ${info.data.label.toLowerCase()}:\n\n`)} />
                  </Flex>
                }
              />
            ) : (
              <Bubble.List items={messageItems} role={roles} />
            )}
          </div>
          <Card size="small" styles={{ body: { padding: 0 } }} variant="borderless">
            <Sender
              value={content}
              onChange={setContent}
              onSubmit={onSearch}
              loading={isRequesting}
              placeholder="Paste code or describe your review needs..."
              prefix={<CodeOutlined />}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CodeReviewAssistant;
