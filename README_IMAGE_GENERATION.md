# 图像生成功能升级说明

## 修改概述
已成功将图像生成功能从阿里云通义万相API升级为豆包(Doubao) API，并添加了人物形象参考功能。

## 主要修改内容

### 1. API配置更新 (`miniprogram/config/api.js`)
- 更新了图像生成API配置，使用豆包API
- API密钥: `1d9596f7-ae01-4ca7-b35e-fb7d1e9e2f8b`
- 模型: `doubao-seedream-4-0-250828`
- 端点: `/api/v3/images/generations`

### 2. API服务更新 (`miniprogram/services/api.js`)
- 重写了 `generateImage` 方法以适配豆包API格式
- 支持传入参考图像 (`referenceImage` 参数)
- 使用豆包API的请求格式和响应解析

### 3. 聊天页面功能增强 (`miniprogram/pages/counseling/conversation/chat/index.js`)
- 修改 `generateContextualImage` 函数，添加咨询师头像作为参考图像
- 更新 `buildImagePrompt` 函数，在所有提示词前加入"参考提供的人物形象"
- 优化图像生成参数，使用2K分辨率

## 咨询师头像资源
所有咨询师头像位于 `/assets/Counselor_Headshot/` 目录：
- Dora: `doro.jpg`
- 懒羊羊: `lan.png`
- 灰太狼: `hui.jpg`
- 熊大: `bear1.png`
- 熊二: `bear2.png`

## 重要注意事项

### 参考图像URL配置
当前代码中的参考图像URL使用占位符：
```javascript
referenceImageUrl = `https://your-miniprogram-domain.com/miniprogram${counselorAvatar}`
```

**部署前需要修改为实际的域名或云存储URL**

### 建议的解决方案
1. **云存储方案**: 将咨询师头像上传到微信云存储，获取云存储URL
2. **CDN方案**: 将头像上传到CDN，使用CDN URL
3. **服务器方案**: 部署静态资源服务器，提供头像访问

### 豆包API参数说明
- `model`: "doubao-seedream-4-0-250828"
- `prompt`: 图像生成提示词（已包含"参考提供的人物形象"）
- `image`: 参考图像URL（咨询师头像）
- `size`: "2K" (2048x2048)
- `watermark`: true
- `response_format`: "url"

## 测试建议
1. 确保API密钥有效
2. 配置正确的参考图像URL
3. 测试不同咨询师的图像生成效果
4. 验证提示词是否正确包含"参考提供的人物形象"

## 后续优化
1. 实现参考图像的自动上传和URL管理
2. 添加图像生成失败的重试机制
3. 优化提示词生成算法
4. 添加图像生成历史记录功能