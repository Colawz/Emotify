const cloud = require('wx-server-sdk')
const axios = require('axios')

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('云函数开始执行，参数：', event)
  
  try {
    const { messages, model } = event
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('messages参数无效')
    }
    
    if (!model) {
      throw new Error('model参数无效')
    }

    console.log('准备调用AI接口...')
    
    const response = await axios({
      method: 'POST',
      url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer c195408a-ee7f-41b0-9201-5b0ca80535ea'
      },
      data: {
        model,
        messages
      },
      timeout: 30000 // 设置30秒超时
    })

    console.log('AI接口调用成功，响应：', response.data)

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('AI接口返回数据格式错误')
    }

    return response.data
  } catch (error) {
    console.error('云函数执行错误：', error)
    
    // 返回更详细的错误信息
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