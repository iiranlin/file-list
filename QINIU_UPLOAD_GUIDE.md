# 七牛云文件上传功能指南

## 🎯 功能概述

项目已集成七牛云存储，支持图片、视频、音频文件的云端上传，文件将统一存储在 `fileList` 目录下，并使用时间戳+原文件名的命名方式。

## 📁 文件存储结构

```
七牛云存储空间 (pinxianimages)
└── fileList/
    ├── images/     # 图片文件 (JPEG, PNG, GIF, WebP)
    ├── videos/     # 视频文件 (MP4, WebM, OGG, AVI)
    └── audios/     # 音频文件 (MP3, WAV, OGG, AAC)
```

## 📝 文件命名规则

**格式**: `年月日时分_原文件名.扩展名`

**示例**:
- 上传时间: 2025年8月25日 14:30
- 原文件名: `sample-image.jpg`
- 最终路径: `fileList/images/202508251430_sample-image.jpg`
- CDN访问: `https://cdn.irlin.cn/fileList/images/202508251430_sample-image.jpg`

## 🔧 配置信息

### 环境变量配置
```env
QINIU_ACCESS_KEY=mb4u32kYPqC_6DHkjtnmPi0hFandO_MXWBAeyg4R
QINIU_SECRET_KEY=-ABx7ukAfHfP8eLLgKOtGw8RqXRleInc5Eg9a6jq
QINIU_BUCKET_NAME=pinxianimages
QINIU_DOMAIN=q2ozjg5p9.bkt.clouddn.com
QINIU_CDN_DOMAIN=https://cdn.irlin.cn
```

### 存储空间信息
- **存储空间**: pinxianimages
- **访问域名**: q2ozjg5p9.bkt.clouddn.com
- **CDN域名**: https://cdn.irlin.cn

## 📊 文件限制

| 文件类型 | 支持格式 | 最大大小 |
|---------|---------|---------|
| 图片 | JPEG, PNG, GIF, WebP | 20MB |
| 视频 | MP4, WebM, OGG, AVI | 200MB |
| 音频 | MP3, WAV, OGG, AAC | 50MB |

## 🚀 使用方法

### 1. 管理后台上传

在音频、视频、图片管理页面：

1. **选择上传方式**:
   - URL链接：传统方式，手动输入文件URL
   - 上传文件：新功能，直接上传到七牛云

2. **上传步骤**:
   - 点击"上传文件"选项卡
   - 选择文件或拖拽到上传区域
   - 系统自动上传并生成CDN链接
   - 文件URL自动填入表单

3. **自动功能**:
   - 文件名自动填入标题字段（如果标题为空）
   - 生成带时间戳的唯一文件名
   - 返回CDN加速链接

### 2. API接口使用

#### 获取上传凭证
```bash
GET /api/upload?type=image&fileName=sample.jpg
```

#### 直接上传文件
```bash
POST /api/upload
Content-Type: multipart/form-data

file: [文件数据]
type: image|video|audio
```

#### 测试路径生成
```bash
GET /api/upload/test?fileName=test.jpg&type=image
```

## 🧪 测试功能

### 1. 配置测试
```bash
npm run qiniu:test
```

### 2. API测试
```bash
# 测试图片路径生成
curl "http://localhost:3000/api/upload/test?fileName=photo.jpg&type=image"

# 测试视频路径生成
curl "http://localhost:3000/api/upload/test?fileName=movie.mp4&type=video"

# 测试音频路径生成
curl "http://localhost:3000/api/upload/test?fileName=song.mp3&type=audio"
```

## 📋 功能特点

### ✅ 已实现功能
- [x] 七牛云存储集成
- [x] 文件类型验证
- [x] 文件大小限制
- [x] 时间戳命名
- [x] CDN加速访问
- [x] 上传进度显示
- [x] 错误处理
- [x] 预览功能（图片）
- [x] 自动表单填充

### 🔄 上传流程
1. 用户选择文件
2. 前端验证文件类型和大小
3. 生成带时间戳的文件路径
4. 上传到七牛云存储
5. 返回CDN访问链接
6. 自动填入表单字段

### 🛡️ 安全特性
- 文件类型白名单验证
- 文件大小限制
- 上传凭证时效控制（1小时）
- 错误处理和日志记录

## 🔍 故障排除

### 常见问题

1. **上传失败**
   - 检查七牛云配置是否正确
   - 验证存储空间权限
   - 确认网络连接

2. **文件访问失败**
   - 检查CDN域名配置
   - 验证文件路径是否正确
   - 确认存储空间公开访问权限

3. **配置错误**
   - 运行 `npm run qiniu:test` 检查配置
   - 验证环境变量设置
   - 检查密钥是否有效

### 调试命令
```bash
# 检查七牛云配置
npm run qiniu:test

# 验证完整项目设置
npm run db:verify

# 测试API接口
curl -X GET "http://localhost:3000/api/upload/test?fileName=debug.jpg&type=image"
```

## 📞 技术支持

如遇问题，请：
1. 运行测试命令检查配置
2. 查看浏览器控制台错误信息
3. 检查服务器日志
4. 参考七牛云官方文档

---

**注意**: 请确保七牛云存储空间已正确配置，并且CDN域名已绑定和备案。
