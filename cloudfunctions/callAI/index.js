const cloud = require('wx-server-sdk')
const axios = require('axios')

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('云函数开始执行，参数：', event);

  try {
    const { messages, system, model } = event;

    if (!messages || !Array.isArray(messages)) {
      throw new Error('messages参数无效');
    }

    // 如果前端没有提供模型ID，则使用默认ID。请确保替换为您的模型ID。
    const modelToUse = model || 'ep-20240530082105-4kwpo'; 

    // 将system prompt添加到消息列表的开头
    const requestMessages = [];
    if (system) {
      requestMessages.push({ role: 'system', content: system });
    }
    requestMessages.push(...messages);

    console.log('准备调用AI接口...');

    const response = await axios({
      method: 'POST',
      url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dd3adf72-d36a-4cd6-ad0e-3817a23d63f7' // 注意：建议将此密钥存储在安全的地方
      },
      data: {
        model: modelToUse,
        messages: requestMessages
      },
      timeout: 30000 // 设置30秒超时
    });

    console.log('AI接口调用成功，响应：', response.data);

    if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      throw new Error('AI接口返回数据格式错误');
    }

    // 直接返回AI接口的完整响应数据
    return response.data;
  } catch (error) {
    console.error('云函数执行错误：', error);

    // 返回更详细的错误信息
    return {
      error: true,
      message: error.message,
      details: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    };
  }
};