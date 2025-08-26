"use client"

import { useState, useEffect } from "react"
import { Shield, User, Key, QrCode, CheckCircle, AlertTriangle, Clock, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { setAuthToken } from "@/lib/auth"

interface AuthState {
  loading: boolean
  success: boolean
  error: string | null
}

interface RegistrationData {
  userName: string
  secret: string
  qrCodeDataUrl: string
  currentToken: string
  remainingTime: number
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('register')
  const [userName, setUserName] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [currentToken, setCurrentToken] = useState('')
  const [remainingTime, setRemainingTime] = useState(30)

  const [authState, setAuthState] = useState<AuthState>({
    loading: false,
    success: false,
    error: null,
  })

  // 更新当前TOTP代码和剩余时间
  useEffect(() => {
    if (!registrationData) return

    const updateToken = async () => {
      try {
        const response = await fetch('/api/auth/current-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: registrationData.secret }),
        })
        const data = await response.json()
        if (data.success) {
          setCurrentToken(data.token)
          setRemainingTime(data.remainingTime)
        }
      } catch (error) {
        console.error('更新TOTP代码失败:', error)
      }
    }

    updateToken()
    const interval = setInterval(updateToken, 1000)
    return () => clearInterval(interval)
  }, [registrationData])

  // 处理用户注册
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim()) return

    setAuthState({ loading: true, success: false, error: null })

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: userName.trim() }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setRegistrationData(result.data)
        setCurrentToken(result.data.currentToken)
        setRemainingTime(result.data.remainingTime)
        setAuthState({ loading: false, success: false, error: null })
      } else {
        setAuthState({
          loading: false,
          success: false,
          error: result.error || '注册失败',
        })
      }
    } catch (error) {
      setAuthState({
        loading: false,
        success: false,
        error: '网络错误，请重试',
      })
    }
  }

  // 处理TOTP确认
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registrationData || !totpCode.trim()) return

    setAuthState({ loading: true, success: false, error: null })

    try {
      const response = await fetch('/api/auth/register', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: registrationData.userName,
          totpCode: totpCode.trim()
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setAuthState({
          loading: false,
          success: true,
          error: null,
        })
        setTimeout(() => {
          setActiveTab('login')
          setRegistrationData(null)
          setTotpCode('')
          setAuthState({ loading: false, success: false, error: null })
        }, 2000)
      } else {
        setAuthState({
          loading: false,
          success: false,
          error: result.error || '确认失败',
        })
      }
    } catch (error) {
      setAuthState({
        loading: false,
        success: false,
        error: '网络错误，请重试',
      })
    }
  }

  // 处理TOTP登录
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim() || !totpCode.trim()) return

    setAuthState({ loading: true, success: false, error: null })

    try {
      const response = await fetch('/api/auth/totp-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName.trim(),
          totpCode: totpCode.trim()
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // 设置认证token
        setAuthToken(result.user)

        setAuthState({
          loading: false,
          success: true,
          error: null,
        })
        setTimeout(() => {
          window.location.href = '/admin'
        }, 2000)
      } else {
        setAuthState({
          loading: false,
          success: false,
          error: result.error || '登录失败',
        })
      }
    } catch (error) {
      setAuthState({
        loading: false,
        success: false,
        error: '网络错误，请重试',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* 页面标题 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-lg bg-blue-500 text-white">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            TOTP身份验证
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            基于时间的一次性密码验证系统
          </p>
        </div>

        {/* TOTP验证表单 */}
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="register">注册TOTP</TabsTrigger>
                <TabsTrigger value="login">TOTP登录</TabsTrigger>
              </TabsList>

              {/* 注册TOTP */}
              <TabsContent value="register" className="space-y-4">
                <div className="text-center">
                  <QrCode className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="text-lg font-semibold">设置TOTP验证</h3>
                  <p className="text-sm text-muted-foreground">
                    输入用户名生成二维码，用验证器应用扫描
                  </p>
                </div>

                {!registrationData ? (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="registerUserName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        用户名
                      </Label>
                      <Input
                        id="registerUserName"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="请输入您的用户名"
                        required
                        disabled={authState.loading}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!userName.trim() || authState.loading}
                    >
                      {authState.loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          生成中...
                        </>
                      ) : (
                        <>
                          <QrCode className="h-4 w-4 mr-2" />
                          生成二维码
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* 二维码显示 */}
                    <div className="text-center">
                      <div className="bg-white p-4 rounded-lg inline-block">
                        <img
                          src={registrationData.qrCodeDataUrl}
                          alt="TOTP QR Code"
                          className="w-48 h-48 mx-auto"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        请用验证器应用（如Google Authenticator、Authy）扫描二维码
                      </p>
                    </div>

                    {/* 密钥显示 */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <Label className="text-xs text-muted-foreground">
                        手动输入密钥（如无法扫描二维码）:
                      </Label>
                      <p className="font-mono text-sm break-all">
                        {registrationData.secret}
                      </p>
                    </div>

                    {/* 当前TOTP代码 */}
                    <div className="text-center bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <Label className="text-sm text-muted-foreground">当前验证码:</Label>
                      <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                        {currentToken}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        剩余 {remainingTime} 秒
                      </div>
                    </div>

                    {/* 确认表单 */}
                    <form onSubmit={handleConfirm} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="confirmCode" className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          输入验证器中的6位数字
                        </Label>
                        <Input
                          id="confirmCode"
                          type="text"
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="000000"
                          maxLength={6}
                          required
                          disabled={authState.loading}
                          className="text-center text-lg font-mono"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={totpCode.length !== 6 || authState.loading}
                      >
                        {authState.loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            确认中...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            确认并激活
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </TabsContent>

              {/* TOTP登录 */}
              <TabsContent value="login" className="space-y-4">
                <div className="text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h3 className="text-lg font-semibold">TOTP登录</h3>
                  <p className="text-sm text-muted-foreground">
                    输入用户名和验证器应用中的6位数字
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginUserName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      用户名
                    </Label>
                    <Input
                      id="loginUserName"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="请输入您的用户名"
                      required
                      disabled={authState.loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loginCode" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      TOTP验证码
                    </Label>
                    <Input
                      id="loginCode"
                      type="text"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      required
                      disabled={authState.loading}
                      className="text-center text-lg font-mono"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!userName.trim() || totpCode.length !== 6 || authState.loading}
                  >
                    {authState.loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        登录中...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        TOTP登录
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 状态提示 */}
        {authState.error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{authState.error}</AlertDescription>
          </Alert>
        )}

        {authState.success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              验证成功！正在跳转到管理页面...
            </AlertDescription>
          </Alert>
        )}

        {/* 说明信息 */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <h4 className="font-medium">TOTP验证说明：</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>首次使用需要注册：输入用户名生成二维码</li>
                <li>用验证器应用扫描二维码或手动输入密钥</li>
                <li>输入验证器中的6位数字确认注册</li>
                <li>后续登录只需用户名和当前6位验证码</li>
                <li>验证码每30秒更新一次，具有时效性</li>
                <li>推荐使用Google Authenticator、Authy等应用</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
