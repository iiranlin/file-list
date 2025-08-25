# 数据管理说明

这个文件夹包含了网站所有内容的JSON数据源。每个文件对应一个内容类型，便于管理和更新。

## 文件结构

- `audio.json` - 音频文件数据
- `videos.json` - 视频文件数据  
- `images.json` - 图片文件数据
- `tutorials.json` - 教程内容数据

## 数据格式

### audio.json
```json
[
  {
    "id": 1,
    "title": "音频标题",
    "artist": "艺术家名称",
    "duration": "时长 (如: 5:23)",
    "genre": "音乐类型",
    "src": "音频文件路径",
    "description": "音频描述"
  }
]
```

### videos.json
```json
[
  {
    "id": 1,
    "title": "视频标题",
    "description": "视频描述",
    "duration": "时长 (如: 12:45)",
    "category": "视频分类",
    "thumbnail": "缩略图路径",
    "src": "视频文件路径",
    "views": "观看次数",
    "uploadDate": "上传日期 (YYYY-MM-DD)"
  }
]
```

### images.json
```json
[
  {
    "id": 1,
    "title": "图片标题",
    "description": "图片描述",
    "src": "图片文件路径",
    "category": "图片分类",
    "tags": ["标签1", "标签2"],
    "uploadDate": "上传日期 (YYYY-MM-DD)",
    "dimensions": "尺寸 (如: 1920x1080)"
  }
]
```

### tutorials.json
```json
[
  {
    "id": 1,
    "title": "教程标题",
    "excerpt": "教程摘要",
    "content": "教程完整内容 (支持Markdown格式)",
    "category": "教程分类",
    "difficulty": "难度等级 (Beginner/Intermediate/Advanced)",
    "readTime": "阅读时间 (如: 8 min read)",
    "author": "作者名称",
    "publishDate": "发布日期 (YYYY-MM-DD)",
    "tags": ["标签1", "标签2"]
  }
]
```

## 如何添加新内容

1. 打开对应的JSON文件
2. 在数组中添加新的对象
3. 确保ID是唯一的（使用递增数字）
4. 填写所有必需的字段
5. 保存文件

## 注意事项

- 所有ID必须是唯一的数字
- 日期格式统一使用 YYYY-MM-DD
- 文件路径使用相对于public目录的路径（以/开头）
- 教程内容支持Markdown格式，换行使用 \n
- 确保JSON格式正确，可以使用在线JSON验证工具检查

## 数据加载

数据通过 `src/lib/data-loader.ts` 中的函数加载：

- `loadAudioData()` - 加载音频数据
- `loadVideoData()` - 加载视频数据  
- `loadImageData()` - 加载图片数据
- `loadTutorialData()` - 加载教程数据

这些函数在页面组件中被调用，自动读取JSON文件并返回类型安全的数据。
