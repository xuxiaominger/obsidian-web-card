# Web Card — 网页高亮卡片粘贴插件 🃏

> **Slay the Highlight Game | 绝绝子的摘抄神器**

[![GitHub release](https://img.shields.io/github/v/release/xuxiaominger/obsidian-web-card)](https://github.com/xuxiaominger/obsidian-web-card/releases)
[![Obsidian plugin](https://img.shields.io/badge/Obsidian-社区插件-purple)](https://obsidian.md/plugins)

---

## 🇨🇳 中文（2026限定版 · 精神状态美丽警告）

### 家人们谁懂啊 😭

咱就是说，每次从网页复制高亮文本到 Obsidian，格式乱成一锅粥，属于是芭比Q了无语子！

**Web Card** 一整个爱住——复制网页高亮 → `Ctrl/Cmd+Shift+V` → 精美卡片自动插入，遥遥领先！

### 这波操作泰裤辣 🔥

| 操作 | 效果 | 属于是 |
|------|------|--------|
| 浏览器复制高亮 → Obsidian 粘贴 | 自动识别来源网址 | 破防级别的智能 |
| 选中文本 → 命令面板 | 直接生成信息卡片 | 绝绝子丝滑 |
| 三种卡片格式随意切换 | Callout / 代码块 / 嵌入式 | 选择困难症的福音 |

### 安装方式

1. **家人们直接社区安装**：Obsidian → 设置 → 第三方插件 → 搜索 "Web Card" → 安装 → 开启
2. **或者手动安装**：去 GitHub Releases 下载 `main.js`、`manifest.json`、`styles.css` → 扔进 `.obsidian/plugins/web-card/`

### 使用姿势

- **复制粘贴流**：网页上 `Ctrl+C` 高亮文本 → Obsidian 里 `Ctrl/Cmd+Shift+V` → 弹出编辑框 → 点击 ✅ 插入卡片
- **选中生成流**：编辑器中选中文字 → `Cmd+P` → 搜索 "Selection to Web Card" → 填写来源网址 → 确认
- **快捷键**：`Ctrl/Cmd + Shift + V` 粘贴为卡片 | `Ctrl/Cmd + Enter` 快速确认

### 设置面板

在 Obsidian 设置 → Web Card 里可以：
- 🎨 切换卡片格式：Callout 引用块 / 代码块卡片 / 嵌入式卡片
- 🏷️ 开启/关闭底部来源标记
- 👗 选择视觉风格：现代（渐变+阴影）/ 极简（纯色）/ 经典（引用线+衬线）

### 卡片效果

```
> [!quote] 来源网站名
> 你复制的高亮文本内容在这里
> 整段都会显示在卡片上方
>
> — *来源：[网页标题](https://example.com)* · 2025-07-22
```

---

## 🇺🇸 English (No Cap · 2026 Internet Slang Edition)

### Main Character Energy 💅

fr fr, copying web highlights into Obsidian was giving **main character trying to format stuff manually** energy — that's a massive L.

**Web Card** out here catching W's left and right. Copy a highlight from your browser → hit `Ctrl/Cmd+Shift+V` in Obsidian → bam, a **slay** card appears with the full text AND the source URL auto-detected. No cap, it's giving GOAT behavior.

### What's the Vibe? 🔥

| Move | Result | Based? |
|------|--------|--------|
| Copy highlight from browser → Paste in Obsidian | Auto-detects source URL | Absolutely based |
| Select text in editor → Run command | Generates card on the spot | Bussin' fr fr |
| Switch between 3 card formats | Callout / Code Block / Embed | Choice is yours, king |

### How to Cop (Install)

1. **Community plugin gang**: Obsidian → Settings → Community plugins → Search "Web Card" → Install → Enable
2. **Manual install squad**: Download `main.js`, `manifest.json`, `styles.css` from GitHub Releases → drop into `.obsidian/plugins/web-card/`

### How to Flex (Usage)

- **Copy-Paste Flow**: `Ctrl+C` highlight on web page → `Ctrl/Cmd+Shift+V` in Obsidian → edit dialog pops up → Click ✅ Insert Card
- **Selection Flow**: Select text in editor → `Cmd+P` → search "Selection to Web Card" → paste source URL → confirm
- **Hotkeys**: `Ctrl/Cmd + Shift + V` paste as card | `Ctrl/Cmd + Enter` quick confirm

### Settings (Customize Your RIZZ)

In Obsidian Settings → Web Card you can:
- 🎨 Switch card format: Callout / Code Block / Embed
- 🏷️ Toggle source badge on/off
- 👗 Visual style: Modern (gradient+shadow) / Minimal (flat) / Classic (serif+line)

---

## Tech Specs (for the Based Devs)

| Field | Value |
|-------|-------|
| Plugin ID | `web-card` |
| Min Obsidian Version | 0.15.0 |
| Desktop Only | ❌ No (mobile compatible) |
| Browser Support | ✅ Chrome/Edge/Firefox/Safari |
| Built With | TypeScript + esbuild |

The plugin auto-extracts the source URL from clipboard HTML data (Chrome/Edge: `SourceURL` in HTML, Firefox: `text/uri-list`, Safari: plain text regex fallback).

---

## Dev / Contributing

```bash
git clone https://github.com/xuxiaominger/obsidian-web-card.git
cd obsidian-web-card
npm install
npm run build    # builds main.js
npm run dev      # watch mode
```

### File Structure

```
obsidian-web-card/
├── manifest.json    # Plugin metadata
├── main.js          # Compiled plugin (built output)
├── main.ts          # TypeScript source
├── styles.css       # Card styling
├── versions.json    # Version compatibility
```

---

## License

MIT — do whatever, just give credit. No cap.

---

*Made with 💜 and way too much internet slang by Hermes*
*精神稳定出品 · 家人们冲就完了*
