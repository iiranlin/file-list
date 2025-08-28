# Personal Showcase Website

A clean and modern personal showcase website built with Next.js 15 and shadcn/ui components. This site serves as a personal hub to display different types of content including audio files, videos, images, and tutorials.

## ✨ Features

- **🎵 Audio Player**: Built-in audio player with play controls, duration display, and volume control
- **🎥 Video Gallery**: Video thumbnails with modal preview and detailed information
- **🖼️ Image Gallery**: Responsive image grid with lightbox functionality and keyboard navigation
- **📚 Tutorials**: Expandable tutorial cards with full content modal and clean typography
- **🌙 Dark Mode**: Toggle between light, dark, and system themes
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **⚡ Modern Stack**: Built with Next.js 15, TypeScript, and TailwindCSS
- **🔐 Admin System**: Complete content management system with authentication
- **🗄️ Database Support**: PostgreSQL database with Drizzle ORM and JSON fallback
- **☁️ File Upload**: Qiniu Cloud Storage integration for media files
- **🔐 Authentication**: TOTP (Time-based One-Time Password) verification system

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **File Storage**: Qiniu Cloud Storage
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode support

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd file-list
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your database credentials
   ```

4. **Configure the database**
   ```bash
   # Run the database setup wizard
   npm run db:setup

   # Test database connection
   npm run db:test

   # Push schema to database
   npm run db:push

   # Import initial data from JSON files
   npm run db:migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the website.

## 🔐 管理系统

网站包含一个完整的内容管理系统，可以通过以下方式访问：

### 访问管理后台

1. **登录页面**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. **管理员账号**:
   - 用户名: `admin`
   - 密码: `admin123`

### 管理功能

- **🎵 音频管理**: 添加、编辑、删除音频文件
- **🎥 视频管理**: 管理视频内容和元数据
- **🖼️ 图片管理**: 管理图片集合和标签
- **📚 教程管理**: 创建和编辑教程内容
- **📊 数据统计**: 查看各类内容的统计信息

### 管理系统特性

- **安全认证**: 基于用户名密码的登录系统
- **响应式设计**: 支持桌面和移动设备管理
- **实时更新**: 修改内容后立即在前台显示
- **表单验证**: 完整的数据验证和错误处理
- **批量操作**: 支持批量管理内容项目

## 🗄️ 数据库配置

### PostgreSQL 数据库

项目支持PostgreSQL数据库，使用Drizzle ORM进行数据管理：

1. **数据库连接**: 在 `.env.local` 中配置 `DATABASE_URL`
2. **表结构**: 自动生成4个表（audio_files, video_files, image_files, tutorials）
3. **数据迁移**: 支持从JSON文件迁移到数据库
4. **回退机制**: 如果数据库连接失败，自动回退到JSON文件

### 快速开始

1. **运行配置向导**:
   ```bash
   npm run db:setup
   ```

2. **配置数据库连接**:
   编辑 `.env.local` 文件，设置您的数据库连接信息：
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
   ```

3. **测试连接**:
   ```bash
   npm run db:test
   ```

### 推荐的云数据库服务

- **[Neon](https://neon.tech)** - 免费的无服务器PostgreSQL
- **[Supabase](https://supabase.com)** - 开源的Firebase替代品
- **[Railway](https://railway.app)** - 简单的云部署平台
- **[Vercel Postgres](https://vercel.com/storage/postgres)** - Vercel的托管PostgreSQL

### 数据库命令

```bash
# 验证完整项目设置
npm run db:verify

# 测试数据库连接
npm run db:test

# 生成迁移文件
npm run db:generate

# 推送schema到数据库
npm run db:push

# 打开数据库管理界面
npm run db:studio

# 从JSON迁移数据到数据库
npm run db:migrate
```

### 数据迁移

1. **通过管理界面**: 访问 `/admin/migrate` 页面进行可视化迁移
2. **通过命令行**: 运行 `npm run db:migrate` 脚本
3. **通过API**: 调用 `/api/admin/migrate` 端点

### 数据存储策略

- **优先级**: 数据库 > JSON文件
- **回退机制**: 数据库失败时自动使用JSON文件
- **双重保障**: JSON文件作为备份保留

## ☁️ 七牛云存储配置

### 文件上传功能

项目集成了七牛云存储，支持图片、视频、音频文件的云端上传：

1. **支持的文件类型**:
   - 图片: JPEG, PNG, GIF, WebP (最大20MB)
   - 视频: MP4, WebM, OGG, AVI (最大200MB)
   - 音频: MP3, WAV, OGG, AAC (最大50MB)

2. **上传方式**:
   - URL链接输入（传统方式）
   - 文件直接上传（新功能）

### 配置步骤

1. **获取七牛云账户**:
   - 注册 [七牛云](https://www.qiniu.com/) 账户
   - 创建存储空间（Bucket）
   - 获取访问密钥（AccessKey/SecretKey）

2. **配置环境变量**:
   ```env
   QINIU_ACCESS_KEY=your_access_key
   QINIU_SECRET_KEY=your_secret_key
   QINIU_BUCKET_NAME=your_bucket_name
   QINIU_DOMAIN=your_bucket_domain
   QINIU_CDN_DOMAIN=https://your-cdn-domain.com
   ```

3. **测试配置**:
   ```bash
   npm run qiniu:test
   ```

### 文件存储结构

上传的文件将按以下结构存储在七牛云：

```
fileList/
├── images/    # 图片文件
├── videos/    # 视频文件
└── audios/    # 音频文件
```

### 文件命名规则

文件名格式：`年月日时分_原文件名.扩展名`

示例：
- `202508251430_sample-image.jpg`
- `202508251430_demo-video.mp4`
- `202508251430_music-track.mp3`

### 使用方法

在管理后台的各个内容管理页面中：
1. 选择"上传文件"选项卡
2. 点击选择文件或拖拽文件到上传区域
3. 系统自动上传到七牛云并返回CDN链接
4. 文件URL自动填入表单字段

### 测试上传功能

```bash
# 测试七牛云配置和路径生成
npm run qiniu:test

# 测试API路径生成
curl "http://localhost:3000/api/upload/test?fileName=test.jpg&type=image"
```

## 🔐 TOTP身份验证系统

### TOTP验证机制

项目集成了基于时间的一次性密码（TOTP）身份验证系统：

1. **验证方式**: 用户名 + 6位时间同步验证码
2. **注册流程**: 输入用户名 → 生成二维码 → 扫描设置 → 确认激活
3. **用户状态**: 新注册用户默认为启用状态（isActive: 1）
4. **登录流程**: 用户名 + 验证器应用中的当前6位数字
5. **数据存储**: PostgreSQL数据库存储TOTP密钥
6. **时间窗口**: 30秒更新周期，允许±1个时间窗口偏差
7. **安全特性**: 防重放攻击、密钥安全存储、用户状态管理

### 访问页面

- **TOTP验证**: `/auth` - TOTP注册和登录页面（隐藏主导航栏）
- **用户管理**: `/admin/users` - 基于角色的用户管理系统
- **导航测试**: `/test-navigation` - 测试导航栏显示/隐藏功能
- **认证调试**: `/debug-auth` - 调试用户认证和权限问题


### 推荐验证器应用

- **Google Authenticator** - 免费，支持多平台
- **Microsoft Authenticator** - 微软官方应用
- **Authy** - 支持云同步和备份
- **1Password** - 集成密码管理器

### 使用流程

1. **首次注册**:
   ```bash
   访问 /auth → 注册TOTP → 输入用户名 → 扫描二维码 → 输入验证码确认
   ```

2. **日常登录**:
   ```bash
   访问 /auth → TOTP登录 → 输入用户名和当前验证码
   ```

### 测试和开发

```bash
# 测试TOTP系统功能
npm run totp:test

# 测试传统身份验证系统
npm run auth:test

# 创建测试验证码数据
npm run db:seed-auth

# 创建管理员用户
npm run admin:create
```

### 权限控制系统

项目实现了基于角色的权限控制：

#### 用户角色
- **管理员 (admin)**: 拥有所有权限，可以查看、创建、编辑、删除所有内容
- **普通用户 (user)**: 仅有读取权限，可以查看内容但无法修改

#### 权限级别
- **读取权限 (read)**: 查看数据（所有用户都有此权限）
- **写入权限 (write)**: 创建和编辑数据
- **删除权限 (delete)**: 删除数据

#### 权限验证
- **读取权限**: 不受限制，所有用户都可以查看数据
- **写入/删除权限**: 需要TOTP验证和相应角色权限
- **前端**: 基于用户角色显示/隐藏操作按钮
- **后端**: API级别的权限验证，防止绕过前端限制
- **错误提示**: 权限不足时显示友好的错误信息

#### 受保护的API端点
- `/api/admin/audio` - 音频管理 (需要相应权限)
- `/api/admin/video` - 视频管理 (需要相应权限)
- `/api/admin/images` - 图片管理 (需要相应权限)
- `/api/admin/tutorials` - 教程管理 (需要相应权限)
- `/api/admin/users` - 用户管理 (需要相应权限)
- `/api/upload` - 文件上传 (需要写入权限)

#### 用户界面改进
- **Toast通知**: 使用 Radix UI Toast 组件，显示在右上角
- **类型区分**: 成功、错误、警告、信息等不同类型的提示
- **权限提示**: 权限不足时的专用提示样式
- **操作反馈**: 创建、更新、删除操作的即时反馈
- **网络提示**: 网络错误、超时等专用提示
- **上传提示**: 文件上传成功/失败的专用提示
- **条件导航**: 根据页面类型智能显示/隐藏导航栏

#### Toast配置特性
- **智能定位**: 右上角显示，在导航栏下方，不遮挡主要内容
- **最高层级**: z-index: 2147483647，永远浮在最上层
- **纯色背景**: 使用完全不透明的背景，清晰可读
- **主题适配**: 自动适配深色/浅色主题
- **响应式**: 移动端自适应布局
- **可访问性**: 符合 WCAG 标准的无障碍设计

#### 导航栏配置
- **主站页面**: 显示主导航栏（首页、关于、联系等）
- **Admin管理系统**: 隐藏主导航栏，显示admin专用导航栏
- **认证页面**: 隐藏主导航栏，专注于认证功能
- **智能切换**: 基于路径自动切换导航栏显示
- **返回功能**: Admin页面提供"返回网站"链接

#### 管理员功能
```bash
# 创建管理员账户
npm run admin:create

# 测试权限控制系统
npm run permissions:test

# 验证权限控制修复
npm run permissions:verify

# 测试API权限控制（需要先启动服务器）
npm run dev  # 在另一个终端运行
npm run api:test
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin management system
│   │   ├── audio/         # Audio management
│   │   ├── video/         # Video management
│   │   ├── images/        # Image management
│   │   ├── tutorials/     # Tutorial management
│   │   ├── users/         # User management with role-based permissions
│   │   └── page.tsx       # Admin dashboard
│   ├── api/               # API routes
│   │   ├── admin/         # Admin API endpoints
│   │   └── auth/          # TOTP authentication APIs
│   ├── auth/              # TOTP authentication page
│   ├── audio/             # Audio collection page
│   ├── video/             # Video gallery page
│   ├── images/            # Image gallery page
│   ├── tutorials/         # Tutorials page
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # Admin management components
│   │   ├── audio-form-dialog.tsx    # Audio form dialog
│   │   ├── video-form-dialog.tsx    # Video form dialog
│   │   ├── image-form-dialog.tsx    # Image form dialog
│   │   └── tutorial-form-dialog.tsx # Tutorial form dialog
│   ├── admin-layout.tsx  # Admin layout component
│   ├── audio-player.tsx  # Audio player component
│   ├── video-player.tsx  # Video player with modal
│   ├── image-gallery.tsx # Image gallery with lightbox
│   ├── tutorial-card.tsx # Tutorial card component
│   ├── navigation.tsx    # Main navigation
│   ├── theme-provider.tsx # Theme provider
│   └── theme-toggle.tsx  # Dark mode toggle
├── data/                 # JSON data sources
│   ├── audio.json        # Audio files data
│   ├── videos.json       # Video files data
│   ├── images.json       # Image files data
│   └── tutorials.json    # Tutorial content data
├── lib/                  # Utilities and data loaders
│   ├── utils.ts          # Utility functions
│   ├── data-loader.ts    # JSON data loading functions
│   ├── data-manager.ts   # Data management functions
│   └── auth.ts           # Authentication utilities

```

## 🎨 Design Features

- **Clean & Modern**: Minimal design with spacious layouts
- **Hover Animations**: Subtle scale and shadow effects
- **Smooth Transitions**: Fluid animations throughout the interface
- **Typography**: Clean, readable typography with proper hierarchy
- **Color Scheme**: Neutral colors with accent colors for each content type

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Customization

### Adding Content

现在所有数据都存储在JSON文件中，更容易管理和更新：

1. **Audio Files**: 编辑 `src/data/audio.json` 文件
2. **Videos**: 编辑 `src/data/videos.json` 文件
3. **Images**: 编辑 `src/data/images.json` 文件
4. **Tutorials**: 编辑 `src/data/tutorials.json` 文件

每个JSON文件都包含相应类型的数据数组，具有完整的类型定义和结构化格式。

### Styling

- Modify `src/app/globals.css` for global styles
- Update component styles using TailwindCSS classes
- Customize the color scheme in the CSS variables

### Components

All components are modular and can be easily customized:
- Audio player controls and styling
- Video modal and thumbnail display
- Image gallery grid and lightbox
- Tutorial card layout and typography

## 🚀 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

Alternatively, you can deploy to any platform that supports Next.js:

```bash
npm run build
npm start
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
