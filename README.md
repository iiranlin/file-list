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

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
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

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin management system
│   │   ├── login/         # Admin login page
│   │   ├── audio/         # Audio management
│   │   ├── video/         # Video management
│   │   ├── images/        # Image management
│   │   ├── tutorials/     # Tutorial management
│   │   └── page.tsx       # Admin dashboard
│   ├── api/               # API routes for admin operations
│   │   └── admin/         # Admin API endpoints
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
