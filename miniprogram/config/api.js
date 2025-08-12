// API配置文件
const config = {
  // 开发环境
  development: {
    baseUrl: 'https://ark.cn-beijing.volces.com',
    apiKey: 'dd3adf72-d36a-4cd6-ad0e-3817a23d63f7',
    model: 'deepseek-v3-250324'
  },
  // 生产环境
  production: {
    baseUrl: 'https://ark.cn-beijing.volces.com',
    apiKey: 'dd3adf72-d36a-4cd6-ad0e-3817a23d63f7    ',
    model: 'deepseek-v3-250324'
  }
}

// 当前环境
const env = 'development'

// 导出配置
module.exports = {
  baseUrl: config[env].baseUrl,
  apiKey: config[env].apiKey,
  model: config[env].model,
  
  // API路径
  endpoints: {
    chat: '/api/v3/chat/completions',
    user: '/api/user'
  }
} 