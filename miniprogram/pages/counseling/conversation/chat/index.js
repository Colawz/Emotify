const app = getApp()
const apiService = require('../../../../services/api')

Page({
  data: {
    userInfo: null,
    messages: [],
    inputValue: '',
    isLoading: false,
    scrollToMessage: '',
    currentChatId: '', // 当前对话ID,
    counselor: {
      id: '1',
      name: 'AI咨询师',
      avatar: '/images/ai-avatar.png' // 默认头像
    },
    // 图像生成相关
    imageGenerationEnabled: false, // 图像生成开关
    isGeneratingImage: false, // 图像生成中状态
    latestImageUrl: '', // 最新生成的图片URL
  },

  onLoad(options) {
    this.getUserInfo()

    if (options.counselor) {
      this.setData({
        counselor: JSON.parse(options.counselor)
      });
    }
    
    // 如果有传入的对话ID，加载历史对话
    if (options.chatId) {
      this.loadChat(options.chatId)
    } else {
      this.initMessages()
    }
  },

  onShow() {
    // 页面显示时的处理逻辑
    console.log('AI助手聊天页面显示');
  },

  onNavigateBack() {
    wx.navigateBack();
  },

  // 获取用户信息
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
  },

  // 初始化消息
  initMessages() {
    this.setData({
      messages: [], // 不添加任何初始消息，保持数组为空
      currentChatId: ''
    })
  },

  // 加载历史对话
  async loadChat(chatId) {
    if (!chatId) {
      console.error('加载对话失败: chatId 为空');
      wx.showToast({
        title: '无效的对话ID',
        icon: 'error'
      });
      return;
    }
    
    console.log('开始加载历史对话，chatId:', chatId);
    
    // 显示加载中提示
    wx.showLoading({
      title: '加载对话中...',
    });
    
    try {
      const db = wx.cloud.database()
      const userInfo = wx.getStorageSync('userInfo') || {}
      const openid = userInfo.openid || ''
      
      // 优先从云数据库加载
      const cloudResult = await db.collection('History').where({
        id: chatId,
        openid: openid
      }).get()
      
      let chat = null
      
      if (cloudResult.data && cloudResult.data.length > 0) {
        console.log('从云数据库加载对话成功');
        chat = cloudResult.data[0]
      } else {
        console.log('云数据库中未找到对话，尝试从本地加载');
        // 从本地存储加载
        const chats = wx.getStorageSync('chats') || {};
        chat = chats[chatId];
      }
      
      if (chat && chat.messages && chat.messages.length > 0) {
        console.log('找到对话, 标题:', chat.title, '消息数:', chat.messages.length);
        
        const messages = chat.messages.map(msg => ({
          ...msg,
          type: msg.type === 'assistant' ? 'counselor' : msg.type
        }));

        this.setData({
          messages: messages,
          currentChatId: chatId
        }, () => {
          // 隐藏加载中提示
          wx.hideLoading();
          
          console.log('对话加载完成，消息数量:', messagesWithAvatar.length);
          
          // 滚动到最新消息
          if (messagesWithAvatar.length > 0) {
            const lastMsg = messagesWithAvatar[messagesWithAvatar.length - 1];
            this.setData({
              scrollToMessage: `msg-${lastMsg.id}`
            });
          }
          
          // 显示成功提示
          wx.showToast({
            title: '历史对话已加载',
            icon: 'success',
            duration: 1500
          });
        });
      } else {
        // 隐藏加载中提示
        wx.hideLoading();
        
        console.warn('对话不存在或为空，chatId:', chatId);
        wx.showToast({
          title: '对话不存在',
          icon: 'error'
        });
        this.initMessages();
      }
    } catch (error) {
      // 隐藏加载中提示
      wx.hideLoading();
      
      console.error('加载对话失败:', error);
      
      // 如果云数据库加载失败，尝试从本地加载
      try {
        const chats = wx.getStorageSync('chats') || {};
        const chat = chats[chatId];
        
        if (chat && chat.messages && chat.messages.length > 0) {
          const messagesWithAvatar = chat.messages.map(msg => ({
            ...msg,
            avatar: msg.type === 'user' ? '/images/user-avatar.png' : '/images/ai-avatar.png'
          }));
          
          this.setData({
            messages: messagesWithAvatar,
            currentChatId: chatId
          });
          
          wx.showToast({
            title: '历史对话已加载',
            icon: 'success',
            duration: 1500
          });
        } else {
          wx.showToast({
            title: '加载对话失败',
            icon: 'error'
          });
          this.initMessages();
        }
      } catch (localError) {
        wx.showToast({
          title: '加载对话失败',
          icon: 'error'
        });
        this.initMessages();
      }
    }
  },

  // 保存对话
  async saveChat() {
    console.log('开始保存对话...');
    
    try {
      // 确保云环境已初始化
      if (!wx.cloud) {
        console.error('云开发未启用');
        throw new Error('云开发未启用');
      }
      
      // 检查并初始化云环境
      try {
        await wx.cloud.init({
          env: 'cloud1-1gjz5ckoe28a6c4a',
          traceUser: true
        });
        console.log('云环境初始化检查完成');
      } catch (initError) {
        console.log('云环境可能已初始化:', initError.message);
      }
      
      const { currentChatId, messages, userInfo } = this.data
      console.log('当前对话数据:', {
        currentChatId,
        messagesCount: messages.length,
        userInfo: userInfo
      });
      
      const db = wx.cloud.database()
      const storedUserInfo = wx.getStorageSync('userInfo') || {}
      const openid = userInfo?.openid || storedUserInfo.openid || ''
      
      console.log('获取到的openid:', openid);
      
      if (!openid) {
        console.warn('警告: openid为空，可能影响数据保存');
      }
      
      // 如果没有对话ID，创建新的
      const chatId = currentChatId || `chat_${Date.now()}`
      console.log('使用的chatId:', chatId);
      
      const chatTitle = await this.generateChatTitle(messages);
      console.log('生成的对话标题:', chatTitle);
      
      const chatData = {
        id: chatId,
        messages: messages,
        lastUpdate: Date.now(),
        title: chatTitle,
        openid: openid
      }
      
      console.log('准备保存的对话数据:', {
        id: chatData.id,
        messagesCount: chatData.messages.length,
        title: chatData.title,
        openid: chatData.openid,
        lastUpdate: new Date(chatData.lastUpdate).toLocaleString()
      });
      
      // 保存到云数据库
      if (currentChatId) {
        console.log('更新现有对话到云数据库...');
        const updateResult = await db.collection('History').where({
          id: chatId,
          openid: chatData.openid
        }).update({
          data: {
            messages: messages,
            lastUpdate: Date.now(),
            title: chatData.title
          }
        })
        console.log('云数据库更新结果:', updateResult);
      } else {
        console.log('创建新对话到云数据库...');
        const addResult = await db.collection('History').add({
          data: chatData
        })
        console.log('云数据库添加结果:', addResult);
      }
      
      // 同时保存到本地存储（兼容性）
      console.log('保存到本地存储...');
      const chats = wx.getStorageSync('chats') || {}
      chats[chatId] = chatData
      wx.setStorageSync('chats', chats)
      console.log('本地存储保存成功');
      
      this.setData({ currentChatId: chatId })
      console.log('对话保存完成，chatId:', chatId);
      
    } catch (error) {
      console.error('保存对话到云数据库失败:', error);
      console.error('错误详情:', {
        message: error.message,
        errCode: error.errCode,
        errMsg: error.errMsg
      });
      
      // 如果云数据库保存失败，至少保存到本地
      try {
        console.log('尝试仅保存到本地存储...');
        const { currentChatId, messages } = this.data
        const chats = wx.getStorageSync('chats') || {}
        const chatId = currentChatId || `chat_${Date.now()}`
        
        chats[chatId] = {
          id: chatId,
          messages: messages,
          lastUpdate: Date.now(),
          title: await this.generateChatTitle(messages)
        }
        
        wx.setStorageSync('chats', chats)
        this.setData({ currentChatId: chatId })
        console.log('本地存储保存成功（备用方案）');
        
      } catch (localError) {
        console.error('本地保存也失败:', localError)
      }
    }
  },

  // 生成对话标题
  async generateChatTitle(messages) {
    try {
      // 如果消息少于2条，使用简单规则
      if (messages.length < 2) {
        const firstUserMessage = messages.find(msg => msg.type === 'user')
        if (firstUserMessage) {
          return firstUserMessage.content.slice(0, 20) + (firstUserMessage.content.length > 20 ? '...' : '')
        }
        return '新对话'
      }
      
      // 使用AI生成标题
      const conversationSummary = messages.slice(0, 4).map(msg => 
        `${msg.type === 'user' ? '用户' : 'AI'}: ${msg.content.slice(0, 100)}`
      ).join('\n')
      
      const titlePrompt = `请为以下对话生成一个简洁的标题（不超过15个字）：\n\n${conversationSummary}\n\n要求：\n1. 标题要概括对话的主要内容\n2. 不超过15个字\n3. 不要包含标点符号\n4. 直接返回标题，不要其他内容`
      
      const result = await apiService.chat([{
        role: 'user',
        content: titlePrompt
      }])
      
      if (result && result.choices && result.choices[0] && result.choices[0].message) {
        const aiTitle = result.choices[0].message.content.trim()
        // 确保标题不超过15个字
        return aiTitle.slice(0, 15)
      }
    } catch (error) {
      console.error('AI生成标题失败:', error)
    }
    
    // 如果AI生成失败，使用默认规则
    const firstUserMessage = messages.find(msg => msg.type === 'user')
    if (firstUserMessage) {
      return firstUserMessage.content.slice(0, 15) + (firstUserMessage.content.length > 15 ? '...' : '')
    }
    return '新对话'
  },

  // 新建对话
  onNewChat() {
    wx.showModal({
      title: '新建对话',
      content: '确定要开始新的对话吗？当前对话将被保存。',
      success: (res) => {
        if (res.confirm) {
          this.saveChat() // 保存当前对话
          this.initMessages() // 初始化新对话
        }
      }
    })
  },

  // 切换图像生成开关
  onToggleImageGeneration() {
    const enabled = !this.data.imageGenerationEnabled
    this.setData({
      imageGenerationEnabled: enabled
    })
    
    wx.showToast({
      title: enabled ? '图像生成已开启' : '图像生成已关闭',
      icon: 'success',
      duration: 1500
    })
  },

  // 生成与对话相关的图像
  async generateContextualImage(userMessage, aiResponse) {
    if (!this.data.imageGenerationEnabled) {
      return
    }
    
    try {
      this.setData({ isGeneratingImage: true })
      
      // 构建图像生成提示词
      const imagePrompt = await this.buildImagePrompt(userMessage, aiResponse)
      console.log('图像生成提示词:', imagePrompt)
      
      // 调用图像生成API（同步调用）
      const generateResult = await apiService.generateImage(imagePrompt, {
        size: '1328*1328',
        prompt_extend: true,
        watermark: true
      })
      
      if (generateResult.success && generateResult.imageUrl) {
        console.log('图像生成完成:', generateResult.imageUrl)
        this.setData({ 
          latestImageUrl: generateResult.imageUrl,
          isGeneratingImage: false 
        })
        wx.showToast({
          title: '图像生成成功',
          icon: 'success'
        })
      } else {
        console.error('图像生成失败:', generateResult.error)
        this.setData({ isGeneratingImage: false })
        wx.showToast({
          title: generateResult.error || '图像生成失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('图像生成失败:', error)
      this.setData({ isGeneratingImage: false })
      
      wx.showToast({
        title: '图像生成失败',
        icon: 'error',
        duration: 2000
      })
    }
  },

  // 获取咨询师专属风格配置
  getCounselorImageStyle(counselorId) {
    const styleConfigs = {
      'dora': {
        baseStyle: '充满活力的探险风格',
        colorPalette: '明亮的橙色、黄色、绿色',
        atmosphere: '阳光明媚、积极向上、充满好奇心',
        scene: '热带丛林、探险场景、自然风光',
        emotion: '友善、好奇、积极、充满正能量',
        artStyle: '明亮欢快的卡通插画风格'
      },
      'lazy_goat': {
        baseStyle: '温馨慵懒的田园风格',
        colorPalette: '柔和的粉色、淡绿色、米白色',
        atmosphere: '宁静舒适、温馨惬意、放松自在',
        scene: '草原牧场、温馨小屋、午后阳光',
        emotion: '温和、放松、治愈、安心',
        artStyle: '温馨治愈的水彩画风格'
      },
      'grey_wolf': {
        baseStyle: '坚韧不拔的励志风格',
        colorPalette: '深蓝色、银灰色、橙红色',
        atmosphere: '坚定有力、永不放弃、充满斗志',
        scene: '山峰顶端、实验室、奋斗场景',
        emotion: '坚韧、励志、不屈不挠、积极进取',
        artStyle: '富有力量感的现代插画风格'
      },
      'boonie_bear_xiongda': {
        baseStyle: '沉稳可靠的森林守护风格',
        colorPalette: '深绿色、棕色、金黄色',
        atmosphere: '沉着冷静、可靠稳重、自然和谐',
        scene: '茂密森林、山间小径、自然保护区',
        emotion: '沉稳、可靠、理性、守护',
        artStyle: '自然写实的森林系插画风格'
      },
      'boonie_bear_xionger': {
        baseStyle: '憨厚可爱的温暖风格',
        colorPalette: '暖黄色、浅棕色、粉橙色',
        atmosphere: '温暖可爱、憨厚朴实、充满爱心',
        scene: '温馨小屋、花园、温暖的家',
        emotion: '憨厚、可爱、温暖、安慰',
        artStyle: '温暖可爱的卡通风格'
      }
    }
    
    return styleConfigs[counselorId] || {
      baseStyle: '温馨的心理咨询风格',
      colorPalette: '柔和的蓝色、绿色、白色',
      atmosphere: '宁静祥和、温馨治愈',
      scene: '心理咨询室、温馨场景',
      emotion: '温暖、支持、理解',
      artStyle: '温馨治愈的插画风格'
    }
  },

  // 构建图像生成提示词
  async buildImagePrompt(userMessage, aiResponse) {
    try {
      // 获取当前咨询师的风格配置
      const counselorStyle = this.getCounselorImageStyle(this.data.counselor.id)
      
      // 使用AI来生成更好的图像提示词
      const promptGenerationMessage = `请根据以下对话内容和咨询师风格特色，生成一个适合用于AI图像生成的提示词。

咨询师风格特色：
- 基础风格：${counselorStyle.baseStyle}
- 色彩搭配：${counselorStyle.colorPalette}
- 氛围营造：${counselorStyle.atmosphere}
- 场景设定：${counselorStyle.scene}
- 情感表达：${counselorStyle.emotion}
- 艺术风格：${counselorStyle.artStyle}

对话内容：
用户消息：${userMessage}
AI回复：${aiResponse}

要求：
1. 提示词应该具体、生动、富有视觉表现力
2. 必须融入咨询师的专属风格特色
3. 结合对话内容的情感主题
4. 提示词长度控制在120字以内
5. 直接返回提示词，不要其他解释

请生成图像提示词：`

      const response = await apiService.chat([
        {
          role: 'user',
          content: promptGenerationMessage
        }
      ])

      if (response && response.choices && response.choices[0]) {
        const generatedPrompt = response.choices[0].message.content.trim()
        return generatedPrompt
      } else {
        // 如果AI生成失败，使用基于咨询师风格的默认提示词
        return `${counselorStyle.artStyle}，${counselorStyle.scene}，${counselorStyle.colorPalette}，${counselorStyle.atmosphere}，体现${userMessage.substring(0, 20)}的主题`
      }
    } catch (error) {
      console.error('构建图像提示词失败:', error)
      // 返回基于咨询师风格的简单提示词
      const counselorStyle = this.getCounselorImageStyle(this.data.counselor.id)
      return `${counselorStyle.artStyle}，${counselorStyle.atmosphere}，体现情感支持的主题`
    }
  },

  // 图片预览
  previewImage(e) {
    const src = this.data.latestImageUrl || e.currentTarget.dataset.src
    if (src) {
      wx.previewImage({
        urls: [src],
        current: src
      })
    }
  },



  // 输入框内容变化
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 发送消息
  async onSend() {
    const { inputValue, messages } = this.data
    if (!inputValue.trim()) return

    console.log('开始处理用户消息:', inputValue)

    // 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      avatar: '/images/user-avatar.png'
    }
    this.setData({
      messages: [...messages, userMessage],
      inputValue: '',
      scrollToMessage: `msg-${userMessage.id}`
    })

    // 显示加载状态
    this.setData({ isLoading: true })

    try {
      // 调用AI接口
      const response = await this.callAI(inputValue)
      
      // 处理AI回复
      await this.handleAIResponse(response, inputValue)
      
      // 保存对话
      this.saveChat()
    } catch (error) {
      console.error('API调用失败：', error)
      wx.showToast({
        title: '抱歉，我遇到了一些问题',
        icon: 'error'
      })
    } finally {
      this.setData({ isLoading: false })
    }
  },

  // 调用AI接口
  async callAI(input) {
    const { messages, counselor } = this.data;
    const systemPrompt = `你现在扮演的角色是 “${counselor.name}”。\n你的角色设定是：“${counselor.description}”。\n请你严格按照这个角色设定进行对话，以相应的语气和风格回复用户。你的核心任务是倾听并为用户提供心理上的支持。`;
    const apiMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ]

    try {
      console.log('开始调用API...')
      
      // 使用API服务调用聊天接口
      const result = await apiService.chat(apiMessages)
      
      console.log('API调用结果:', result)

      if (result.error) {
        throw new Error(`API错误: ${result.error.message || result.error}`)
      }

      if (!result.choices || !result.choices[0] || !result.choices[0].message) {
        throw new Error('API返回数据格式错误')
      }

      const aiResponse = result.choices[0].message.content
      
      // 处理markdown格式
      const formattedResponse = this.formatMarkdown(aiResponse)
      
      return {
        content: formattedResponse,
        recommendations: []
      }
    } catch (error) {
      console.error('API调用错误详情:', error)
      throw new Error(`API调用失败: ${error.message || '未知错误'}`)
    }
  },

  // 格式化markdown文本
  formatMarkdown(text) {
    if (!text) return ''

    // 处理加粗
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // 处理列表
    text = text.replace(/^- (.*?)$/gm, '• $1')
    
    // 处理引用
    text = text.replace(/^> (.*?)$/gm, '📌 $1')
    
    // 处理换行
    text = text.replace(/\n/g, '<br>')
    
    return text
  },

  // 滚动到顶部
  onScrollToUpper() {
    // TODO: 加载历史消息
    console.log('加载历史消息')
  },

  // 处理AI回复
  async handleAIResponse(response, input) {
    // 添加AI回复到消息列表
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response.content,
      avatar: '/images/ai-avatar.png'
    }

    this.setData({
      messages: [...this.data.messages, aiMessage],
      scrollToMessage: `msg-${aiMessage.id}`
    })
    
    // 如果启用了图像生成，生成相关图像
    if (this.data.imageGenerationEnabled) {
      this.generateContextualImage(input, response.content)
    }
  }
})