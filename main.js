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

// main.ts
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
      "zhihu.com": "\u77E5\u4E4E",
      "bilibili.com": "B\u7AD9",
      "zh.wikipedia.org": "\u7EF4\u57FA\u767E\u79D1",
      "stackoverflow.com": "Stack Overflow",
      "medium.com": "Medium",
      "juejin.cn": "\u6398\u91D1",
      "csdn.net": "CSDN",
      "segmentfault.com": "SegmentFault",
      "douban.com": "\u8C46\u74E3",
      "weixin.qq.com": "\u5FAE\u4FE1\u516C\u4F17\u53F7",
      "missing-semester-cn.github.io": "Missing Semester \u4E2D\u6587",
      "developer.mozilla.org": "MDN"
    };
    return known[hostname] || hostname;
  } catch {
    return url;
  }
}
function generateCard(text, url, settings) {
  const siteName = extractSiteName(url);
  const formattedUrl = url || "\u65E0\u6765\u6E90";
  const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const escapedText = text.replace(/\n{3,}/g, "\n\n").trim();
  const safeText = escapedText.replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  switch (settings.defaultFormat) {
    case "callout":
      return `> [!quote]+ ${siteName}
> ${safeText.replace(/\n/g, "\n> ")}
>
> \u2014 *\u6765\u6E90\uFF1A[${siteName}](${formattedUrl})*  \xB7  ${date}

`;
    case "codeblock":
      return `\`\`\`card
\u{1F4DD} ${safeText}

\u{1F517} [${siteName}](${formattedUrl})
\u{1F4C5} ${date}
\`\`\`

`;
    case "embed":
      return `---
source: "${formattedUrl}"
site: "${siteName}"
date: ${date}
---
## \u{1F4C7} Web Card

> ${safeText.replace(/\n/g, "\n> ")}

---
\u{1F517} [${siteName}](${formattedUrl}) \xB7 ${date}

`;
  }
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
    contentEl.createEl("h2", { text: "\u{1F4C7} \u521B\u5EFA Web Card" });
    contentEl.createEl("label", { text: "\u9AD8\u4EAE\u5185\u5BB9" });
    const textArea = contentEl.createEl("textarea", {
      attr: {
        rows: "8",
        style: "width:100%;font-family:inherit;margin-bottom:12px;padding:8px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);resize:vertical;"
      }
    });
    textArea.value = this.text;
    contentEl.createEl("label", { text: "\u6765\u6E90\u7F51\u5740" });
    const urlInput = contentEl.createEl("input", {
      type: "url",
      attr: {
        style: "width:100%;margin-bottom:8px;padding:8px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-primary);color:var(--text-normal);"
      }
    });
    urlInput.value = this.url;
    const preview = contentEl.createEl("div", {
      attr: {
        style: "font-size:0.85em;color:var(--text-muted);margin-bottom:16px;padding:8px;background:var(--background-secondary);border-radius:6px;"
      }
    });
    const updatePreview = () => {
      const name = extractSiteName(urlInput.value || "\u65E0");
      preview.setText(`\u7F51\u7AD9\u540D\u79F0: ${name}`);
    };
    urlInput.addEventListener("input", updatePreview);
    updatePreview();
    const btnRow = contentEl.createDiv({
      attr: { style: "display:flex;gap:8px;justify-content:flex-end;" }
    });
    const cancelBtn = btnRow.createEl("button", {
      text: "\u53D6\u6D88",
      attr: {
        style: "padding:6px 16px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-secondary);cursor:pointer;"
      }
    });
    cancelBtn.addEventListener("click", () => {
      this.onSubmit(null);
      this.close();
    });
    const confirmBtn = btnRow.createEl("button", {
      text: "\u2705 \u63D2\u5165\u5361\u7247",
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
        let content = "";
        let url = "";
        try {
          const electron = window.require ? window.require("electron") : null;
          if (electron && electron.clipboard) {
            const html = electron.clipboard.readHTML();
            const plainText = electron.clipboard.readText();
            if (html) {
              const urlMatch = html.match(/SourceURL:\s*(https?:\/\/[^\s<"]+)/i);
              if (urlMatch) url = urlMatch[1];
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, "text/html");
              const bodyText = doc.body?.textContent?.trim() || "";
              if (bodyText.length > 0) content = bodyText;
            }
            if (!content && plainText && !/^https?:\/\//.test(plainText.trim())) {
              content = plainText;
            }
          }
        } catch {
        }
        if (!content) {
          try {
            const clipboardItems = await navigator.clipboard.read();
            for (const item of clipboardItems) {
              if (item.types.includes("text/html")) {
                const blob = item.getType("text/html");
                const html2 = await (await blob).text();
                const urlMatch2 = html2.match(/SourceURL:\s*(https?:\/\/[^\s<"]+)/i);
                if (urlMatch2 && !url) url = urlMatch2[1];
                if (!content) {
                  const parser2 = new DOMParser();
                  const doc2 = parser2.parseFromString(html2, "text/html");
                  const bodyText2 = doc2.body?.textContent?.trim() || "";
                  if (bodyText2.length > 0) content = bodyText2;
                }
              }
              if (!url && item.types.includes("text/uri-list")) {
                const blob3 = item.getType("text/uri-list");
                const uriList = await (await blob3).text();
                if (uriList.trim()) url = uriList.trim().split("\n")[0];
              }
            }
          } catch {
          }
        }
        if (!content) {
          const fallbackText = await navigator.clipboard.readText();
          if (fallbackText && !/^https?:\/\//.test(fallbackText.trim())) {
            content = fallbackText;
          }
        }
        if (!content || content.trim().length === 0) {
          new import_obsidian.Notice("剪贴板为空");
          return;
        }
        new CardEditModal(
          this.app,
          content.trim(),
          url,
          this.settings,
          (result) => {
            if (!result) return;
            const card = generateCard(
              result.text,
              result.url,
              this.settings
            );
            editor.replaceSelection(card);
            new import_obsidian.Notice("\u2705 Web Card \u5DF2\u63D2\u5165");
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
          new import_obsidian.Notice("\u8BF7\u5148\u9009\u4E2D\u6587\u672C");
          return;
        }
        new CardEditModal(
          this.app,
          selected.trim(),
          "",
          this.settings,
          (result) => {
            if (!result) return;
            const card = generateCard(
              result.text,
              result.url,
              this.settings
            );
            editor.replaceSelection(card);
            new import_obsidian.Notice("\u2705 Web Card \u5DF2\u63D2\u5165");
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
    style.textContent = `
			/* Callout \u5361\u7247\u589E\u5F3A */
			.callout[data-callout="quote"] {
				border-left: 4px solid var(--interactive-accent) !important;
				background: linear-gradient(
					135deg,
					var(--background-primary) 0%,
					var(--background-secondary) 100%
				) !important;
				border-radius: 10px !important;
				box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
			}

			.callout[data-callout="quote"] .callout-title {
				font-size: 1.1em;
				font-weight: 600;
				color: var(--interactive-accent);
				padding-bottom: 6px;
				border-bottom: 1px solid var(--background-modifier-border);
				margin-bottom: 8px;
			}

			.callout[data-callout="quote"] .callout-content {
				font-size: 0.95em;
				line-height: 1.7;
				color: var(--text-normal);
			}

			.callout[data-callout="quote"] .callout-content p:last-child {
				margin-top: 12px;
				padding-top: 8px;
				border-top: 1px dashed var(--background-modifier-border);
				font-size: 0.85em;
				color: var(--text-muted);
				text-align: right;
			}

			/* \u4EE3\u7801\u5757\u5361\u7247 */
			pre code.language-card {
				background: linear-gradient(
					135deg,
					var(--background-primary) 0%,
					var(--background-secondary) 100%
				) !important;
				border-left: 4px solid var(--interactive-accent);
				border-radius: 10px;
				padding: 16px !important;
				white-space: pre-wrap;
				font-family: var(--font-interface);
				font-size: 0.95em;
				line-height: 1.7;
				color: var(--text-normal);
			}

			/* \u7F16\u8F91\u6A21\u6001\u6846 */
			.web-card-modal textarea:focus,
			.web-card-modal input:focus {
				outline: 2px solid var(--interactive-accent) !important;
				outline-offset: -1px;
			}
		`;
    document.head.appendChild(style);
    this.register(() => style.remove());
  }
  onunload() {
    document.getElementById("web-card-styles")?.remove();
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var WebCardSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Web Card \u8BBE\u7F6E" });
    containerEl.createEl("p", {
      text: "\u81EA\u5B9A\u4E49\u5361\u7247\u63D2\u5165\u683C\u5F0F\u4E0E\u5916\u89C2\u6837\u5F0F\u3002",
      attr: { style: "color:var(--text-muted);margin-bottom:20px;" }
    });
    new import_obsidian.Setting(containerEl).setName("\u9ED8\u8BA4\u5361\u7247\u683C\u5F0F").setDesc("\u9009\u62E9\u63D2\u5165\u5361\u7247\u65F6\u4F7F\u7528\u7684 Markdown \u683C\u5F0F").addDropdown(
      (dd) => dd.addOption("callout", "Callout \u5F15\u7528\u5757 (\u63A8\u8350)").addOption("codeblock", "\u4EE3\u7801\u5757\u5361\u7247").addOption("embed", "\u5D4C\u5165\u5F0F\u5361\u7247").setValue(this.plugin.settings.defaultFormat).onChange(async (val) => {
        this.plugin.settings.defaultFormat = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u6765\u6E90\u6807\u8BB0").setDesc("\u5728\u5361\u7247\u5E95\u90E8\u663E\u793A\u6765\u6E90\u7F51\u7AD9\u6807\u8BB0").addToggle(
      (t) => t.setValue(this.plugin.settings.showSourceBadge).onChange(async (val) => {
        this.plugin.settings.showSourceBadge = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u5361\u7247\u6837\u5F0F").setDesc("\u9009\u62E9\u5361\u7247\u7684\u89C6\u89C9\u98CE\u683C").addDropdown(
      (dd) => dd.addOption("modern", "\u73B0\u4EE3 (\u6E10\u53D8+\u9634\u5F71)").addOption("minimal", "\u6781\u7B80 (\u7EAF\u8272+\u7EC6\u8FB9\u6846)").addOption("classic", "\u7ECF\u5178 (\u5F15\u7528\u7EBF+\u886C\u7EBF\u5B57\u4F53)").setValue(this.plugin.settings.cardStyle).onChange(async (val) => {
        this.plugin.settings.cardStyle = val;
        await this.plugin.saveSettings();
        this.plugin.registerStyles();
      })
    );
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgQXBwLCBQbHVnaW4sIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIEl0ZW1WaWV3LCBXb3Jrc3BhY2VMZWFmLCBOb3RpY2UsIE1vZGFsLCBURmlsZSwgcGFyc2VZYW1sLCBzdHJpbmdpZnlZYW1sIH0gZnJvbSAnb2JzaWRpYW4nO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDAgXHU4QkJFXHU3RjZFIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuaW50ZXJmYWNlIFdlYkNhcmRTZXR0aW5ncyB7XG5cdGRlZmF1bHRGb3JtYXQ6ICdjYWxsb3V0JyB8ICdjb2RlYmxvY2snIHwgJ2VtYmVkJztcblx0c2hvd1NvdXJjZUJhZGdlOiBib29sZWFuO1xuXHRjYXJkU3R5bGU6ICdtb2Rlcm4nIHwgJ21pbmltYWwnIHwgJ2NsYXNzaWMnO1xufVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTOiBXZWJDYXJkU2V0dGluZ3MgPSB7XG5cdGRlZmF1bHRGb3JtYXQ6ICdjYWxsb3V0Jyxcblx0c2hvd1NvdXJjZUJhZGdlOiB0cnVlLFxuXHRjYXJkU3R5bGU6ICdtb2Rlcm4nLFxufTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFx1NEVDRVx1NTI2QVx1OEQzNFx1Njc3Rlx1ODNCN1x1NTNENiBVUkwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5mdW5jdGlvbiBnZXRDbGlwYm9hcmRVcmwoY2xpcGJvYXJkRGF0YTogRGF0YVRyYW5zZmVyIHwgbnVsbCk6IHN0cmluZyB8IG51bGwge1xuXHRpZiAoIWNsaXBib2FyZERhdGEpIHJldHVybiBudWxsO1xuXG5cdC8vIFx1NjVCOVx1NkNENSAxOiBDaHJvbWUvRWRnZSBcdTU3MjggdGV4dC9odG1sIFx1NEUyRFx1NTE4NVx1NUQ0Q1x1NEU4NiBTb3VyY2VVUkxcblx0Y29uc3QgaHRtbCA9IGNsaXBib2FyZERhdGEuZ2V0RGF0YSgndGV4dC9odG1sJyk7XG5cdGlmIChodG1sKSB7XG5cdFx0Y29uc3QgbWF0Y2ggPSBodG1sLm1hdGNoKC9Tb3VyY2VVUkw6XFxzKihodHRwcz86XFwvXFwvW15cXHM8XCJdKykvaSk7XG5cdFx0aWYgKG1hdGNoKSByZXR1cm4gbWF0Y2hbMV07XG5cdFx0Ly8gXHU2NzA5XHU0RTlCXHU2RDRGXHU4OUM4XHU1NjY4XHU1NzI4IEhUTUwgXHU2Q0U4XHU5MUNBXHU0RTJEXHU2NTNFIFVSTFxuXHRcdGNvbnN0IGNvbW1lbnRNYXRjaCA9IGh0bWwubWF0Y2goLzwhLS1cXHMqKGh0dHBzPzpcXC9cXC9bXlxccz5dKylcXHMqLS0+L2kpO1xuXHRcdGlmIChjb21tZW50TWF0Y2gpIHJldHVybiBjb21tZW50TWF0Y2hbMV07XG5cdH1cblxuXHQvLyBcdTY1QjlcdTZDRDUgMjogU2FmYXJpIC8gRmlyZWZveCBcdTUzRUZcdTgwRkRcdTU3MjggdGV4dC9wbGFpbiBcdTRFMkRcdTVFMjYgVVJMXG5cdGNvbnN0IHRleHQgPSBjbGlwYm9hcmREYXRhLmdldERhdGEoJ3RleHQvcGxhaW4nKTtcblx0aWYgKHRleHQpIHtcblx0XHQvLyBcdTU5ODJcdTY3OUNcdTdFQUZcdTY1ODdcdTY3MkNcdTY3MkNcdThFQUJcdTVDMzFcdTY2MkYgVVJMXG5cdFx0aWYgKC9eaHR0cHM/OlxcL1xcL1teXFxzXSskLy50ZXN0KHRleHQudHJpbSgpKSkgcmV0dXJuIHRleHQudHJpbSgpO1xuXHRcdC8vIFx1NjdFNVx1NjI3RVx1NjU4N1x1NjcyQ1x1NjcyQlx1NUMzRVx1NjIxNlx1NUYwMFx1NTkzNFx1NzY4NCBVUkxcblx0XHRjb25zdCB1cmxNYXRjaCA9IHRleHQubWF0Y2goLyhodHRwcz86XFwvXFwvW15cXHNcXG5dKykvKTtcblx0XHRpZiAodXJsTWF0Y2gpIHJldHVybiB1cmxNYXRjaFsxXTtcblx0fVxuXG5cdC8vIFx1NjVCOVx1NkNENSAzOiBFbGVjdHJvbiBcdTcyNzlcdTY3MDkgKE9ic2lkaWFuIERlc2t0b3ApXG5cdHRyeSB7XG5cdFx0Y29uc3QgZWxlY3Ryb24gPSAod2luZG93IGFzIGFueSkucmVxdWlyZT8uKCdlbGVjdHJvbicpO1xuXHRcdGlmIChlbGVjdHJvbj8uY2xpcGJvYXJkKSB7XG5cdFx0XHQvLyBcdTY3MDlcdTRFOUJcdTVFOTRcdTc1MjhcdTRGMUFcdTYyOEEgVVJMIFx1NjUzRVx1NTcyOFx1OTg5RFx1NTkxNlx1NzY4NFx1NjgzQ1x1NUYwRlx1OTFDQ1xuXHRcdFx0Y29uc3QgdXJsTGlzdCA9IChjbGlwYm9hcmREYXRhIGFzIGFueSkuZ2V0RGF0YSgndGV4dC91cmktbGlzdCcpO1xuXHRcdFx0aWYgKHVybExpc3QpIHJldHVybiB1cmxMaXN0LnRyaW0oKTtcblx0XHR9XG5cdH0gY2F0Y2gge31cblxuXHRyZXR1cm4gbnVsbDtcbn1cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFx1NEVDRSBVUkwgXHU2M0QwXHU1M0Q2XHU3RjUxXHU3QUQ5XHU1NDBEXHU3OUYwIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuZnVuY3Rpb24gZXh0cmFjdFNpdGVOYW1lKHVybDogc3RyaW5nKTogc3RyaW5nIHtcblx0dHJ5IHtcblx0XHRjb25zdCB1ID0gbmV3IFVSTCh1cmwpO1xuXHRcdGNvbnN0IGhvc3RuYW1lID0gdS5ob3N0bmFtZS5yZXBsYWNlKC9ed3d3XFwuLywgJycpO1xuXHRcdC8vIFx1NUUzOFx1ODlDMVx1N0FEOVx1NzBCOVx1NjYyMFx1NUMwNFx1NzdFRFx1NTQwRFx1NzlGMFxuXHRcdGNvbnN0IGtub3duOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuXHRcdFx0J2dpdGh1Yi5jb20nOiAnR2l0SHViJyxcblx0XHRcdCd5b3V0dWJlLmNvbSc6ICdZb3VUdWJlJyxcblx0XHRcdCd0d2l0dGVyLmNvbSc6ICdYIChUd2l0dGVyKScsXG5cdFx0XHQneC5jb20nOiAnWCcsXG5cdFx0XHQnemhpaHUuY29tJzogJ1x1NzdFNVx1NEU0RScsXG5cdFx0XHQnYmlsaWJpbGkuY29tJzogJ0JcdTdBRDknLFxuXHRcdFx0J3poLndpa2lwZWRpYS5vcmcnOiAnXHU3RUY0XHU1N0ZBXHU3NjdFXHU3OUQxJyxcblx0XHRcdCdzdGFja292ZXJmbG93LmNvbSc6ICdTdGFjayBPdmVyZmxvdycsXG5cdFx0XHQnbWVkaXVtLmNvbSc6ICdNZWRpdW0nLFxuXHRcdFx0J2p1ZWppbi5jbic6ICdcdTYzOThcdTkxRDEnLFxuXHRcdFx0J2NzZG4ubmV0JzogJ0NTRE4nLFxuXHRcdFx0J3NlZ21lbnRmYXVsdC5jb20nOiAnU2VnbWVudEZhdWx0Jyxcblx0XHRcdCdkb3ViYW4uY29tJzogJ1x1OEM0Nlx1NzRFMycsXG5cdFx0XHQnd2VpeGluLnFxLmNvbSc6ICdcdTVGQUVcdTRGRTFcdTUxNkNcdTRGMTdcdTUzRjcnLFxuXHRcdFx0J21pc3Npbmctc2VtZXN0ZXItY24uZ2l0aHViLmlvJzogJ01pc3NpbmcgU2VtZXN0ZXIgXHU0RTJEXHU2NTg3Jyxcblx0XHRcdCdkZXZlbG9wZXIubW96aWxsYS5vcmcnOiAnTUROJyxcblx0XHR9O1xuXHRcdHJldHVybiBrbm93bltob3N0bmFtZV0gfHwgaG9zdG5hbWU7XG5cdH0gY2F0Y2gge1xuXHRcdHJldHVybiB1cmw7XG5cdH1cbn1cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwIFx1NzUxRlx1NjIxMFx1NTM2MVx1NzI0NyBNYXJrZG93biBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmZ1bmN0aW9uIGdlbmVyYXRlQ2FyZChcblx0dGV4dDogc3RyaW5nLFxuXHR1cmw6IHN0cmluZyxcblx0c2V0dGluZ3M6IFdlYkNhcmRTZXR0aW5ncyxcbik6IHN0cmluZyB7XG5cdGNvbnN0IHNpdGVOYW1lID0gZXh0cmFjdFNpdGVOYW1lKHVybCk7XG5cdGNvbnN0IGZvcm1hdHRlZFVybCA9IHVybCB8fCAnXHU2NUUwXHU2NzY1XHU2RTkwJztcblx0Y29uc3QgZGF0ZSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG5cdGNvbnN0IGVzY2FwZWRUZXh0ID0gdGV4dC5yZXBsYWNlKC9cXG57Myx9L2csICdcXG5cXG4nKS50cmltKCk7XG5cblx0Ly8gXHU4RjZDXHU0RTQ5IE9ic2lkaWFuIFx1NzI3OVx1NkI4QVx1NUI1N1x1N0IyNlxuXHRjb25zdCBzYWZlVGV4dCA9IGVzY2FwZWRUZXh0XG5cdFx0LnJlcGxhY2UoL1xcWy9nLCAnXFxcXFsnKVxuXHRcdC5yZXBsYWNlKC9cXF0vZywgJ1xcXFxdJylcblx0XHQucmVwbGFjZSgvXFwoL2csICdcXFxcKCcpXG5cdFx0LnJlcGxhY2UoL1xcKS9nLCAnXFxcXCknKTtcblxuXHRzd2l0Y2ggKHNldHRpbmdzLmRlZmF1bHRGb3JtYXQpIHtcblx0XHRjYXNlICdjYWxsb3V0Jzpcblx0XHRcdHJldHVybiBgPiBbIXF1b3RlXSsgJHtzaXRlTmFtZX1cbj4gJHtzYWZlVGV4dC5yZXBsYWNlKC9cXG4vZywgJ1xcbj4gJyl9XG4+XG4+IFx1MjAxNCAqXHU2NzY1XHU2RTkwXHVGRjFBWyR7c2l0ZU5hbWV9XSgke2Zvcm1hdHRlZFVybH0pKiAgXHUwMEI3ICAke2RhdGV9XG5cbmA7XG5cdFx0Y2FzZSAnY29kZWJsb2NrJzpcblx0XHRcdHJldHVybiBgXFxgXFxgXFxgY2FyZFxuXHVEODNEXHVEQ0REICR7c2FmZVRleHR9XG5cblx1RDgzRFx1REQxNyBbJHtzaXRlTmFtZX1dKCR7Zm9ybWF0dGVkVXJsfSlcblx1RDgzRFx1RENDNSAke2RhdGV9XG5cXGBcXGBcXGBcblxuYDtcblx0XHRjYXNlICdlbWJlZCc6XG5cdFx0XHRyZXR1cm4gYC0tLVxuc291cmNlOiBcIiR7Zm9ybWF0dGVkVXJsfVwiXG5zaXRlOiBcIiR7c2l0ZU5hbWV9XCJcbmRhdGU6ICR7ZGF0ZX1cbi0tLVxuIyMgXHVEODNEXHVEQ0M3IFdlYiBDYXJkXG5cbj4gJHtzYWZlVGV4dC5yZXBsYWNlKC9cXG4vZywgJ1xcbj4gJyl9XG5cbi0tLVxuXHVEODNEXHVERDE3IFske3NpdGVOYW1lfV0oJHtmb3JtYXR0ZWRVcmx9KSBcdTAwQjcgJHtkYXRlfVxuXG5gO1xuXHR9XG59XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBcdTUzNjFcdTcyNDdcdTdGMTZcdThGOTFcdTVCRjlcdThCRERcdTY4NDYgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jbGFzcyBDYXJkRWRpdE1vZGFsIGV4dGVuZHMgTW9kYWwge1xuXHR0ZXh0OiBzdHJpbmc7XG5cdHVybDogc3RyaW5nO1xuXHRzZXR0aW5nczogV2ViQ2FyZFNldHRpbmdzO1xuXHRvblN1Ym1pdDogKHJlc3VsdDogeyB0ZXh0OiBzdHJpbmc7IHVybDogc3RyaW5nIH0gfCBudWxsKSA9PiB2b2lkO1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdGFwcDogQXBwLFxuXHRcdHRleHQ6IHN0cmluZyxcblx0XHR1cmw6IHN0cmluZyxcblx0XHRzZXR0aW5nczogV2ViQ2FyZFNldHRpbmdzLFxuXHRcdG9uU3VibWl0OiAocmVzdWx0OiB7IHRleHQ6IHN0cmluZzsgdXJsOiBzdHJpbmcgfSB8IG51bGwpID0+IHZvaWQsXG5cdCkge1xuXHRcdHN1cGVyKGFwcCk7XG5cdFx0dGhpcy50ZXh0ID0gdGV4dDtcblx0XHR0aGlzLnVybCA9IHVybDtcblx0XHR0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG5cdFx0dGhpcy5vblN1Ym1pdCA9IG9uU3VibWl0O1xuXHR9XG5cblx0b25PcGVuKCkge1xuXHRcdGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuXHRcdGNvbnRlbnRFbC5lbXB0eSgpO1xuXHRcdGNvbnRlbnRFbC5hZGRDbGFzcygnd2ViLWNhcmQtbW9kYWwnKTtcblxuXHRcdGNvbnRlbnRFbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdcdUQ4M0RcdURDQzcgXHU1MjFCXHU1RUZBIFdlYiBDYXJkJyB9KTtcblxuXHRcdC8vIFx1NjU4N1x1NjcyQ1x1NTMzQVxuXHRcdGNvbnRlbnRFbC5jcmVhdGVFbCgnbGFiZWwnLCB7IHRleHQ6ICdcdTlBRDhcdTRFQUVcdTUxODVcdTVCQjknIH0pO1xuXHRcdGNvbnN0IHRleHRBcmVhID0gY29udGVudEVsLmNyZWF0ZUVsKCd0ZXh0YXJlYScsIHtcblx0XHRcdGF0dHI6IHtcblx0XHRcdFx0cm93czogJzgnLFxuXHRcdFx0XHRzdHlsZTogJ3dpZHRoOjEwMCU7Zm9udC1mYW1pbHk6aW5oZXJpdDttYXJnaW4tYm90dG9tOjEycHg7cGFkZGluZzo4cHg7Ym9yZGVyLXJhZGl1czo2cHg7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1iYWNrZ3JvdW5kLW1vZGlmaWVyLWJvcmRlcik7YmFja2dyb3VuZDp2YXIoLS1iYWNrZ3JvdW5kLXByaW1hcnkpO2NvbG9yOnZhcigtLXRleHQtbm9ybWFsKTtyZXNpemU6dmVydGljYWw7Jyxcblx0XHRcdH0sXG5cdFx0fSk7XG5cdFx0dGV4dEFyZWEudmFsdWUgPSB0aGlzLnRleHQ7XG5cblx0XHQvLyBVUkxcblx0XHRjb250ZW50RWwuY3JlYXRlRWwoJ2xhYmVsJywgeyB0ZXh0OiAnXHU2NzY1XHU2RTkwXHU3RjUxXHU1NzQwJyB9KTtcblx0XHRjb25zdCB1cmxJbnB1dCA9IGNvbnRlbnRFbC5jcmVhdGVFbCgnaW5wdXQnLCB7XG5cdFx0XHR0eXBlOiAndXJsJyxcblx0XHRcdGF0dHI6IHtcblx0XHRcdFx0c3R5bGU6XG5cdFx0XHRcdFx0J3dpZHRoOjEwMCU7bWFyZ2luLWJvdHRvbTo4cHg7cGFkZGluZzo4cHg7Ym9yZGVyLXJhZGl1czo2cHg7Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS1iYWNrZ3JvdW5kLW1vZGlmaWVyLWJvcmRlcik7YmFja2dyb3VuZDp2YXIoLS1iYWNrZ3JvdW5kLXByaW1hcnkpO2NvbG9yOnZhcigtLXRleHQtbm9ybWFsKTsnLFxuXHRcdFx0fSxcblx0XHR9KTtcblx0XHR1cmxJbnB1dC52YWx1ZSA9IHRoaXMudXJsO1xuXG5cdFx0Ly8gXHU4MUVBXHU1MkE4XHU4M0I3XHU1M0Q2XHU3RjUxXHU3QUQ5XHU1NDBEXHU3OUYwXHU5ODg0XHU4OUM4XG5cdFx0Y29uc3QgcHJldmlldyA9IGNvbnRlbnRFbC5jcmVhdGVFbCgnZGl2Jywge1xuXHRcdFx0YXR0cjoge1xuXHRcdFx0XHRzdHlsZTpcblx0XHRcdFx0XHQnZm9udC1zaXplOjAuODVlbTtjb2xvcjp2YXIoLS10ZXh0LW11dGVkKTttYXJnaW4tYm90dG9tOjE2cHg7cGFkZGluZzo4cHg7YmFja2dyb3VuZDp2YXIoLS1iYWNrZ3JvdW5kLXNlY29uZGFyeSk7Ym9yZGVyLXJhZGl1czo2cHg7Jyxcblx0XHRcdH0sXG5cdFx0fSk7XG5cdFx0Y29uc3QgdXBkYXRlUHJldmlldyA9ICgpID0+IHtcblx0XHRcdGNvbnN0IG5hbWUgPSBleHRyYWN0U2l0ZU5hbWUodXJsSW5wdXQudmFsdWUgfHwgJ1x1NjVFMCcpO1xuXHRcdFx0cHJldmlldy5zZXRUZXh0KGBcdTdGNTFcdTdBRDlcdTU0MERcdTc5RjA6ICR7bmFtZX1gKTtcblx0XHR9O1xuXHRcdHVybElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdXBkYXRlUHJldmlldyk7XG5cdFx0dXBkYXRlUHJldmlldygpO1xuXG5cdFx0Ly8gXHU2MzA5XHU5NEFFXG5cdFx0Y29uc3QgYnRuUm93ID0gY29udGVudEVsLmNyZWF0ZURpdih7XG5cdFx0XHRhdHRyOiB7IHN0eWxlOiAnZGlzcGxheTpmbGV4O2dhcDo4cHg7anVzdGlmeS1jb250ZW50OmZsZXgtZW5kOycgfSxcblx0XHR9KTtcblxuXHRcdGNvbnN0IGNhbmNlbEJ0biA9IGJ0blJvdy5jcmVhdGVFbCgnYnV0dG9uJywge1xuXHRcdFx0dGV4dDogJ1x1NTNENlx1NkQ4OCcsXG5cdFx0XHRhdHRyOiB7XG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdCdwYWRkaW5nOjZweCAxNnB4O2JvcmRlci1yYWRpdXM6NnB4O2JvcmRlcjoxcHggc29saWQgdmFyKC0tYmFja2dyb3VuZC1tb2RpZmllci1ib3JkZXIpO2JhY2tncm91bmQ6dmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnkpO2N1cnNvcjpwb2ludGVyOycsXG5cdFx0XHR9LFxuXHRcdH0pO1xuXHRcdGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHRoaXMub25TdWJtaXQobnVsbCk7XG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fSk7XG5cblx0XHRjb25zdCBjb25maXJtQnRuID0gYnRuUm93LmNyZWF0ZUVsKCdidXR0b24nLCB7XG5cdFx0XHR0ZXh0OiAnXHUyNzA1IFx1NjNEMlx1NTE2NVx1NTM2MVx1NzI0NycsXG5cdFx0XHRhdHRyOiB7XG5cdFx0XHRcdHN0eWxlOlxuXHRcdFx0XHRcdCdwYWRkaW5nOjZweCAxNnB4O2JvcmRlci1yYWRpdXM6NnB4O2JvcmRlcjpub25lO2JhY2tncm91bmQ6dmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KTtjb2xvcjp2YXIoLS10ZXh0LW9uLWFjY2VudCk7Y3Vyc29yOnBvaW50ZXI7Zm9udC13ZWlnaHQ6NjAwOycsXG5cdFx0XHR9LFxuXHRcdH0pO1xuXHRcdGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHR0aGlzLm9uU3VibWl0KHsgdGV4dDogdGV4dEFyZWEudmFsdWUsIHVybDogdXJsSW5wdXQudmFsdWUgfSk7XG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fSk7XG5cblx0XHQvLyBcdTVGRUJcdTYzNzdcdTk1MkVcblx0XHR0ZXh0QXJlYS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcblx0XHRcdGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAoZS5jdHJsS2V5IHx8IGUubWV0YUtleSkpIHtcblx0XHRcdFx0Y29uZmlybUJ0bi5jbGljaygpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHVybElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuXHRcdFx0aWYgKGUua2V5ID09PSAnRW50ZXInICYmIChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5KSkge1xuXHRcdFx0XHRjb25maXJtQnRuLmNsaWNrKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0ZXh0QXJlYS5mb2N1cygpO1xuXHR9XG5cblx0b25DbG9zZSgpIHtcblx0XHR0aGlzLmNvbnRlbnRFbC5lbXB0eSgpO1xuXHR9XG59XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBcdTRFM0JcdTYzRDJcdTRFRjYgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJDYXJkUGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcblx0c2V0dGluZ3M6IFdlYkNhcmRTZXR0aW5ncztcblxuXHRhc3luYyBvbmxvYWQoKSB7XG5cdFx0YXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcblxuXHRcdC8vIFx1MjUwMFx1MjUwMCBcdTU0N0RcdTRFRTQ6IFx1N0M5OFx1OEQzNFx1NEUzQSBXZWIgQ2FyZCBcdTI1MDBcdTI1MDBcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xuXHRcdFx0aWQ6ICdwYXN0ZS1hcy13ZWItY2FyZCcsXG5cdFx0XHRuYW1lOiAnUGFzdGUgYXMgV2ViIENhcmQnLFxuXHRcdFx0aWNvbjogJ3F1b3RlJyxcblx0XHRcdGhvdGtleXM6IFt7IG1vZGlmaWVyczogWydNb2QnLCAnU2hpZnQnXSwga2V5OiAnVicgfV0sXG5cdFx0XHRlZGl0b3JDYWxsYmFjazogYXN5bmMgKGVkaXRvcikgPT4ge1xuXHRcdFx0XHQvLyBcdThCRkJcdTUzRDZcdTUyNkFcdThEMzRcdTY3N0Zcblx0XHRcdFx0Y29uc3QgdGV4dCA9IGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQucmVhZFRleHQoKTtcblx0XHRcdFx0aWYgKCF0ZXh0IHx8IHRleHQudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdG5ldyBOb3RpY2UoJ1x1NTI2QVx1OEQzNFx1Njc3Rlx1NEUzQVx1N0E3QScpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFx1NUMxRFx1OEJENVx1ODNCN1x1NTNENlx1NTI2QVx1OEQzNFx1Njc3Rlx1NzY4NCBodG1sIFx1NjgzQ1x1NUYwRlx1ODNCN1x1NTNENiBVUkxcblx0XHRcdFx0bGV0IHVybCA9ICcnO1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGNvbnN0IGNsaXBib2FyZEl0ZW1zID0gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkKCk7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBpdGVtIG9mIGNsaXBib2FyZEl0ZW1zKSB7XG5cdFx0XHRcdFx0XHRpZiAoaXRlbS50eXBlcy5pbmNsdWRlcygndGV4dC9odG1sJykpIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgYmxvYiA9IGl0ZW0uZ2V0VHlwZSgndGV4dC9odG1sJyk7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGh0bWwgPSBhd2FpdCAoYXdhaXQgYmxvYikudGV4dCgpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBtYXRjaCA9IGh0bWwubWF0Y2goL1NvdXJjZVVSTDpcXHMqKGh0dHBzPzpcXC9cXC9bXlxcczxcIl0rKS9pKTtcblx0XHRcdFx0XHRcdFx0aWYgKG1hdGNoKSB1cmwgPSBtYXRjaFsxXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vIFx1NEU1Rlx1NjhDMFx1NjdFNSB0ZXh0L3VyaS1saXN0XG5cdFx0XHRcdFx0XHRpZiAoaXRlbS50eXBlcy5pbmNsdWRlcygndGV4dC91cmktbGlzdCcpKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGJsb2IgPSBpdGVtLmdldFR5cGUoJ3RleHQvdXJpLWxpc3QnKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgdXJpTGlzdCA9IGF3YWl0IChhd2FpdCBibG9iKS50ZXh0KCk7XG5cdFx0XHRcdFx0XHRcdGlmICh1cmlMaXN0LnRyaW0oKSkgdXJsID0gdXJpTGlzdC50cmltKCkuc3BsaXQoJ1xcbicpWzBdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBjYXRjaCB7XG5cdFx0XHRcdFx0Ly8gY2xpcGJvYXJkLnJlYWQoKSBcdTk3MDBcdTg5ODFcdTY3NDNcdTk2NTBcdUZGMENcdTk3NTlcdTlFRDhcdTk2NERcdTdFQTdcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFx1NjI1M1x1NUYwMFx1N0YxNlx1OEY5MVx1NUJGOVx1OEJERFx1Njg0NlxuXHRcdFx0XHRuZXcgQ2FyZEVkaXRNb2RhbChcblx0XHRcdFx0XHR0aGlzLmFwcCxcblx0XHRcdFx0XHR0ZXh0LnRyaW0oKSxcblx0XHRcdFx0XHR1cmwsXG5cdFx0XHRcdFx0dGhpcy5zZXR0aW5ncyxcblx0XHRcdFx0XHQocmVzdWx0KSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoIXJlc3VsdCkgcmV0dXJuO1xuXHRcdFx0XHRcdFx0Y29uc3QgY2FyZCA9IGdlbmVyYXRlQ2FyZChcblx0XHRcdFx0XHRcdFx0cmVzdWx0LnRleHQsXG5cdFx0XHRcdFx0XHRcdHJlc3VsdC51cmwsXG5cdFx0XHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MsXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0ZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24oY2FyZCk7XG5cdFx0XHRcdFx0XHRuZXcgTm90aWNlKCdcdTI3MDUgV2ViIENhcmQgXHU1REYyXHU2M0QyXHU1MTY1Jyk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0KS5vcGVuKCk7XG5cdFx0XHR9LFxuXHRcdH0pO1xuXG5cdFx0Ly8gXHUyNTAwXHUyNTAwIFx1NTQ3RFx1NEVFNDogXHU0RUNFXHU5MDA5XHU1QjlBXHU2NTg3XHU2NzJDXHU3NkY0XHU2M0E1XHU3NTFGXHU2MjEwXHU1MzYxXHU3MjQ3IFx1MjUwMFx1MjUwMFxuXHRcdHRoaXMuYWRkQ29tbWFuZCh7XG5cdFx0XHRpZDogJ3NlbGVjdGlvbi10by13ZWItY2FyZCcsXG5cdFx0XHRuYW1lOiAnU2VsZWN0aW9uIHRvIFdlYiBDYXJkJyxcblx0XHRcdGljb246ICdoaWdobGlnaHRlcicsXG5cdFx0XHRlZGl0b3JDYWxsYmFjazogKGVkaXRvcikgPT4ge1xuXHRcdFx0XHRjb25zdCBzZWxlY3RlZCA9IGVkaXRvci5nZXRTZWxlY3Rpb24oKTtcblx0XHRcdFx0aWYgKCFzZWxlY3RlZCB8fCBzZWxlY3RlZC50cmltKCkubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0bmV3IE5vdGljZSgnXHU4QkY3XHU1MTQ4XHU5MDA5XHU0RTJEXHU2NTg3XHU2NzJDJyk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bmV3IENhcmRFZGl0TW9kYWwoXG5cdFx0XHRcdFx0dGhpcy5hcHAsXG5cdFx0XHRcdFx0c2VsZWN0ZWQudHJpbSgpLFxuXHRcdFx0XHRcdCcnLFxuXHRcdFx0XHRcdHRoaXMuc2V0dGluZ3MsXG5cdFx0XHRcdFx0KHJlc3VsdCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKCFyZXN1bHQpIHJldHVybjtcblx0XHRcdFx0XHRcdGNvbnN0IGNhcmQgPSBnZW5lcmF0ZUNhcmQoXG5cdFx0XHRcdFx0XHRcdHJlc3VsdC50ZXh0LFxuXHRcdFx0XHRcdFx0XHRyZXN1bHQudXJsLFxuXHRcdFx0XHRcdFx0XHR0aGlzLnNldHRpbmdzLFxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKGNhcmQpO1xuXHRcdFx0XHRcdFx0bmV3IE5vdGljZSgnXHUyNzA1IFdlYiBDYXJkIFx1NURGMlx1NjNEMlx1NTE2NScpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdCkub3BlbigpO1xuXHRcdFx0fSxcblx0XHR9KTtcblxuXHRcdC8vIFx1MjUwMFx1MjUwMCBcdThCQkVcdTdGNkVcdTk4NzUgXHUyNTAwXHUyNTAwXG5cdFx0dGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBXZWJDYXJkU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xuXG5cdFx0Ly8gXHUyNTAwXHUyNTAwIFx1NTJBMFx1OEY3RFx1NjgzN1x1NUYwRiBcdTI1MDBcdTI1MDBcblx0XHR0aGlzLnJlZ2lzdGVyU3R5bGVzKCk7XG5cdH1cblxuXHRyZWdpc3RlclN0eWxlcygpIHtcblx0XHQvLyBcdTUzNjFcdTcyNDdcdTU3MjggQ2FsbG91dCBcdTRFMkRcdTgxRUFcdTUyQThcdTc1MUZcdTY1NDhcdUZGMENcdTk4OURcdTU5MTZcdTUyQTBcdTRFMDBcdTRFOUJcdTU4OUVcdTVGM0FcdTY4MzdcdTVGMEZcblx0XHRjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cdFx0c3R5bGUuaWQgPSAnd2ViLWNhcmQtc3R5bGVzJztcblx0XHRzdHlsZS50ZXh0Q29udGVudCA9IGBcblx0XHRcdC8qIENhbGxvdXQgXHU1MzYxXHU3MjQ3XHU1ODlFXHU1RjNBICovXG5cdFx0XHQuY2FsbG91dFtkYXRhLWNhbGxvdXQ9XCJxdW90ZVwiXSB7XG5cdFx0XHRcdGJvcmRlci1sZWZ0OiA0cHggc29saWQgdmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KSAhaW1wb3J0YW50O1xuXHRcdFx0XHRiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoXG5cdFx0XHRcdFx0MTM1ZGVnLFxuXHRcdFx0XHRcdHZhcigtLWJhY2tncm91bmQtcHJpbWFyeSkgMCUsXG5cdFx0XHRcdFx0dmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnkpIDEwMCVcblx0XHRcdFx0KSAhaW1wb3J0YW50O1xuXHRcdFx0XHRib3JkZXItcmFkaXVzOiAxMHB4ICFpbXBvcnRhbnQ7XG5cdFx0XHRcdGJveC1zaGFkb3c6IDAgMnB4IDhweCByZ2JhKDAsMCwwLDAuMDgpICFpbXBvcnRhbnQ7XG5cdFx0XHR9XG5cblx0XHRcdC5jYWxsb3V0W2RhdGEtY2FsbG91dD1cInF1b3RlXCJdIC5jYWxsb3V0LXRpdGxlIHtcblx0XHRcdFx0Zm9udC1zaXplOiAxLjFlbTtcblx0XHRcdFx0Zm9udC13ZWlnaHQ6IDYwMDtcblx0XHRcdFx0Y29sb3I6IHZhcigtLWludGVyYWN0aXZlLWFjY2VudCk7XG5cdFx0XHRcdHBhZGRpbmctYm90dG9tOiA2cHg7XG5cdFx0XHRcdGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1iYWNrZ3JvdW5kLW1vZGlmaWVyLWJvcmRlcik7XG5cdFx0XHRcdG1hcmdpbi1ib3R0b206IDhweDtcblx0XHRcdH1cblxuXHRcdFx0LmNhbGxvdXRbZGF0YS1jYWxsb3V0PVwicXVvdGVcIl0gLmNhbGxvdXQtY29udGVudCB7XG5cdFx0XHRcdGZvbnQtc2l6ZTogMC45NWVtO1xuXHRcdFx0XHRsaW5lLWhlaWdodDogMS43O1xuXHRcdFx0XHRjb2xvcjogdmFyKC0tdGV4dC1ub3JtYWwpO1xuXHRcdFx0fVxuXG5cdFx0XHQuY2FsbG91dFtkYXRhLWNhbGxvdXQ9XCJxdW90ZVwiXSAuY2FsbG91dC1jb250ZW50IHA6bGFzdC1jaGlsZCB7XG5cdFx0XHRcdG1hcmdpbi10b3A6IDEycHg7XG5cdFx0XHRcdHBhZGRpbmctdG9wOiA4cHg7XG5cdFx0XHRcdGJvcmRlci10b3A6IDFweCBkYXNoZWQgdmFyKC0tYmFja2dyb3VuZC1tb2RpZmllci1ib3JkZXIpO1xuXHRcdFx0XHRmb250LXNpemU6IDAuODVlbTtcblx0XHRcdFx0Y29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xuXHRcdFx0XHR0ZXh0LWFsaWduOiByaWdodDtcblx0XHRcdH1cblxuXHRcdFx0LyogXHU0RUUzXHU3ODAxXHU1NzU3XHU1MzYxXHU3MjQ3ICovXG5cdFx0XHRwcmUgY29kZS5sYW5ndWFnZS1jYXJkIHtcblx0XHRcdFx0YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KFxuXHRcdFx0XHRcdDEzNWRlZyxcblx0XHRcdFx0XHR2YXIoLS1iYWNrZ3JvdW5kLXByaW1hcnkpIDAlLFxuXHRcdFx0XHRcdHZhcigtLWJhY2tncm91bmQtc2Vjb25kYXJ5KSAxMDAlXG5cdFx0XHRcdCkgIWltcG9ydGFudDtcblx0XHRcdFx0Ym9yZGVyLWxlZnQ6IDRweCBzb2xpZCB2YXIoLS1pbnRlcmFjdGl2ZS1hY2NlbnQpO1xuXHRcdFx0XHRib3JkZXItcmFkaXVzOiAxMHB4O1xuXHRcdFx0XHRwYWRkaW5nOiAxNnB4ICFpbXBvcnRhbnQ7XG5cdFx0XHRcdHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcblx0XHRcdFx0Zm9udC1mYW1pbHk6IHZhcigtLWZvbnQtaW50ZXJmYWNlKTtcblx0XHRcdFx0Zm9udC1zaXplOiAwLjk1ZW07XG5cdFx0XHRcdGxpbmUtaGVpZ2h0OiAxLjc7XG5cdFx0XHRcdGNvbG9yOiB2YXIoLS10ZXh0LW5vcm1hbCk7XG5cdFx0XHR9XG5cblx0XHRcdC8qIFx1N0YxNlx1OEY5MVx1NkEyMVx1NjAwMVx1Njg0NiAqL1xuXHRcdFx0LndlYi1jYXJkLW1vZGFsIHRleHRhcmVhOmZvY3VzLFxuXHRcdFx0LndlYi1jYXJkLW1vZGFsIGlucHV0OmZvY3VzIHtcblx0XHRcdFx0b3V0bGluZTogMnB4IHNvbGlkIHZhcigtLWludGVyYWN0aXZlLWFjY2VudCkgIWltcG9ydGFudDtcblx0XHRcdFx0b3V0bGluZS1vZmZzZXQ6IC0xcHg7XG5cdFx0XHR9XG5cdFx0YDtcblx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR0aGlzLnJlZ2lzdGVyKCgpID0+IHN0eWxlLnJlbW92ZSgpKTtcblx0fVxuXG5cdG9udW5sb2FkKCkge1xuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWItY2FyZC1zdHlsZXMnKT8ucmVtb3ZlKCk7XG5cdH1cblxuXHRhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG5cdFx0dGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oXG5cdFx0XHR7fSxcblx0XHRcdERFRkFVTFRfU0VUVElOR1MsXG5cdFx0XHRhd2FpdCB0aGlzLmxvYWREYXRhKCksXG5cdFx0KTtcblx0fVxuXG5cdGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcblx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuXHR9XG59XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMCBcdThCQkVcdTdGNkVcdTk3NjJcdTY3N0YgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jbGFzcyBXZWJDYXJkU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuXHRwbHVnaW46IFdlYkNhcmRQbHVnaW47XG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogV2ViQ2FyZFBsdWdpbikge1xuXHRcdHN1cGVyKGFwcCwgcGx1Z2luKTtcblx0XHR0aGlzLnBsdWdpbiA9IHBsdWdpbjtcblx0fVxuXG5cdGRpc3BsYXkoKTogdm9pZCB7XG5cdFx0Y29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xuXG5cdFx0Y29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnV2ViIENhcmQgXHU4QkJFXHU3RjZFJyB9KTtcblx0XHRjb250YWluZXJFbC5jcmVhdGVFbCgncCcsIHtcblx0XHRcdHRleHQ6ICdcdTgxRUFcdTVCOUFcdTRFNDlcdTUzNjFcdTcyNDdcdTYzRDJcdTUxNjVcdTY4M0NcdTVGMEZcdTRFMEVcdTU5MTZcdTg5QzJcdTY4MzdcdTVGMEZcdTMwMDInLFxuXHRcdFx0YXR0cjogeyBzdHlsZTogJ2NvbG9yOnZhcigtLXRleHQtbXV0ZWQpO21hcmdpbi1ib3R0b206MjBweDsnIH0sXG5cdFx0fSk7XG5cblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKCdcdTlFRDhcdThCQTRcdTUzNjFcdTcyNDdcdTY4M0NcdTVGMEYnKVxuXHRcdFx0LnNldERlc2MoJ1x1OTAwOVx1NjJFOVx1NjNEMlx1NTE2NVx1NTM2MVx1NzI0N1x1NjVGNlx1NEY3Rlx1NzUyOFx1NzY4NCBNYXJrZG93biBcdTY4M0NcdTVGMEYnKVxuXHRcdFx0LmFkZERyb3Bkb3duKChkZCkgPT5cblx0XHRcdFx0ZGRcblx0XHRcdFx0XHQuYWRkT3B0aW9uKCdjYWxsb3V0JywgJ0NhbGxvdXQgXHU1RjE1XHU3NTI4XHU1NzU3IChcdTYzQThcdTgzNTApJylcblx0XHRcdFx0XHQuYWRkT3B0aW9uKCdjb2RlYmxvY2snLCAnXHU0RUUzXHU3ODAxXHU1NzU3XHU1MzYxXHU3MjQ3Jylcblx0XHRcdFx0XHQuYWRkT3B0aW9uKCdlbWJlZCcsICdcdTVENENcdTUxNjVcdTVGMEZcdTUzNjFcdTcyNDcnKVxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWZhdWx0Rm9ybWF0KVxuXHRcdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5kZWZhdWx0Rm9ybWF0ID0gdmFsIGFzIGFueTtcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdH0pLFxuXHRcdFx0KTtcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoJ1x1Njc2NVx1NkU5MFx1NjgwN1x1OEJCMCcpXG5cdFx0XHQuc2V0RGVzYygnXHU1NzI4XHU1MzYxXHU3MjQ3XHU1RTk1XHU5MEU4XHU2NjNFXHU3OTNBXHU2NzY1XHU2RTkwXHU3RjUxXHU3QUQ5XHU2ODA3XHU4QkIwJylcblx0XHRcdC5hZGRUb2dnbGUoKHQpID0+XG5cdFx0XHRcdHRcblx0XHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Muc2hvd1NvdXJjZUJhZGdlKVxuXHRcdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93U291cmNlQmFkZ2UgPSB2YWw7XG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0XHR9KSxcblx0XHRcdCk7XG5cblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKCdcdTUzNjFcdTcyNDdcdTY4MzdcdTVGMEYnKVxuXHRcdFx0LnNldERlc2MoJ1x1OTAwOVx1NjJFOVx1NTM2MVx1NzI0N1x1NzY4NFx1ODlDNlx1ODlDOVx1OThDRVx1NjgzQycpXG5cdFx0XHQuYWRkRHJvcGRvd24oKGRkKSA9PlxuXHRcdFx0XHRkZFxuXHRcdFx0XHRcdC5hZGRPcHRpb24oJ21vZGVybicsICdcdTczQjBcdTRFRTMgKFx1NkUxMFx1NTNEOCtcdTk2MzRcdTVGNzEpJylcblx0XHRcdFx0XHQuYWRkT3B0aW9uKCdtaW5pbWFsJywgJ1x1Njc4MVx1N0I4MCAoXHU3RUFGXHU4MjcyK1x1N0VDNlx1OEZCOVx1Njg0NiknKVxuXHRcdFx0XHRcdC5hZGRPcHRpb24oJ2NsYXNzaWMnLCAnXHU3RUNGXHU1MTc4IChcdTVGMTVcdTc1MjhcdTdFQkYrXHU4ODZDXHU3RUJGXHU1QjU3XHU0RjUzKScpXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmNhcmRTdHlsZSlcblx0XHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbCkgPT4ge1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuY2FyZFN0eWxlID0gdmFsIGFzIGFueTtcblx0XHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHRcdFx0dGhpcy5wbHVnaW4ucmVnaXN0ZXJTdHlsZXMoKTtcblx0XHRcdFx0XHR9KSxcblx0XHRcdCk7XG5cdH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQWdJO0FBU2hJLElBQU0sbUJBQW9DO0FBQUEsRUFDekMsZUFBZTtBQUFBLEVBQ2YsaUJBQWlCO0FBQUEsRUFDakIsV0FBVztBQUNaO0FBd0NBLFNBQVMsZ0JBQWdCLEtBQXFCO0FBQzdDLE1BQUk7QUFDSCxVQUFNLElBQUksSUFBSSxJQUFJLEdBQUc7QUFDckIsVUFBTSxXQUFXLEVBQUUsU0FBUyxRQUFRLFVBQVUsRUFBRTtBQUVoRCxVQUFNLFFBQWdDO0FBQUEsTUFDckMsY0FBYztBQUFBLE1BQ2QsZUFBZTtBQUFBLE1BQ2YsZUFBZTtBQUFBLE1BQ2YsU0FBUztBQUFBLE1BQ1Qs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
