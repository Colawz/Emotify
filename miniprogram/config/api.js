// API配置文件
const config = {
  // 开发环境
  development: {
    baseUrl: 'https://ark.cn-beijing.volces.com',
    apiKey: 'dd3adf72-d36a-4cd6-ad0e-3817a23d63f7',
    model: 'deepseek-v3-250324',
    // 阿里云通义万相图像生成API配置
    imageApi: {
      baseUrl: 'https://dashscope.aliyuncs.com',
      apiKey: 'sk-49851ffda0d44d769ce69ec37f632255',
      model: 'wanx2.1-imageedit'
    }
  },
  // 生产环境
  production: {
    baseUrl: 'https://ark.cn-beijing.volces.com',
    apiKey: 'dd3adf72-d36a-4cd6-ad0e-3817a23d63f7    ',
    model: 'deepseek-v3-250324',
    // 阿里云通义万相图像生成API配置
    imageApi: {
      baseUrl: 'https://dashscope.aliyuncs.com',
      apiKey: 'sk-49851ffda0d44d769ce69ec37f632255',
      model: 'wanx2.1-imageedit'
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
    // 阿里云通义万相图像编辑接口
    imageEdit: '/api/v1/services/aigc/image2image/image-synthesis',
    // 查询任务结果接口
    taskQuery: '/api/v1/tasks'
  }
}