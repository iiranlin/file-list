"use client";

import * as React from "react";
import { throttle } from "lodash";

import { MdViewer } from "@/components/md-viewer";

type TocHeading = {
  index: number;
  level: number;
  text: string;
  listNo: string;
  id: string; // 自定义增加 id 便于锚点
};

interface TutorialReaderProps {
  content: string;
  children?: React.ReactNode;
}

// 保留原带的 slugify 以保持向后的代码锚点兼容
function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-");
}

function trimArrZero(arr: number[]): number[] {
  let start, end;
  for (start = 0; start < arr.length; start++) {
    if (arr[start]) {
      break;
    }
  }
  for (end = arr.length - 1; end >= 0; end--) {
    if (arr[end]) {
      break;
    }
  }
  return arr.slice(start, end + 1);
}

function getNavStructure(source: string): TocHeading[] {
  if (!source) return [];
  
  const contentWithoutCode = source
    .replace(/^[^#]+\n/g, "")
    .replace(/(?:[^\n#]+)#+\s([^#\n]+)\n*/g, "") // 匹配行内出现 # 号的情况
    .replace(/^\s[^#\n]*\n+/, "")
    .replace(/```[^`\n]*\n+[^```]+```\n+/g, "")
    .replace(/`([^`\n]+)`/g, "$1")
    .replace(/\*\*?([^*\n]+)\*\*?/g, "$1")
    .replace(/__?([^_\n]+)__?/g, "$1")
    .trim();

  const pattOfTitle = /#+\s([^#\n]+)\n*/g;
  const matchResult = contentWithoutCode.match(pattOfTitle);

  if (!matchResult) {
    return [];
  }

  const navData: TocHeading[] = matchResult.map((r, i) => {
    const rawText = r.replace(pattOfTitle, "$1").trim();
    // 追加 id 方便与我们的原生点击事件做匹配
    const fallbackId = slugify(rawText);
    
    return {
      index: i,
      level: r.match(/^#+/g)?.[0].length || 1,
      text: rawText,
      listNo: "",
      id: fallbackId,
    };
  });

  // 处理可能重复的 fallbackId
  const usedIds = new Map<string, number>();
  navData.forEach((item) => {
    const count = usedIds.get(item.id) ?? 0;
    usedIds.set(item.id, count + 1);
    if (count > 0) {
      item.id = `${item.id}-${count}`;
    }
  });

  let maxLevel = 0;
  navData.forEach((t) => {
    if (t.level > maxLevel) {
      maxLevel = t.level;
    }
  });
  
  let matchStack: { level: number; arr: number[] }[] = [];
  
  for (let i = 0; i < navData.length; i++) {
    const t = navData[i];
    const { level } = t;
    while (matchStack.length && matchStack[matchStack.length - 1].level > level) {
      matchStack.pop();
    }
    if (matchStack.length === 0) {
      const arr = new Array(maxLevel).fill(0);
      arr[level - 1] += 1;
      matchStack.push({
        level,
        arr,
      });
      t.listNo = trimArrZero(arr).join(".");
      continue;
    }
    const { arr } = matchStack[matchStack.length - 1];
    const newArr = arr.slice();
    newArr[level - 1] += 1;
    matchStack.push({
      level,
      arr: newArr,
    });
    t.listNo = trimArrZero(newArr).join(".");
  }
  
  return navData;
}

const NAVBAR_HEIGHT = 80; // 顶部导航栏高度偏移量
const TOC_MIDDLE = 250;  // TOC 容器中间偏移，用于保持活跃条目居中

export function TutorialReader({ content, children }: TutorialReaderProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tocNavRef = React.useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = React.useState<TocHeading[]>([]);
  // headingsRef 存储最新的 headings，供 onViewerReady 回调读取（避免闭包捕获旧值）
  const headingsRef = React.useRef<TocHeading[]>([]);
  const [activeId, setActiveId] = React.useState("");

  React.useEffect(() => {
    const calculatedHeadings = getNavStructure(content || "");
    headingsRef.current = calculatedHeadings; // 同步更新 ref
    setHeadings(calculatedHeadings);
  }, [content]);

  // viewerEffect 触发时独立为每个标题生成并注入 id（与 slugify 算法一致，不依赖外部状态）
  const handleViewerReady = React.useCallback(
    (markdownBody: HTMLElement) => {
      const elements = Array.from(
        markdownBody.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6")
      );
      const usedIds = new Map<string, number>();
      elements.forEach((el) => {
        // 与 slugify 保持一致的 id 生成
        const base = slugify(el.textContent || "");
        const count = usedIds.get(base) ?? 0;
        usedIds.set(base, count + 1);
        el.id = count > 0 ? `${base}-${count}` : base;
      });
    },
    []
  );

  React.useEffect(() => {
    if (headings.length === 0) return;

    const syncActive = throttle(() => {
      const scrollY = window.scrollY + NAVBAR_HEIGHT + 20;
      let currentId = headings[0]?.id || "";

      for (const heading of headings) {
        // 直接使用 id 属性（由 handleViewerReady 注入，与 slugify 一致）
        const target = document.getElementById(heading.id);
        if (!target) continue;
        if (target.offsetTop <= scrollY) {
          currentId = heading.id;
        } else {
          break;
        }
      }

      setActiveId(currentId);

      // 同步滚动 TOC 容器，保持活跃条目处于 TOC 可视区域内（参考 MarkdownToc 实现）
      const tocNav = tocNavRef.current;
      if (tocNav) {
        const activeEl = tocNav.querySelector<HTMLElement>(".toc-item-active");
        if (activeEl) {
          const offsetTop = activeEl.offsetTop;
          tocNav.scrollTop = offsetTop > TOC_MIDDLE ? offsetTop - TOC_MIDDLE : 0;
        }
      }
    }, 200);

    syncActive();
    window.addEventListener("scroll", syncActive, { passive: true });
    window.addEventListener("resize", syncActive);

    return () => {
      window.removeEventListener("scroll", syncActive);
      window.removeEventListener("resize", syncActive);
      syncActive.cancel();
    };
  }, [headings]);

  // 参考 MarkdownNavbar.scrollToTarget：用 data-id 属性查找元素，用 offsetTop - NAVBAR_HEIGHT 给定距离滚动
  const scrollToHeading = React.useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    // window.scrollTo + offsetTop 与 MarkdownNavbar.scrollToTarget 一致
    window.scrollTo({ top: target.offsetTop - NAVBAR_HEIGHT, behavior: "smooth" });
  }, []);

  const handleTocClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      setActiveId(id);
      window.history.replaceState(null, "", `#${id}`);
      const target = document.getElementById(id);
      if (target) {
        scrollToHeading(id);
      } else {
        setTimeout(() => scrollToHeading(id), 200);
      }
    },
    [scrollToHeading]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px] xl:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
      <div
        ref={containerRef}
        className="min-w-0 space-y-10"
      >
        {children}
        <MdViewer
          value={content}
          onViewerReady={handleViewerReady}
          className="[&_h1]:mt-10 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-medium [&_p]:text-[16px] [&_p]:leading-[1.8] [&_ul]:leading-[1.8] [&_ol]:leading-[1.8]"
        />
      </div>

      {/* aside 直接 sticky，不用 self-start，确保 sticky 相对 viewport 生效 */}
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start lg:max-h-[calc(100vh-7rem)]">
        <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/40 shadow-sm backdrop-blur-md">
          <div className="p-5 pb-0">
            <div className="mb-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                On This Page
              </div>
              <div className="mt-1 text-sm font-medium text-foreground/90">
                当前文章目录
              </div>
            </div>
          </div>

          {headings.length > 0 ? (
            <nav aria-label="文章目录" className="relative">
              <div
                ref={tocNavRef}
                className="overflow-y-auto px-5 pb-5 max-h-[calc(100vh-14rem)] scrollbar-thin"
              >
                <div className="relative">
                  <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-muted/50 rounded-full" />
                  <ul className="space-y-1 text-[13px]">
                  {headings.map((heading) => {
                    const isActive = heading.id === activeId;

                    return (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          onClick={(event) => handleTocClick(event, heading.id)}
                          className={[
                            "toc-item group relative block rounded-md py-1.5 pr-3 leading-relaxed transition-all duration-200",
                            isActive ? "toc-item-active" : "",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            heading.level === 1 ? "pl-4 font-medium" : "",
                            heading.level === 2 ? "pl-4" : "",
                            heading.level >= 3 ? "pl-7" : "",
                            isActive
                              ? "font-medium text-primary"
                              : "text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full transition-all duration-300",
                              isActive ? "bg-primary" : "bg-transparent group-hover:bg-muted-foreground/30",
                            ].join(" ")}
                          />
                          <div className="flex items-baseline gap-1.5 truncate">
                            {heading.listNo && (
                              <span className="font-medium text-muted-foreground/70 shrink-0 select-none text-[11px]">
                                {heading.listNo}
                              </span>
                            )}
                            <span className="truncate">{heading.text}</span>
                          </div>
                        </a>
                      </li>
                  );
                })}
                  </ul>
                </div>
              </div>
            </nav>
          ) : (
            <div className="px-5 pb-5">
              <div className="rounded-xl bg-muted/30 px-4 py-3 text-[13px] text-muted-foreground">
                当前内容暂无可提取目录。
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
