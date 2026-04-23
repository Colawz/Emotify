const cloud = require('wx-server-sdk')
const axios = require('axios')
const path = require('path')
const fs = require('fs')

// 尝试加载项目根目录的 .env（仅本地开发时使用）
const envPath = path.resolve(__dirname, '../../.env')
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath })
}

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 从环境变量读取配置（优先使用云开发控制台配置的环境变量，本地开发回退到 .env）
const ARK_API_KEY = process.env.ARK_API_KEY
const ARK_IMAGE_API_KEY = process.env.ARK_IMAGE_API_KEY || process.env.ARK_API_KEY
const ARK_BASE_URL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com'

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('云函数开始执行，参数：', event);

  const { action = 'chat' } = event;

  try {
    if (action === 'chat') {
      return await handleChat(event);
    } else if (action === 'generateImage') {
      return await handleGenerateImage(event);
    } else {
      throw new Error(`不支持的操作: ${action}`);
    }
  } catch (error) {
    console.error('云函数执行错误：', error);
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

// 处理对话请求
async function handleChat(event) {
  const { messages, system, model } = event;

  if (!messages || !Array.isArray(messages)) {
    throw new Error('messages参数无效');
  }

  if (!ARK_API_KEY) {
    throw new Error('ARK_API_KEY 未配置，请在云开发控制台或 .env 中设置');
  }

  const modelToUse = model || 'deepseek-v3-250324';

  const requestMessages = [];
  if (system) {
    requestMessages.push({ role: 'system', content: system });
  }
  requestMessages.push(...messages);

  console.log('准备调用AI对话接口...');

  const response = await axios({
    method: 'POST',
    url: `${ARK_BASE_URL}/api/v3/chat/completions`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ARK_API_KEY}`
    },
    data: {
      model: modelToUse,
      messages: requestMessages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: false
    },
    timeout: 30000
  });

  console.log('AI对话接口调用成功，响应：', response.data);

  if (!response.data || !response.data.choices || !response.data.choices[0]) {
    throw new Error('AI接口返回数据格式错误');
  }

  return response.data;
}

// 处理图像生成请求
async function handleGenerateImage(event) {
  const { prompt, options = {} } = event;

  if (!prompt) {
    throw new Error('prompt参数无效');
  }

  if (!ARK_IMAGE_API_KEY) {
    throw new Error('ARK_IMAGE_API_KEY 未配置，请在云开发控制台或 .env 中设置');
  }

  const requestData = {
    model: options.model || 'doubao-seedream-4-0-250828',
    prompt: prompt,
    sequential_image_generation: 'disabled',
    response_format: 'url',
    size: options.size || '2K',
    stream: false,
    watermark: options.watermark !== false
  };

  if (options.referenceImage) {
    requestData.image = options.referenceImage;
  }

  console.log('准备调用图像生成接口...');

  const response = await axios({
    method: 'POST',
    url: `${ARK_BASE_URL}/api/v3/images/generations`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ARK_IMAGE_API_KEY}`
    },
    data: requestData,
    timeout: 60000
  });

  console.log('图像生成接口调用成功，响应：', response.data);

  if (response.data && response.data.data && response.data.data.length > 0 && response.data.data[0].url) {
    return {
      success: true,
      imageUrl: response.data.data[0].url,
      message: '图像生成成功'
    };
  }

  throw new Error('图像生成失败，未获取到图像URL');
}
