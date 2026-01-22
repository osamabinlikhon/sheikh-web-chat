import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Divider, Alert, message, ConfigProvider } from 'antd'
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

const { Title, Text } = Typography

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { signInWithEmail, signInWithGoogle, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()

  const handleGoogleSignIn = async (): Promise<void> => {
    clearError()
    setLoading(true)
    try {
      await signInWithGoogle()
      messageApi.success('Welcome back!')
      navigate('/chat')
    } catch {
      // Error handled by auth context
    } finally {
      setLoading(false)
    }
  }

  const onFinish = async (values: { email: string; password: string }): Promise<void> => {
    clearError()
    setLoading(true)
    try {
      await signInWithEmail(values.email, values.password)
      messageApi.success('Welcome back!')
      navigate('/chat')
    } catch {
      // Error handled by auth context
    } finally {
      setLoading(false)
    }
  }

  const brandColors = {
    red: '#E31837',
    green: '#009639',
    black: '#1D1D1B',
    gray: '#8C8C8C'
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: brandColors.green,
          borderRadius: 8
        }
      }}
    >
      <div style={styles.container}>
        {contextHolder}
        <Card style={styles.card} bordered={false}>
          <div style={styles.header}>
            <Logo size="large" />
            <Title level={4} style={styles.subtitle}>
              Sign in to your account
            </Title>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={clearError}
              style={styles.alert}
            />
          )}

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={styles.inputIcon} />}
                placeholder="Email address"
                style={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={styles.inputIcon} />}
                placeholder="Password"
                style={styles.input}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={styles.primaryButton}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider style={styles.divider}>
            <Text style={{ color: brandColors.gray }}>or continue with</Text>
          </Divider>

          <Button
            icon={<GoogleOutlined />}
            onClick={handleGoogleSignIn}
            loading={loading}
            style={styles.googleButton}
            size="large"
            block
          >
            Continue with Google
          </Button>

          <div style={styles.footer}>
            <Text style={{ color: brandColors.gray }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: brandColors.green }}>
                Sign up
              </Link>
            </Text>
          </div>
        </Card>

        <style>{`
          @media (max-width: 480px) {
            .ant-card {
              border-radius: 0 !important;
            }
          }
        `}</style>
      </div>
    </ConfigProvider>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
    padding: '24px'
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  subtitle: {
    marginTop: '16px',
    color: '#1D1D1B',
    fontWeight: 500
  },
  alert: {
    marginBottom: '24px'
  },
  input: {
    borderRadius: '8px'
  },
  inputIcon: {
    color: '#8C8C8C'
  },
  primaryButton: {
    width: '100%',
    height: '48px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #009639 0%, #007a2e 100%)',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600
  },
  divider: {
    margin: '24px 0'
  },
  googleButton: {
    width: '100%',
    height: '48px',
    borderRadius: '8px',
    border: '1px solid #E0E0E0',
    fontSize: '15px',
    fontWeight: 500
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px'
  }
}

export default Login
