const cloud = require('wx-server-sdk')
const axios = require('axios')

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('文生图云函数开始执行，参数：', event)
  
  try {
    const { prompt, style, size, model } = event
    
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('prompt参数无效')
    }

    console.log('准备调用文生图API...')
    console.log('生成提示词:', prompt)
    console.log('风格:', style || '默认')
    console.log('尺寸:', size || '默认')
    
    // 文生图API配置 - 智谱AI CogView-4
    const imageApiUrl = 'https://open.bigmodel.cn/api/paas/v4/images/generations'
    const imageApiKey = '60712cae321645489aa8d53cc3654fb0.k4Uo2o59KpNZuwsQ'
    const imageModel = 'cogview-4-250304'
    
    // 如果你想使用环境变量（推荐用于生产环境），可以这样配置：
    // const imageApiUrl = process.env.IMAGE_API_URL || 'https://api.example.com/v1/images/generations'
    // const imageApiKey = process.env.IMAGE_API_KEY || 'your-api-key-here'
    // const imageModel = process.env.IMAGE_MODEL || 'dall-e-3'
    
    if (!imageApiUrl || !imageApiKey) {
      throw new Error('文生图API配置未完成，请先配置API URL和密钥')
    }
    
    const response = await axios({
      method: 'POST',
      url: imageApiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${imageApiKey}`
      },
      data: {
        prompt: prompt,
        style: style || 'default',
        size: size || '1024x1024',
        model: model || imageModel || 'default',
        n: 1 // 生成图片数量
      },
      timeout: 60000 // 设置60秒超时，文生图通常需要更长时间
    })

    console.log('文生图API调用成功，响应：', response.data)

    // 根据不同API的响应格式进行处理
    // 这里需要根据实际API调整响应数据结构
    if (!response.data) {
      throw new Error('文生图API返回数据为空')
    }

    return {
      success: true,
      data: response.data,
      prompt: prompt,
      timestamp: Date.now()
    }
  } catch (error) {
    console.error('文生图云函数执行错误：', error)
    
    // 返回详细的错误信息
    return {
      error: true,
      message: error.message,
      details: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    }
  }
}