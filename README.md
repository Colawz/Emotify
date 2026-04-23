# Emotify

Emotify 是一个基于微信小程序原生能力与微信云开发实现的情感支持类应用原型，当前代码主线围绕 4 个一级入口展开：

- `AI助手`：聊天式情绪识别、功能推荐与页面导航
- `心理疗愈`：角色陪聊、树洞、日记、画像、解压互动
- `亲情驿站`：家庭关怀提醒、陪伴聊天、温暖空间、任务管理
- `我的`：登录、消息、聊天历史、个人资料

> 说明：仓库里同时保留了 `Emotify`、`情感支持助手`、`心生启翔` 等命名痕迹。本文档以当前代码实际实现为准，而不是只依据早期 PRD。

## 项目概览

从代码实现看，这个项目不是单一“AI 聊天页”，而是一个将情绪支持、心理陪伴、家庭关怀和轻量社交原型放在同一个微信小程序里的综合型应用。

当前技术路线比较明确：

- 前端使用微信小程序原生目录结构，主代码位于 `miniprogram/`
- UI 组件基于 `tdesign-miniprogram`
- 后端能力依赖微信云开发
- AI 能力通过云函数 `callAI` 转发到火山引擎方舟 API
- 聊天记录和用户信息同时使用云数据库与本地缓存兜底

## 当前已实现的功能

### 1. AI 助手

代码位置：`miniprogram/pages/ai-assistant/chat/`

已实现能力：

- 自然语言聊天入口，支持中英文输入
- 基于关键词的意图识别
- 针对情绪与需求生成推荐卡片
- 可引导用户跳转到树洞、日记、心理对话、家庭任务、温暖空间等页面
- 对话内容可生成标题并保存到历史记录
- 用户画像会根据输入内容累积兴趣标签

当前识别的主要意图包括：

- 情绪类：焦虑、抑郁、愤怒、孤独、压力、快乐、爱情、困惑、内疚、恐惧
- 功能类：树洞、日记、家庭任务、陪我聊聊、解压游戏、温暖空间、历史记录

### 2. 心理疗愈模块

代码位置：`miniprogram/pages/counseling/`

已落地页面包括：

- `index`：心理疗愈首页，聚合陪聊、树洞、日记、足迹、解压游戏入口
- `conversation/index`：咨询师/聊天伙伴选择页
- `conversation/chat/index`：角色扮演式陪聊页
- `conversation/create/index`：自定义专属聊天伙伴
- `treehole/index`：匿名树洞列表
- `treehole/publish`：树洞发帖页
- `diary/*`：心情日记分类、主题选择、写作与保存
- `user-profile/index`：日记足迹与活动统计
- `profile-analysis/index`：基于静态数据生成的大五人格雷达图
- `stickman/index`：Canvas 版“暴揍火柴人”解压小游戏

其中较完整的实现有：

- 角色陪聊：可选择预设角色，也可创建自定义角色
- 角色化系统提示词：咨询页会按选中角色生成专属 system prompt
- 历史对话持久化：保存到 `History` 集合，失败时回退到本地 `chats`
- 图像生成能力：咨询对话代码里已经接入图像生成流程，可根据对话内容和咨询师形象生成配图

### 3. 亲情驿站模块

代码位置：`miniprogram/pages/family-garden/`

当前实现更偏“交互原型”，主要页面有：

- `index`：亲情驿站首页
- `smart-tips/index`：提醒事项与健康建议
- `chat-together/index`：陪伴者列表、语音/视频/预约交互原型
- `warm-space/index`：家庭小树、动态、相册、重要时刻
- `task-management/index`：面向关怀场景的任务管理
- `family-tasks/index`：家庭小任务、健康监测、安全检查、紧急联系人

这部分页面的特点是：

- 视觉与交互完成度较高
- 业务数据主要来自页面内置 mock 数据
- 多数操作停留在本地状态更新或弹窗交互

### 4. 个人中心

代码位置：`miniprogram/pages/profile/`

已实现能力：

- 自定义头像和昵称登录
- 调用云函数获取 `openid`
- 新用户头像上传到云存储
- 用户信息写入 `User` 集合
- AI 对话历史查看、删除、清空
- 站内消息列表与模拟私聊页
- 关于页与基础设置入口

## 技术架构

### 前端

- 微信小程序原生页面结构
- 主要代码以 JavaScript 为主
- `app.ts` 和部分官方 quickstart 文件仍保留，但当前业务主线主要运行在 `app.js` 和各页面 `.js`
- 全局组件依赖 `tdesign-miniprogram`

### 云开发

项目当前绑定了一个固定云环境：

- 云环境 ID：`cloud1-1gjz5ckoe28a6c4a`

如果你要迁移到自己的环境，至少需要同步调整这些位置：

- `miniprogram/app.js`
- `miniprogram/pages/ai-assistant/chat/index.js`
- `miniprogram/pages/counseling/conversation/chat/index.js`
- 微信开发者工具中的云开发环境配置

### 云函数

#### `cloudfunctions/callAI`

职责：

- 统一代理前端 AI 请求，避免小程序前端直连外部模型接口
- 支持两种 `action`
  - `chat`：聊天补全
  - `generateImage`：图像生成

实际接入：

- 聊天模型默认：`deepseek-v3-250324`
- 图像模型默认：`doubao-seedream-4-0-250828`
- 默认 API Base URL：`https://ark.cn-beijing.volces.com`

#### `cloudfunctions/getUserInfo`

职责：

- 获取当前微信用户 `openid`
- 查询 `User` 集合中是否已有用户记录
- 返回 `existingUser` 与 `isNewUser`

## 数据存储现状

### 云数据库

当前代码明确使用了 2 个集合：

| 集合名 | 用途 | 主要字段 |
| --- | --- | --- |
| `User` | 用户资料 | `openid`, `nickName`, `avatarUrl` |
| `History` | AI / 咨询聊天历史 | `id`, `messages`, `title`, `lastUpdate`, `openid` |

### 本地缓存

代码中还使用了微信本地存储做兜底或轻量持久化：

- `userInfo`：当前用户信息
- `userProfile`：AI 助手累计的兴趣画像
- `chats`：云数据库不可用时的聊天记录
- `diaries`：心情日记内容
- `logs`：启动日志

## 项目结构

```text
.
├─ miniprogram/                 # 小程序前端主目录
│  ├─ app.js
│  ├─ app.json
│  ├─ services/
│  │  └─ api.js                 # 云函数调用封装
│  └─ pages/
│     ├─ ai-assistant/
│     ├─ counseling/
│     ├─ family-garden/
│     └─ profile/
├─ cloudfunctions/
│  ├─ callAI/                   # AI 聊天 / 图像生成代理
│  ├─ getUserInfo/              # 获取 openid 与用户判定
│  └─ test/
├─ docs/
│  └─ prd.md                    # 早期产品规划文档
├─ i18n/
├─ miniapp/                     # 多平台工程生成目录
├─ README_IMAGE_GENERATION.md   # 图像生成功能补充说明
└─ project.config.json          # 微信开发者工具工程配置
```

## 本地开发

这个仓库没有配置常规的前端 `npm scripts`，开发方式以微信开发者工具为主。

### 1. 安装根依赖

```bash
npm install
```

### 2. 安装云函数依赖

至少需要安装：

```bash
cd cloudfunctions/callAI && npm install
cd ../getUserInfo && npm install
```

如果你是通过微信开发者工具打开项目，也可以直接在云函数面板里安装依赖并部署。

### 3. 配置环境变量

复制根目录环境变量模板：

```bash
cp .env.example .env
```

可配置项：

| 变量名 | 说明 |
| --- | --- |
| `ARK_API_KEY` | 方舟聊天模型 API Key |
| `ARK_IMAGE_API_KEY` | 方舟图像生成 API Key，不填时回退到 `ARK_API_KEY` |
| `ARK_BASE_URL` | 可选，自定义 API 基础地址 |

说明：

- `callAI` 云函数会优先读取云开发控制台中的环境变量
- 本地开发时会回退读取仓库根目录的 `.env`
- 不要把真实密钥提交到仓库

### 4. 导入微信开发者工具

导入项目根目录后，重点确认：

- `miniprogramRoot` 指向 `miniprogram/`
- `cloudfunctionRoot` 指向 `cloudfunctions/`
- 工程已执行“构建 npm”
- 使用的 AppID、云环境与当前账号权限匹配

当前仓库里的 `project.config.json` 已写入示例 AppID，如果你要在自己的账号下运行，通常需要改成你自己的小程序 AppID。

### 5. 准备云开发资源

建议至少创建以下集合：

- `User`
- `History`

并完成：

- 云函数部署：`callAI`、`getUserInfo`
- 云存储权限配置
- 数据库权限配置

## 当前状态说明

如果你要继续开发这个项目，下面这些判断很关键：

### 已经比较成型的部分

- AI 助手聊天主链路
- 咨询角色陪聊主链路
- 用户登录与头像上传
- 聊天历史保存与读取
- 小程序整体页面组织与视觉风格

### 更偏原型/演示的部分

- 树洞列表内容主要是 mock 数据
- 日记保存在本地缓存，不走云端
- 亲情驿站大多数模块以页面内 mock 数据为主
- 心理画像是静态演示数据，不是真正的测评结果计算
- 消息页与私聊页是模拟社交数据

### 代码中保留的早期痕迹

- `docs/prd.md` 里还有宿舍匹配、拼车、体育匹配、工大点评等更早规划
- `pages/_archive/` 保留了旧首页原型
- 工程仍带有部分 quickstart/multi-platform 生成目录

## 补充文档

- 图像生成补充说明：[`README_IMAGE_GENERATION.md`](./README_IMAGE_GENERATION.md)
- 早期 PRD：[`docs/prd.md`](./docs/prd.md)

## 总结

从当前代码状态看，Emotify 已经具备一个“可演示、可继续扩展”的微信小程序原型骨架：

- 有明确的产品结构
- 有真实接入的 AI 与云开发能力
- 有较完整的聊天与登录数据链路
- 也同时保留了不少 mock 数据页面与早期功能规划

如果后续继续推进，最值得优先补强的方向会是：

1. 统一数据模型，减少 mock 与本地缓存分裂
2. 补齐云数据库设计与权限规则
3. 统一命名和页面路由，清理历史原型残留
4. 给核心页面补充真实后端与状态管理
