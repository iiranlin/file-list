"use client";

import { Viewer } from "@bytemd/react";
import gfm from "@bytemd/plugin-gfm";
import gfmLocale from "@bytemd/plugin-gfm/locales/zh_Hans.json";
import gemoji from "@bytemd/plugin-gemoji";
import highlight from "@bytemd/plugin-highlight";
import math from "@bytemd/plugin-math";
import mathLocale from "@bytemd/plugin-math/locales/zh_Hans.json";
import mermaid from "@bytemd/plugin-mermaid";
import mermaidLocale from "@bytemd/plugin-mermaid/locales/zh_Hans.json";
import mediumZoom from "@bytemd/plugin-medium-zoom";
// 代码复制和标注插件 - 与 react-blog 保持一致
import { roughNotationPlugin } from "plugin-bytemd-rough";

// 样式导入
import "bytemd/dist/index.css";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";

interface MdViewerProps {
  value?: string;
  className?: string;
}

// 创建 SSR 安全的 pluginCopyCode 插件
// pluginCopyCode 在初始化时会访问 document，导致 SSR 报错
// 这里将其延迟到 viewerEffect 执行时（客户端）
function createSafePluginCopyCode() {
  return {
    viewerEffect({ markdownBody }: { markdownBody: HTMLElement }) {
      // 仅在客户端环境执行
      if (typeof document === 'undefined') return;

      // 注入 CSS（仅一次）
      if (!document.getElementById('bytemd-copy-code-style')) {
        const style = document.createElement('style');
        style.id = 'bytemd-copy-code-style';
        style.textContent = `
          .copy-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(255, 255, 255, 0.3);
            color: #464646;
            font-size: 14px;
            padding: 6px 10px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: background 0.3s ease-in-out, transform 0.3s ease-in-out;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            font-weight: bold;
            backdrop-filter: blur(5px);
          }
          .copy-btn:hover {
            background: rgba(255, 255, 255, 0.5);
            transform: scale(1.1);
          }
        `;
        document.head.appendChild(style);
      }

      // 添加复制按钮
      markdownBody.querySelectorAll("pre code").forEach((codeBlock) => {
        const pre = codeBlock.parentElement;
        if (!pre) return;
        pre.style.position = "relative";
        if (pre.querySelector(".copy-btn")) return;

        const button = document.createElement("button");
        button.className = "copy-btn";
        button.innerText = "📋 复制";
        button.onclick = async () => {
          try {
            await navigator.clipboard.writeText(codeBlock.textContent || "");
            button.innerText = "✅ 复制成功";
            setTimeout(() => (button.innerText = "📋 复制"), 1500);
          } catch (err) {
            console.error("复制失败", err);
          }
        };
        pre.appendChild(button);
      });
    },
  };
}

// bytemd 插件配置 - 与 react-blog 保持一致
const plugins = [
  gfm({ locale: gfmLocale }),
  gemoji(),
  highlight(),
  math({ locale: mathLocale }),
  mermaid({ locale: mermaidLocale }),
  mediumZoom(),
  roughNotationPlugin(),
  createSafePluginCopyCode(),
];

export function MdViewer({ value = "", className = "" }: MdViewerProps) {
  return (
    <article className={`md-viewer markdown-body ${className}`}>
      <Viewer value={value} plugins={plugins} />
    </article>
  );
}

export default MdViewer;

