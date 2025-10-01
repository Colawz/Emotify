// API配置文件
const config = {
  // 开发环境
  development: {
    baseUrl: 'https://ark.cn-beijing.volces.com',
    apiKey: 'dd3adf72-d36a-4cd6-ad0e-3817a23d63f7',
    model: 'deepseek-v3-250324',
    // 豆包图像生成API配置
    imageApi: {
      baseUrl: 'https://ark.cn-beijing.volces.com',
      apiKey: '1d9596f7-ae01-4ca7-b35e-fb7d1e9e2f8b',
      model: 'doubao-seedream-4-0-250828'
    }
  },
  // 生产环境
  production: {
    baseUrl: 'https://ark.cn-beijing.volces.com',
    apiKey: 'dd3adf72-d36a-4cd6-ad0e-3817a23d63f7    ',
    model: 'deepseek-v3-250324',
    // 豆包图像生成API配置
    imageApi: {
      baseUrl: 'https://ark.cn-beijing.volces.com',
      apiKey: '1d9596f7-ae01-4ca7-b35e-fb7d1e9e2f8b',
      model: 'doubao-seedream-4-0-250828'
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
    // 豆包图像生成接口
    textToImage: '/api/v3/images/generations'
  }
}