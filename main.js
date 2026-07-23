var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var main_exports = {};
__export(main_exports, {
  default: () => WebCardPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  defaultFormat: "callout",
  showSourceBadge: true,
  cardStyle: "modern"
};
function extractSiteName(url) {
  try {
    const u = new URL(url);
    const hostname = u.hostname.replace(/^www\./, "");
    const known = {
      "github.com": "GitHub",
      "youtube.com": "YouTube",
      "twitter.com": "X (Twitter)",
      "x.com": "X",
      "zhihu.com": "知乎",
      "bilibili.com": "B站",
      "zh.wikipedia.org": "维基百科",
      "stackoverflow.com": "Stack Overflow",
      "medium.com": "Medium",
      "juejin.cn": "掘金",
      "csdn.net": "CSDN",
      "segmentfault.com": "SegmentFault",
      "douban.com": "豆瓣",
      "weixin.qq.com": "微信公众号",
      "missing-semester-cn.github.io": "Missing Semester 中文",
      "developer.mozilla.org": "MDN"
    };
    return known[hostname] || hostname;
  } catch {
    return url;
  }
}
function generateCard(text, url, settings) {
  const siteName = extractSiteName(url);
  const formattedUrl = url || "无来源";
  const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const escapedText = text.replace(/\n{3,}/g, "\n\n").trim();
  const safeText = escapedText.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  switch (settings.defaultFormat) {
    case "callout":
      return `> [!quote]+ ${siteName}
> ${safeText.replace(/\n/g, "\n> ")}
>
> — *来源：[${siteName}](${formattedUrl})*  ·  ${date}

`;
    case "codeblock":
      return `\`\`\`card
📝 ${safeText}

🔗 [${siteName}](${formattedUrl})
📅 ${date}
\`\`\`

`;
    case "embed":
      return `---
source: "${formattedUrl}"
site: "${siteName}"
date: ${date}
---
## 📇 Web Card

> ${safeText.replace(/\n/g, "\n> ")}

---
🔗 [${siteName}](${formattedUrl}) · ${date}

`;
  }
}

// 从 URL 的 #:~:text= 片段解析高亮文本
function parseTextFragment(url) {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/:~:text=(.*?)(?:&|$)/);
  if (match) {
    try {
      return decodeURIComponent(match[1].replace(/\+/g, " "));
    } catch {
      return match[1];
    }
  }
  return null;
}

// 去除 URL 中的 #:~:text 片段，保留纯净 URL
function cleanUrl(url) {
  if (!url) return "";
  return url.replace(/#:~:text.*$/, "");
}

var CardEditModal = class extends import_obsidian.Modal {
  constructor(app, text, url, settings, onSubmit) {
    super(app);
    this.text = text;
    this.url = url;
    this.settings = settings;
    this.onSubmit = onSubmit;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("web-card-modal");
    contentEl.createEl("h2", { text: "📇 创建 Web Card" });
    contentEl.createEl("label", { text: "高亮内容" });
    const textArea = contentEl.createEl("textarea", {
      attr: {
        rows: "8",
        style: "width:100%;font-family:inherit;margin-bottom:12px;padding:8px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);resize:vertical;"
      }
    });
    textArea.value = this.text;
    contentEl.createEl("label", { text: "来源网址" });
    const urlInput = contentEl.createEl("input", {
      type: "url",
      attr: {
        style: "width:100%;margin-bottom:8px;padding:8px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);",
        placeholder: "来源网址（自动识别，可手动修改）"
      }
    });
    urlInput.value = this.url;
    const that = this;
    textArea.addEventListener("paste", function(e) {
      setTimeout(function() {
        if (e.clipboardData) {
          const html = e.clipboardData.getData("text/html");
          const text = e.clipboardData.getData("text/plain");
          if (html && !urlInput.value) {
            const m = html.match(/SourceURL:\s*(https?:\/\/[^\s<"]+)/i);
            if (m) urlInput.value = m[1];
          }
          if (!urlInput.value && text) {
            const fragText = parseTextFragment(text);
            if (fragText) {
              textArea.value = fragText;
              urlInput.value = cleanUrl(text);
            } else if (/^https?:\/\//.test(text.trim()) && !textArea.value) {
              urlInput.value = text.trim();
            }
          }
        }
      }, 50);
    });
    const preview = contentEl.createEl("div", {
      attr: {
        style: "font-size:0.85em;color:var(--text-muted);margin-bottom:16px;padding:8px;background:var(--background-secondary);border-radius:6px;"
      }
    });
    const updatePreview = () => {
      const name = extractSiteName(urlInput.value || "无");
      preview.setText(`网站名称: ${name}`);
    };
    urlInput.addEventListener("input", updatePreview);
    updatePreview();
    const btnRow = contentEl.createDiv({
      attr: { style: "display:flex;gap:8px;justify-content:flex-end;" }
    });
    const cancelBtn = btnRow.createEl("button", {
      text: "取消",
      attr: {
        style: "padding:6px 16px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-secondary);cursor:pointer;"
      }
    });
    cancelBtn.addEventListener("click", () => {
      this.onSubmit(null);
      this.close();
    });
    const confirmBtn = btnRow.createEl("button", {
      text: "✅ 插入卡片",
      attr: {
        style: "padding:6px 16px;border-radius:6px;border:none;background:var(--interactive-accent);color:var(--text-on-accent);cursor:pointer;font-weight:600;"
      }
    });
    confirmBtn.addEventListener("click", () => {
      this.onSubmit({ text: textArea.value, url: urlInput.value });
      this.close();
    });
    textArea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        confirmBtn.click();
      }
    });
    urlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        confirmBtn.click();
      }
    });
    textArea.focus();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var WebCardPlugin = class extends import_obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addCommand({
      id: "paste-as-web-card",
      name: "Paste as Web Card",
      icon: "quote",
      hotkeys: [{ modifiers: ["Mod", "Shift"], key: "V" }],
      editorCallback: async (editor) => {
        let content = "", url = "";
        try {
          const raw = await navigator.clipboard.readText();
          if (raw && raw.trim()) {
            const trimmed = raw.trim();
            const fragText = parseTextFragment(trimmed);
            if (fragText) {
              content = fragText;
              url = cleanUrl(trimmed);
            } else if (/^https?:\/\//.test(trimmed)) {
              url = trimmed;
            } else {
              content = trimmed;
            }
          }
        } catch {}
        new CardEditModal(
          this.app,
          content,
          url,
          this.settings,
          (result) => {
            if (!result) return;
            const card = generateCard(result.text, result.url, this.settings);
            editor.replaceSelection(card);
            new import_obsidian.Notice("✅ Web Card 已插入");
          }
        ).open();
      }
    });
    this.addCommand({
      id: "selection-to-web-card",
      name: "Selection to Web Card",
      icon: "highlighter",
      editorCallback: (editor) => {
        const selected = editor.getSelection();
        if (!selected || selected.trim().length === 0) {
          new import_obsidian.Notice("请先选中文本");
          return;
        }
        new CardEditModal(
          this.app,
          selected.trim(),
          "",
          this.settings,
          (result) => {
            if (!result) return;
            const card = generateCard(result.text, result.url, this.settings);
            editor.replaceSelection(card);
            new import_obsidian.Notice("✅ Web Card 已插入");
          }
        ).open();
      }
    });
    this.addSettingTab(new WebCardSettingTab(this.app, this));
    this.registerStyles();
  }
  registerStyles() {
    const style = document.createElement("style");
    style.id = "web-card-styles";
    style.textContent = ".callout[data-callout=quote]{border-left:4px solid var(--interactive-accent)!important;background:linear-gradient(135deg,var(--background-primary)0%,var(--background-secondary)100%)!important;border-radius:10px!important;box-shadow:0 2px 8px rgba(0,0,0,.08)!important}.callout[data-callout=quote] .callout-title{font-size:1.1em;font-weight:600;color:var(--interactive-accent);padding-bottom:6px;border-bottom:1px solid var(--background-modifier-border);margin-bottom:8px}.callout[data-callout=quote] .callout-content{font-size:.95em;line-height:1.7;color:var(--text-normal)}.callout[data-callout=quote] .callout-content p:last-child{margin-top:12px;padding-top:8px;border-top:1px dashed var(--background-modifier-border);font-size:.85em;color:var(--text-muted);text-align:right}pre code.language-card{background:linear-gradient(135deg,var(--background-primary)0%,var(--background-secondary)100%)!important;border-left:4px solid var(--interactive-accent);border-radius:10px;padding:16px!important;white-space:pre-wrap;font-family:var(--font-interface);font-size:.95em;line-height:1.7;color:var(--text-normal)}.web-card-modal textarea:focus,.web-card-modal input:focus{outline:2px solid var(--interactive-accent)!important;outline-offset:-1px}";
    document.head.appendChild(style);
    this.register(() => style.remove());
  }
  onunload() { document.getElementById("web-card-styles")?.remove(); }
  async loadSettings() { this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()); }
  async saveSettings() { await this.saveData(this.settings); }
};
var WebCardSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Web Card 设置" });
    containerEl.createEl("p", { text: "自定义卡片插入格式与外观样式。", attr: { style: "color:var(--text-muted);margin-bottom:20px;" } });
    new import_obsidian.Setting(containerEl).setName("默认卡片格式").setDesc("选择插入卡片时使用的 Markdown 格式").addDropdown((dd) => dd.addOption("callout", "Callout 引用块 (推荐)").addOption("codeblock", "代码块卡片").addOption("embed", "嵌入式卡片").setValue(this.plugin.settings.defaultFormat).onChange(async (val) => { this.plugin.settings.defaultFormat = val; await this.plugin.saveSettings(); }));
    new import_obsidian.Setting(containerEl).setName("来源标记").setDesc("在卡片底部显示来源网站标记").addToggle((t) => t.setValue(this.plugin.settings.showSourceBadge).onChange(async (val) => { this.plugin.settings.showSourceBadge = val; await this.plugin.saveSettings(); }));
    new import_obsidian.Setting(containerEl).setName("卡片样式").setDesc("选择卡片的视觉风格").addDropdown((dd) => dd.addOption("modern", "现代 (渐变+阴影)").addOption("minimal", "极简 (纯色+细边框)").addOption("classic", "经典 (引用线+衬线字体)").setValue(this.plugin.settings.cardStyle).onChange(async (val) => { this.plugin.settings.cardStyle = val; await this.plugin.saveSettings(); this.plugin.registerStyles(); }));
  }
};
