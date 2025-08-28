import { toast as useToastHook } from "@/hooks/use-toast"

// Toast配置选项
interface ToastOptions {
  description?: string
}

// 增强的Toast工具函数
export const toast = {
  // 成功提示
  success: (message: string, options?: ToastOptions) => {
    return useToastHook({
      title: message,
      description: options?.description,
      variant: "success",
    })
  },

  // 错误提示
  error: (message: string, options?: ToastOptions) => {
    return useToastHook({
      title: message,
      description: options?.description,
      variant: "destructive",
    })
  },

  // 警告提示
  warning: (message: string, options?: ToastOptions) => {
    return useToastHook({
      title: message,
      description: options?.description,
      variant: "warning",
    })
  },

  // 信息提示
  info: (message: string, options?: ToastOptions) => {
    return useToastHook({
      title: message,
      description: options?.description,
      variant: "info",
    })
  },

  // 普通提示
  message: (message: string, options?: ToastOptions) => {
    return useToastHook({
      title: message,
      description: options?.description,
      variant: "default",
    })
  },

  // 权限相关的专用提示
  permission: {
    denied: (action?: string) => {
      return toast.warning(
        '权限不足',
        {
          description: action ? `仅管理员可执行${action}操作` : '仅管理员可执行此操作',
        }
      )
    },

    required: (permission: string) => {
      return toast.warning(
        '需要权限',
        {
          description: `此操作需要${permission}权限`,
        }
      )
    },
  },

  // 操作相关的专用提示
  operation: {
    success: (operation: string, item?: string) => {
      return toast.success(
        `${operation}成功`,
        {
          description: item ? `${item}${operation}成功` : undefined,
        }
      )
    },

    failed: (operation: string, reason?: string) => {
      return toast.warning(
        `${operation}失败`,
        {
          description: reason || '请稍后重试',
        }
      )
    },

    loading: (operation: string) => {
      return toast.info(`${operation}中...`)
    },
  },

  // 文件上传相关提示
  upload: {
    success: (filename?: string) => {
      return toast.success(
        '上传成功',
        {
          description: filename ? `文件 ${filename} 上传成功` : '文件上传成功',
        }
      )
    },

    failed: (reason: string) => {
      return toast.warning(
        '上传失败',
        {
          description: reason,
        }
      )
    },

    progress: (filename: string) => {
      return toast.info(`正在上传 ${filename}...`)
    },
  },

  // 网络相关提示
  network: {
    error: () => {
      return toast.warning(
        '网络错误',
        {
          description: '请检查网络连接后重试',
        }
      )
    },

    timeout: () => {
      return toast.warning(
        '请求超时',
        {
          description: '服务器响应超时，请稍后重试',
        }
      )
    },
  },

  // 关闭所有Toast
  dismiss: (toastId?: string) => {
    // Radix UI Toast 的 dismiss 功能通过 useToast hook 提供
    // 这里我们可以导出 useToast hook 让组件直接使用
    if (toastId) {
      console.warn('使用 useToast().dismiss(toastId) 来关闭特定的 Toast')
    }
  },
}

// 导出 useToast hook 供组件使用
export { useToastHook as useToast }
