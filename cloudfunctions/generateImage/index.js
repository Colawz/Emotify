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
    // 从 event 中获取 prompt 和 image_url
    const { prompt, image_url } = event
    
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('prompt参数无效')
    }
    if (!image_url || typeof image_url !== 'string') {
      throw new Error('image_url参数无效')
    }

    console.log('准备调用通义千问文生图API...')
    console.log('生成提示词:', prompt)
    console.log('基础图片URL:', image_url)
    
    // API配置 - 通义千问 qwen-image-edit
    const imageApiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'
    const imageApiKey = 'sk-49851ffda0d44d769ce69ec37f632255'
    
    const response = await axios({
      method: 'POST',
      url: imageApiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${imageApiKey}`
      },
      data: {
        model: 'qwen-image-edit',
        input: {
          messages: [
            {
              role: 'user',
              content: [
                {
                  image: image_url
                },
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        parameters: {
          negative_prompt: 'text, watermark'
        }
      },
      timeout: 60000 // 设置60秒超时
    })

    console.log('文生图API调用成功，响应：', response.data)

    if (response.data && response.data.output && response.data.output.results && response.data.output.results[0].url) {
      return {
        success: true,
        data: {
          created: Math.floor(Date.now() / 1000),
          data: [
            {
              url: response.data.output.results[0].url
            }
          ]
        },
        prompt: prompt,
        timestamp: Date.now()
      }
    } else {
      throw new Error('文生图API返回数据格式不正确或无结果')
    }
  } catch (error) {
    console.error('文生图云函数执行错误：', error)
    
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