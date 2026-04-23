class ApiService {
  constructor() {
    // 前端不再直接调用外部 API，所有请求通过云函数
  }

  // 聊天API - 通过云函数调用
  async chat(messages, options = {}) {
    try {
      console.log('准备调用聊天云函数，消息:', messages)

      const result = await wx.cloud.callFunction({
        name: 'callAI',
        data: {
          action: 'chat',
          messages: messages,
          system: options.system,
          model: options.model
        }
      })

      console.log('聊天云函数响应:', result)

      if (result.result && result.result.error) {
        throw new Error(result.result.message || '云函数返回错误')
      }

      return result.result
    } catch (error) {
      console.error('聊天云函数调用失败:', error)
      throw error
    }
  }

  // 图像生成API - 通过云函数调用
  async generateImage(prompt, options = {}) {
    try {
      console.log('准备调用图像生成云函数，prompt:', prompt)

      const result = await wx.cloud.callFunction({
        name: 'callAI',
        data: {
          action: 'generateImage',
          prompt: prompt,
          options: {
            size: options.size,
            watermark: options.watermark,
            referenceImage: options.referenceImage
          }
        }
      })

      console.log('图像生成云函数响应:', result)

      if (result.result && result.result.error) {
        throw new Error(result.result.message || '云函数返回错误')
      }

      return result.result
    } catch (error) {
      console.error('图像生成云函数调用失败:', error)
      return {
        success: false,
        error: error.message || '图像生成失败'
      }
    }
  }
}

// 导出单例
module.exports = new ApiService()
