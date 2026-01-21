import React, { useMemo } from 'react';
import { Layout, Typography, Button, Card, Badge, Avatar, Flex, theme, Space } from 'antd';
import {
  PlusOutlined,
  CodeOutlined,
  UserOutlined,
  RobotOutlined,
  HistoryOutlined,
  CopyOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import {
  Bubble,
  Sender,
  Welcome,
  ThoughtChain,
  Actions,
  Prompts,
  Conversations,
  type BubbleItemType,
  type ConversationItemType
} from '@ant-design/x';
import { useXChat, AbstractXRequestClass, DefaultChatProvider } from '@ant-design/x-sdk';
import { XMarkdown } from '@ant-design/x-markdown';

const { Header, Content, Sider } = Layout;

// Mock streaming request class
class MockCodeReviewRequest extends AbstractXRequestClass<any, any> {
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
            "THOUGHT: Analyzing code structure...\n",
            "THOUGHT: Checking for security vulnerabilities...\n",
            "THOUGHT: Optimizing performance...\n",
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

class MyChatProvider extends DefaultChatProvider<string, any, any> {
    transformMessage(info: any) {
        return (info.originMessage || '') + info.chunk.data;
    }
    transformLocalMessage(params: any) {
        return params.message;
    }
    transformParams(params: any) {
        return params;
    }
}

const App: React.FC = () => {
  const { token } = theme.useToken();
  const [content, setContent] = React.useState('');

  const provider = useMemo(() => new MyChatProvider({
    request: new MockCodeReviewRequest('http://localhost', { manual: true }),
  }), []);

  const { messages, onRequest, isRequesting, setMessages } = useXChat({
    provider,
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
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {thoughts.length > 0 && (
                <ThoughtChain
                    items={thoughts.map((t, idx) => ({ key: idx, title: t, status: 'success' }))}
                    collapsible
                />
            )}
            {mainContent && <XMarkdown>{mainContent}</XMarkdown>}
        </Space>
      ),
    };
  }), [messages]);

  const roles = useMemo(() => ({
    assistant: {
        placement: 'start' as const,
        typing: { effect: 'typing' as const, step: 1, interval: 20 },
        avatar: <Avatar icon={<RobotOutlined />} style={{ backgroundColor: token.colorPrimary }} />,
        footer: (
          <Actions items={[{ icon: <CopyOutlined />, key: 'copy' }, { icon: <ReloadOutlined />, key: 'retry' }]} style={{ marginTop: 8 }} />
        )
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
    { key: '1', label: 'Fix: memory leak', icon: <HistoryOutlined /> },
    { key: '2', label: 'Refactor: auth logic', icon: <HistoryOutlined /> },
    { key: '3', label: 'Security check: API', icon: <HistoryOutlined /> },
  ];

  const promptItems = [
    { key: 'security', icon: <SafetyCertificateOutlined style={{ color: '#52c41a' }} />, label: 'Check Security', description: 'Analyze for vulnerabilities' },
    { key: 'performance', icon: <ThunderboltOutlined style={{ color: '#faad14' }} />, label: 'Optimize Performance', description: 'Find bottlenecks' },
    { key: 'style', icon: <LineChartOutlined style={{ color: '#1890ff' }} />, label: 'Best Practices', description: 'Code style & patterns' },
  ];

  const logoStyle: React.CSSProperties = {
    height: 32,
    margin: '16px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
  };

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgContainer }}>
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        width={250}
        style={{ borderRight: `1px solid ${token.colorBorderSecondary}` }}
      >
        <div style={{ ...logoStyle, background: token.colorPrimary, margin: '16px 8px' }}>
          AI Reviewer
        </div>
        <div style={{ padding: '0 8px' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            block
            style={{ marginBottom: 16 }}
            onClick={() => setMessages([])}
          >
            New Review
          </Button>
          <Typography.Title level={5} style={{ margin: '0 8px 8px' }}>
            Recent Reviews
          </Typography.Title>
          <Conversations
             items={conversationsItems}
             defaultSelectedKey="1"
          />
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
          <Flex align="center" gap="small">
            <CodeOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
            <Typography.Title level={4} style={{ margin: 0 }}>Code Review Assistant</Typography.Title>
          </Flex>
          <Badge status={isRequesting ? 'processing' : 'default'} text={isRequesting ? 'AI is thinking...' : 'Idle'} />
        </Header>
        <Content style={{
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
          overflow: 'hidden'
        }}>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 24 }}>
            {messages.length === 0 ? (
              <Welcome
                icon={<RobotOutlined style={{ fontSize: 64, color: token.colorPrimary }} />}
                title="I'm your AI Code Reviewer"
                description="Paste your code snippet below and I'll help you find bugs, improve performance, and follow best practices."
                extra={
                  <Flex vertical gap="middle" style={{ marginTop: 24 }}>
                     <Typography.Text type="secondary">Quick Actions:</Typography.Text>
                     <Prompts
                        items={promptItems}
                        onItemClick={(info) => setContent(`Please check this code for ${info.label.toLowerCase()}:\n\n`)}
                     />
                  </Flex>
                }
              />
            ) : (
              <Bubble.List
                items={messageItems}
                role={roles}
              />
            )}
          </div>
          <Card size="small" styles={{ body: { padding: 0 } }} variant="borderless">
            <Sender
              value={content}
              onChange={setContent}
              onSubmit={onSearch}
              loading={isRequesting}
              placeholder="Paste your code here..."
              prefix={<CodeOutlined />}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
