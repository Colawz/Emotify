# Emotify

Emotify 是我们做的一款微信小程序。

我们想做的不是一个单纯的 AI 聊天框，而是一个把情绪支持、心理陪伴、家庭关怀和轻量记录放在一起的小程序入口。用户可以在这里和 AI 助手对话，也可以去树洞倾诉、写心情日记、选择不同风格的陪聊角色，或者进入亲情驿站做一些更偏家庭陪伴和提醒的事情。

这个仓库就是项目当前的源码。仓库里还保留了一些早期命名和旧页面，我们后面会继续统一，但主线功能已经比较清楚了。

## 我们现在做了什么

目前小程序主要分成 4 个入口：

- `AI助手`：聊天、识别情绪、推荐功能入口
- `心理疗愈`：角色陪聊、树洞、日记、画像、解压互动
- `亲情驿站`：提醒、陪伴、温暖空间、任务管理
- `我的`：登录、消息、聊天记录、个人资料

### AI 助手

`miniprogram/pages/ai-assistant/chat/`

这一块是整个小程序的总入口之一。用户输入一句话以后，AI 助手会先理解用户大概在说什么，再决定更适合把用户带去哪个页面。

现在已经接上的能力有：

- 聊天式交互
- 中英文关键词识别
- 情绪和需求分类
- 推荐卡片生成
- 页面跳转引导
- 对话历史保存
- 简单用户画像累计

已经覆盖的部分情绪和意图包括：

- 焦虑
- 抑郁
- 愤怒
- 孤独
- 压力
- 快乐
- 爱情
- 困惑
- 内疚
- 恐惧
- 树洞
- 日记
- 家庭任务
- 陪我聊聊
- 解压游戏
- 温暖空间
- 历史记录

### 心理疗愈

`miniprogram/pages/counseling/`

这是我们最核心的一块。

现在已经有这些页面：

- `index`：心理疗愈首页
- `conversation/index`：选择陪聊角色
- `conversation/chat/index`：进入角色陪聊
- `conversation/create/index`：创建专属陪聊角色
- `treehole/index`：情绪树洞列表
- `treehole/publish`：发布树洞内容
- `diary/index`：心情日记分类
- `diary/topics/index`：日记主题选择
- `diary/write/index`：写日记
- `user-profile/index`：足迹与活动统计
- `profile-analysis/index`：心理画像展示
- `stickman/index`：解压小游戏

这一块目前已经能跑通的主链路有：

- 选择预设角色进行陪聊
- 自己创建一个专属角色再开始聊天
- 给不同角色生成不同的 system prompt
- 保存陪聊历史
- 读取历史对话
- 在对话里接入图像生成能力

### 亲情驿站

`miniprogram/pages/family-garden/`

这一块更偏家庭陪伴和关怀场景。

目前已经做了这些页面：

- `index`：亲情驿站首页
- `smart-tips/index`：提醒和健康建议
- `chat-together/index`：陪伴聊天与预约交互
- `warm-space/index`：家庭小树、相册、动态、重要时刻
- `task-management/index`：家庭任务管理
- `family-tasks/index`：关怀任务、健康监测、安全检查、紧急联系人

这一部分页面的视觉和交互已经做出来了，不过不少内容还在用页面内置数据演示，后面会继续把数据层补完整。

### 我的

`miniprogram/pages/profile/`

个人中心现在已经接了这些能力：

- 自定义头像和昵称登录
- 通过云函数拿 `openid`
- 新用户头像上传到云存储
- 用户资料写入 `User` 集合
- 查看、删除、清空 AI 聊天历史
- 消息页和私聊页
- 关于页和基础设置入口

## 技术方案

这个项目目前采用的是微信小程序原生方案。

- 前端主目录：`miniprogram/`
- UI 组件库：`tdesign-miniprogram`
- 云能力：微信云开发
- AI 调用方式：前端调云函数，云函数再去请求外部模型接口

项目里现在主要用到两个云函数：

- `cloudfunctions/callAI`
- `cloudfunctions/getUserInfo`

### `callAI`

这个云函数负责统一代理 AI 请求。

我们现在把两类能力都放在这里：

- `chat`：聊天补全
- `generateImage`：图像生成

默认配置如下：

- 聊天模型：`deepseek-v3-250324`
- 生图模型：`doubao-seedream-4-0-250828`
- Base URL：`https://ark.cn-beijing.volces.com`

### `getUserInfo`

这个云函数主要做两件事：

- 读取当前微信用户的 `openid`
- 去 `User` 集合里检查这个用户是不是已经注册过

## 数据存储

现在主要用到两个云数据库集合：

| 集合名 | 用途 |
| --- | --- |
| `User` | 用户资料 |
| `History` | AI / 陪聊历史记录 |

除了云数据库，我们也保留了一部分本地缓存做兜底：

- `userInfo`
- `userProfile`
- `chats`
- `diaries`
- `logs`

比如聊天记录这条链路，优先会走云数据库；如果云端不可用，代码里也保留了本地缓存兜底。

## 项目结构

```text
.
├─ miniprogram/
│  ├─ app.js
│  ├─ app.json
│  ├─ services/
│  │  └─ api.js
│  └─ pages/
│     ├─ ai-assistant/
│     ├─ counseling/
│     ├─ family-garden/
│     └─ profile/
├─ cloudfunctions/
│  ├─ callAI/
│  ├─ getUserInfo/
│  └─ test/
├─ docs/
│  └─ prd.md
├─ i18n/
├─ miniapp/
├─ README_IMAGE_GENERATION.md
└─ project.config.json
```

## 怎么跑起来

这个项目不是常规的 Web 前端工程，主要还是通过微信开发者工具来跑。

### 1. 安装根依赖

```bash
npm install
```

### 2. 安装云函数依赖

```bash
cd cloudfunctions/callAI && npm install
cd ../getUserInfo && npm install
```

如果你直接用微信开发者工具，也可以在云函数面板里安装依赖再部署。

### 3. 配置环境变量

先复制一份环境变量模板：

```bash
cp .env.example .env
```

需要的变量有：

| 变量名 | 说明 |
| --- | --- |
| `ARK_API_KEY` | 聊天模型的 API Key |
| `ARK_IMAGE_API_KEY` | 图像生成的 API Key |
| `ARK_BASE_URL` | 可选，自定义接口地址 |

`callAI` 会优先读取云开发控制台里的环境变量；本地调试时如果读不到，就会回退到根目录的 `.env`。

### 4. 用微信开发者工具导入

导入仓库根目录后，确认下面几项：

- `miniprogramRoot` 是 `miniprogram/`
- `cloudfunctionRoot` 是 `cloudfunctions/`
- 小程序工程已经执行过“构建 npm”
- AppID 和云环境是你自己的可用配置

仓库里的 `project.config.json` 现在保留了项目开发时的配置。如果你是自己拉下来运行，通常需要换成你自己的 AppID。

### 5. 准备云开发资源

最少需要准备这些东西：

- 数据库集合 `User`
- 数据库集合 `History`
- 云函数 `callAI`
- 云函数 `getUserInfo`
- 云存储权限
- 数据库权限

## 现在的完成度

这个项目不是空壳，但也还没有到“所有页面都是真实后端”的状态。

已经比较完整的部分：

- AI 助手聊天主链路
- 角色陪聊主链路
- 用户登录和头像上传
- 聊天历史保存与读取
- 页面整体结构和视觉风格

还在继续补的部分：

- 树洞列表目前主要还是演示数据
- 日记目前保存在本地缓存
- 亲情驿站很多页面还是以页面内置数据为主
- 心理画像现在是静态演示版本
- 消息页和私聊页也是模拟数据

仓库里也还保留了一些早期内容：

- `docs/prd.md` 里有更早一版产品设想
- `pages/_archive/` 里留了旧首页原型
- 一些页面文案里还会看到早期命名

这些我们后面会继续收口和统一。

## 补充文档

- 图像生成说明：[`README_IMAGE_GENERATION.md`](./README_IMAGE_GENERATION.md)
- 早期 PRD：[`docs/prd.md`](./docs/prd.md)

## 最后

这个项目对我们来说，不只是做一个“能对话”的小程序。

我们更想做的是一个让用户在不同状态下都能找到入口的产品：情绪上头的时候可以先说一句话，想认真梳理的时候可以去陪聊或日记，想照顾家人的时候也能马上进入亲情驿站。

仓库会继续更新，README 也会跟着一起补齐。
