# 微醺手册

面向年轻人的家庭调酒手册：47 款可以直接照着做的配方，加上酒的种类、名酒、酿造、产地、价格与文化。纯静态站点，没有构建步骤，改完就能看。

在线站点（GitHub Pages）：https://sxs159733.github.io/beer/

仓库为公开仓库，任何有写权限的协作者都可以直接 clone、修改、推送；推送 `main` 后由 GitHub Actions 自动发布。

## 页面

| 文件 | 页面 | 内容 |
| --- | --- | --- |
| `index.html` | 首页 | 站点导览与本週推荐 |
| `mix.html` | 调酒实验室 | 47 款配方，按难度/基酒/场景筛选，含原料、口感、做法、份量换算 |
| `guide.html` | 新手入门 | 器具、基酒、比例公式与避坑清单 |
| `spirits.html` | 名酒图鉴 | 33 款名酒，9 个类别，含酿造方式、口感、价格口径 |
| `culture.html` | 酒文化·产地 | 时间线、产区对照、诗词与酒礼 |

## 目录结构

```
index.html / mix.html / guide.html / spirits.html / culture.html
assets/css/site.css      全站样式与设计变量
assets/js/data.js        全部结构化内容（配方、酒款、产区、时间线）
assets/js/site.js        导航、主题与公共交互
assets/js/mix.js         调酒实验室逻辑
assets/js/spirits.js     名酒图鉴逻辑
assets/js/culture.js     酒文化与产区逻辑
assets/img/              47 张实拍图
```

## 本地预览

站点是纯静态文件，用任意本地服务器打开即可（不要直接双击 html，部分浏览器会限制 `fetch`/模块行为）：

```bash
python -m http.server 8765
# 或
npx serve .
```

然后访问 http://127.0.0.1:8765 。

## 改内容

绝大多数内容不需要碰 HTML，改 `assets/js/data.js` 就行：

- `WX.RECIPES` — 配方列表（`name` / `en` / `cat` / `level` / `spirit` / `ingredients` / `steps` / `taste` / `tips`）
- `WX.SPIRITS`、`WX.SPIRIT_CATS` — 名酒与类别
- `WX.BASES`、`WX.CATS` — 基酒说明与配方分类
- `WX.REGIONS`、`WX.TIMELINE`、`WX.POEMS` — 产区、时间线、诗词

改完刷新页面即可。全站样式走 CSS 变量（`--site-bg`、`--site-accent`、`--site-radius`、`--site-space` 等），换配色或整体密度只改 `assets/css/site.css` 顶部的 `:root`。

## 协作流程

1. 仓库持有者在 GitHub 的 **Settings → Collaborators** 里邀请成员（对方用自己的 GitHub 账号接受即可，不需要 Qoder 账号）。
2. 从 `main` 拉最新代码，改动尽量按页面或按 `data.js` 的字段分开提交，减少冲突。
3. 加新配方优先改 `data.js`；加新字段时才需要动对应的 `*.js`。
4. 提 PR 或直接推 `main` 都可以，推上去会自动重新部署（见下）。

### 用 AI Agent 协作

仓库是纯静态 HTML/CSS/JS，没有构建步骤和私有依赖，Codex、WorkBuddy、Qoder、Copilot 等 Agent 直接 clone 就能改。建议在仓库根目录放一个 `AGENTS.md`（各人自己的约定文件）说明改动范围，避免多个 Agent 同时改 `data.js` 造成冲突。

## 部署

本仓库根目录就是可直接部署的静态站点，由 `.github/workflows/pages.yml` 在每次推送 `main` 后自动发布到 GitHub Pages：

- 构建命令：**留空**
- 输出目录：**`/`**（仓库根目录）

首次推送后，Actions 会自动开启 Pages 并完成部署，约 1–2 分钟上线；之后每次推送自动更新。

## 说明

配方为家庭调酒的口味记录，酒精饮品请勿在未法定饮酒年龄饮用，孕期与服药期间避免饮酒。
