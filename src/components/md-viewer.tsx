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
import { roughNotationPlugin, pluginCopyCode } from "plugin-bytemd-rough";

// 样式导入
import "bytemd/dist/index.css";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";

interface MdViewerProps {
  value?: string;
  className?: string;
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
  pluginCopyCode(),
];

export function MdViewer({ value = "", className = "" }: MdViewerProps) {
  return (
    <article className={`md-viewer markdown-body ${className}`}>
      <Viewer value={value} plugins={plugins} />
    </article>
  );
}

export default MdViewer;

