const apiConfig = require('../config/api')

class ApiService {
  constructor() {
    this.baseUrl = apiConfig.baseUrl
    this.apiKey = apiConfig.apiKey
    this.model = apiConfig.model
  }

  // 通用请求方法
  async request(endpoint, options = {}, customBaseUrl = null) {
    try {
      const baseUrl = customBaseUrl || this.baseUrl
      const url = `${baseUrl}${endpoint}`
      console.log('请求URL:', url)
      console.log('请求参数:', options)

      const defaultOptions = {
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 120000, // 设置120秒超时
        enableHttp2: true, // 启用HTTP/2
        enableQuic: true // 启用QUIC
      }

      const finalOptions = {
        ...defaultOptions,
        ...options,
        header: {
          ...defaultOptions.header,
          ...(options.header || {})//你好
        }
      }

      console.log('最终请求配置:', finalOptions)

      const response = await new Promise((resolve, reject) => {
        wx.request({
          url,
          ...finalOptions,
          success: (res) => {
            console.log('请求成功，响应:', res)
            resolve(res)
          },
          fail: (err) => {
            console.error('请求失败:', err)
            reject(err)
          }
        })
      })

      console.log('API响应:', response)

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response.data
      } else {
        const errorMsg = `API请求失败: 状态码 ${response.statusCode}, 响应数据: ${JSON.stringify(response.data)}`
        console.error(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('API请求错误:', error)
      if (error.errMsg) {
        console.error('微信请求错误:', error.errMsg)
      }
      throw new Error(`API请求失败: ${error.message || error.errMsg || '未知错误'}`)
    }
  }

  // 聊天API
  async chat(messages) {
    try {
      console.log('准备调用聊天API，消息:', messages)
      
      const result = await this.request(apiConfig.endpoints.chat, {
        method: 'POST',
        data: {
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: false
        }
      })

      console.log('聊天API响应:', result)
      return result
    } catch (error) {
      console.error('聊天API调用失败:', error)
      throw error
    }
  }

  // 用户相关API
  async getUserInfo() {
    try {
      console.log('准备调用用户信息API')
      const result = await this.request(apiConfig.endpoints.user)
      console.log('用户信息API响应:', result)
      return result
    } catch (error) {
      console.error('用户信息API调用失败:', error)
      throw error
    }
  }

  // 图像生成API - 创建任务
  async generateImage(prompt, baseImageUrl = null, imageFunction = 'stylization_all') {
    try {
      console.log('准备调用图像生成API，提示词:', prompt)
      
      // 构建请求数据
      const requestData = {
        model: apiConfig.imageApi.model,
        input: {
          function: imageFunction,
          prompt: prompt
        },
        parameters: {
          n: 1
        }
      }
      
      // 如果提供了基础图片URL，添加到请求中
      if (baseImageUrl) {
        requestData.input.base_image_url = baseImageUrl
      }
      
      const result = await this.request(apiConfig.endpoints.imageEdit, {
         method: 'POST',
         header: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${apiConfig.imageApi.apiKey}`,
           'X-DashScope-Async': 'enable'
         },
         data: requestData
       }, apiConfig.imageApi.baseUrl)
      
      console.log('图像生成API响应:', result)
      return result
    } catch (error) {
      console.error('图像生成API调用失败:', error)
      throw error
    }
  }
  
  // 查询图像生成任务结果
  async queryImageTask(taskId) {
    try {
      console.log('查询图像生成任务结果，任务ID:', taskId)
      
      const result = await this.request(`${apiConfig.endpoints.taskQuery}/${taskId}`, {
         method: 'GET',
         header: {
           'Authorization': `Bearer ${apiConfig.imageApi.apiKey}`
         }
       }, apiConfig.imageApi.baseUrl)
      
      console.log('任务查询API响应:', result)
      return result
    } catch (error) {
      console.error('任务查询API调用失败:', error)
      throw error
    }
  }
  
  // 轮询查询图像生成结果
  async pollImageResult(taskId, maxAttempts = 30, interval = 2000) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await this.queryImageTask(taskId)
        
        if (result.task_status === 'SUCCEEDED') {
          console.log('图像生成成功:', result)
          return result
        } else if (result.task_status === 'FAILED') {
          throw new Error(`图像生成失败: ${result.message || '未知错误'}`)
        }
        
        // 等待指定时间后重试
        await new Promise(resolve => setTimeout(resolve, interval))
        console.log(`第${attempt + 1}次查询，任务状态: ${result.task_status}`)
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error
        }
        console.log(`查询失败，${interval}ms后重试...`)
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    }
    
    throw new Error('图像生成超时')
  }

  // 添加更多API方法...
}

// 导出单例
module.exports = new ApiService()