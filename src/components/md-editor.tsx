"use client";

import { Editor } from "@bytemd/react";
import gfm from "@bytemd/plugin-gfm";
import gfmLocale from "@bytemd/plugin-gfm/locales/zh_Hans.json";
import gemoji from "@bytemd/plugin-gemoji";
import highlight from "@bytemd/plugin-highlight";
import math from "@bytemd/plugin-math";
import mathLocale from "@bytemd/plugin-math/locales/zh_Hans.json";
import mermaid from "@bytemd/plugin-mermaid";
import mermaidLocale from "@bytemd/plugin-mermaid/locales/zh_Hans.json";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import { roughNotationPlugin, pluginCopyCode } from "plugin-bytemd-rough";
import zhHans from "bytemd/locales/zh_Hans.json";

// 样式导入
import "bytemd/dist/index.css";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";

interface MdEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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

// 获取认证头
const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const user = JSON.parse(localStorage.getItem("totp_auth_user") || "{}");
  if (!user.userName) return {};

  const token = btoa(`${user.userName}:${user.id}:${Date.now()}`);
  return {
    Authorization: `Bearer ${token}`,
  };
};

// 上传图片到 Cloudflare R2
async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", "image");

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "图片上传失败");
  }

  const result = await response.json();
  return result.url;
}

export function MdEditor({
  value,
  onChange,
  placeholder = "",
  className = "",
}: MdEditorProps) {
  // 处理图片上传
  const handleUploadImages = async (files: File[]) => {
    const urls: { url: string; alt: string; title: string }[] = [];

    for (const file of files) {
      try {
        console.log("开始上传图片:", file.name);
        const url = await uploadImage(file);
        console.log("图片上传成功, URL:", url);
        // 对 URL 进行编码，处理空格等特殊字符
        const encodedUrl = url.replace(/ /g, '%20');
        urls.push({
          url: encodedUrl,
          alt: file.name,
          title: file.name,
        });
      } catch (error) {
        console.error("上传图片失败:", error);
        // 继续尝试上传其他图片
      }
    }

    console.log("返回的图片列表:", urls);
    return urls;
  };

  return (
    <div className={`md-editor-wrapper ${className}`}>
      <Editor
        value={value}
        plugins={plugins}
        locale={zhHans}
        placeholder={placeholder}
        onChange={onChange}
        uploadImages={handleUploadImages}
      />
    </div>
  );
}

export default MdEditor;
