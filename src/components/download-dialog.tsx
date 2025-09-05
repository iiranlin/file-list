"use client"

import * as React from "react"
import { Download, Heart, Coffee, Gift } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DownloadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  downloadUrl: string
  type: "audio" | "video"
}

export function DownloadDialog({ 
  open, 
  onOpenChange, 
  title, 
  downloadUrl, 
  type 
}: DownloadDialogProps) {
  const [isDownloading, setIsDownloading] = React.useState(false)

  const handleDownload = async (isDonated: boolean = false) => {
    setIsDownloading(true)
    
    try {
      // 创建下载链接
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = title
      link.target = '_blank'
      
      // 触发下载
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // 如果是捐赠下载，可以在这里添加统计或其他逻辑
      if (isDonated) {
        console.log('感谢您的捐赠支持！')
      }
      
      // 关闭弹窗
      onOpenChange(false)
    } catch (error) {
      console.error('下载失败:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const typeText = type === "audio" ? "音频" : "视频"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            下载{typeText}
          </DialogTitle>
          <DialogDescription>
            {title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 捐赠引导文案 */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20">
                <Heart className="h-8 w-8 text-pink-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                支持我们继续创作
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                您的每一份捐赠都将用于：
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Coffee className="h-3 w-3" />
                  <span>服务器维护与带宽费用</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Gift className="h-3 w-3" />
                  <span>设备升级与内容制作</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                让我们能够为您提供更优质的{typeText}内容
              </p>
            </div>
          </div>

          {/* 捐赠图片占位 */}
          <div className="flex justify-center">
            <div className="w-48 h-32 bg-gradient-to-br from-muted to-muted-foreground/20 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
              <div className="text-center">
                <Gift className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">捐赠二维码</p>
                <p className="text-xs text-muted-foreground/70">微信 / 支付宝</p>
              </div>
            </div>
          </div>

          {/* 下载按钮 */}
          <div className="space-y-3">
            <Button
              onClick={() => handleDownload(true)}
              disabled={isDownloading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              {isDownloading ? "下载中..." : "已捐赠，立即下载"}
            </Button>
            
            <Button
              onClick={() => handleDownload(false)}
              disabled={isDownloading}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "下载中..." : "暂时白嫖下载"}
            </Button>
          </div>

          {/* 底部说明 */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              无论您选择哪种方式，我们都很感谢您的支持 ❤️
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
