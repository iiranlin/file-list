# 使用 Node 23.11.0 官方镜像
FROM node:23.11.0-alpine

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package.json ./

# 安装依赖（无 lock 文件）
RUN pnpm install

# 复制项目所有代码
COPY . .

# 构建 Next.js SSR
RUN pnpm build

# 暴露应用端口
EXPOSE 3000

# 启动 Next.js SSR
CMD ["pnpm", "start"]
