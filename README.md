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

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
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

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the website.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── audio/             # Audio collection page
│   ├── video/             # Video gallery page
│   ├── images/            # Image gallery page
│   ├── tutorials/         # Tutorials page
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
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
│   └── data-loader.ts    # JSON data loading functions

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
