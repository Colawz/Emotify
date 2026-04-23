// API 配置文件（前端版本）
// 注意：敏感密钥已迁移至云函数环境变量 / 项目根目录 .env 文件
// 前端不再直接调用外部 API，所有请求均通过 cloudfunctions/callAI 云函数

module.exports = {
  // 仅保留前端需要的基础配置
  endpoints: {
    chat: '/api/v3/chat/completions',
    textToImage: '/api/v3/images/generations'
  }
}
