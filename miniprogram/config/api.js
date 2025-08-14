// API配置文件
const config = {
  // 开发环境
  development: {
    baseUrl: 'https://ark.cn-beijing.volces.com',
    apiKey: 'dd3adf72-d36a-4cd6-ad0e-3817a23d63f7',
    model: 'deepseek-v3-250324',
    // 文生图API配置
    imageApi: {
      baseUrl: '', // 待配置文生图API地址
      apiKey: '', // 待配置文生图API密钥
      model: '' // 待配置文生图模型
    }
  },
  // 生产环境
  production: {
    baseUrl: 'https://ark.cn-beijing.volces.com',
    apiKey: 'dd3adf72-d36a-4cd6-ad0e-3817a23d63f7    ',
    model: 'deepseek-v3-250324',
    // 文生图API配置
    imageApi: {
      baseUrl: '', // 待配置文生图API地址
      apiKey: '', // 待配置文生图API密钥
      model: '' // 待配置文生图模型
    }
  }
}

// 当前环境
const env = 'development'

// 导出配置
module.exports = {
  baseUrl: config[env].baseUrl,
  apiKey: config[env].apiKey,
  model: config[env].model,
  // 文生图配置
  imageApi: config[env].imageApi,
  // API路径
  endpoints: {
    chat: '/api/v3/chat/completions',
    user: '/api/user',
    image: '/api/image/generate' // 文生图接口路径，待配置
  }
}