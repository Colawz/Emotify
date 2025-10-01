const app = getApp()
const apiService = require('../../../services/api')

Page({
  data: {
    userInfo: null,
    messages: [],
    inputValue: '',
    isLoading: false,
    scrollToMessage: '',
    currentChatId: '', // 当前对话ID

    // 意图识别关键词
    intentKeywords: {

      counseling: ['counseling', 'psychology', 'pressure', 'anxiety', 'depression', 'emotion', 'trouble', 'distress', 'find counselor'],

      // 新增导航功能关键词
      treehole: ['treehole', 'confide', 'talk', 'share feelings', 'pour out', 'vent', 'tell someone', 'need to talk', 'someone to listen', 'emotional support', '倾诉', '树洞', '说话', '聊聊', '倾吐', 'VENT'],
      diary: ['diary', 'mood diary', 'record mood', 'write diary', 'today feeling', 'mood record', 'emotional diary', 'feelings', '日记', '心情日记', '记录心情', '写日记', '今天心情', '情绪记录'],
      familyTasks: ['family tasks', 'medication reminder', 'remind mom', 'remind dad', 'family reminder', 'take medicine', 'health reminder', 'care reminder', '家庭任务', '吃药提醒', '提醒妈妈', '提醒爸爸', '家庭提醒', '服药提醒', '健康提醒'],
      chatTogether: ['chat together', 'young people', 'find someone to chat', 'companion', 'talk with young people', 'need company', 'social chat', '年轻人聊天', '找人聊天', '陪聊', '聊天陪伴', '需要陪伴', '社交聊天'],
      stickman: ['stress relief', 'release pressure', 'vent anger', 'stress release', 'relax', 'decompress', 'blow off steam', '压力释放', '释放压力', 'VENT', '减压', '放松', '舒缓压力'],
      warmSpace: ['family tree', 'water tree', 'family activities', 'family album', 'family photos', 'what family did today', 'family memories', '家庭小树', '浇水', '家人活动', '家庭相册', '家庭照片', '家人今天做了什么', '家庭回忆'],
      // 情绪识别关键词
      anxiety: ['anxiety', 'anxious', 'worry', 'worried', 'nervous', 'restless', 'panic', 'scared', 'fear', 'fearful', 'stress', 'stressed', '焦虑', '担心', '紧张', '不安', '恐慌', '害怕', '压力', '焦躁', '忧虑', '惊慌'],
      depression: ['depression', 'depressed', 'sad', 'down', 'upset', 'hopeless', 'helpless', 'empty', 'tired', 'exhausted', 'cry', 'guilt', 'worthless', '抑郁', '沮丧', '难过', '伤心', '绝望', '无助', '空虚', '疲惫', '哭泣', '内疚', '无价值感', '低落'],
      anger: ['anger', 'angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'rage', 'resentment', 'dissatisfied', '愤怒', '生气', '恼火', '暴怒', '烦躁', '不满', '挫败', '愤恨', '怨恨', '不爽'],
      loneliness: ['lonely', 'loneliness', 'alone', 'isolated', 'misunderstood', 'helpless', 'empty', 'no friends', 'abandoned', 'alienated', '孤独', '寂寞', '独自', '孤立', '被误解', '无助', '空虚', '没朋友', '被抛弃', '疏离'],
      stress: ['stress', 'stressed', 'pressure', 'tired', 'exhausted', 'overwhelmed', 'breakdown', 'insomnia', 'headache', 'stomachache', 'uncomfortable', '压力', '紧张', '疲惫', '累', '不堪重负', '崩溃', '失眠', '头痛', '胃痛', '不舒服'],
      happiness: ['happy', 'happiness', 'joy', 'joyful', 'excited', 'cheerful', 'pleased', 'satisfied', 'content', 'relaxed', 'comfortable', '开心', '快乐', '高兴', '兴奋', '愉快', '满意', '满足', '放松', '舒适', '喜悦'],
      love: ['love', 'like', 'crush', 'confession', 'breakup', 'heartbreak', 'miss', 'missing', 'relationship', '爱', '喜欢', '暗恋', '表白', '分手', '心碎', '想念', '思念', '恋爱', '感情'],
      confusion: ['confused', 'confusion', 'lost', 'uncertain', 'unsure', 'hesitate', 'indecisive', 'direction', 'future', 'career', '困惑', '迷茫', '不确定', '犹豫', '优柔寡断', '方向', '未来', '职业', '不知所措', '茫然'],
      guilt: ['guilt', 'guilty', 'regret', 'sorry', 'ashamed', 'shame', 'remorse', 'self-blame', '内疚', '愧疚', '后悔', '抱歉', '羞愧', '羞耻', '懊悔', '自责', '悔恨'],
      fear: ['fear', 'afraid', 'scared', 'frightened', 'terrified', 'panic', 'nightmare', 'phobia', '恐惧', '害怕', '惊吓', '恐慌', '噩梦', '恐怖', '畏惧', '胆怯', '惊恐']
    },
    // 意图对应的页面和提示信息
    intentPages: {

      counseling: {
        path: '/pages/counseling/index',
        title: '心理咨询服务',
        publishTip: '您需要预约心理咨询吗？',
        viewTip: '您想查看心理咨询信息吗？'
      },
      // 新增导航功能页面配置
      treehole: {
        path: '/pages/counseling/treehole/index',
        title: '情感树洞',
        tip: '我理解您需要有人倾听。树洞是一个安全的空间，您可以在这里自由地分享您的感受。'
      },
      diary: {
        path: '/pages/counseling/diary/index',
        title: '心情日记',
        tip: '记录每日心情是更好了解自己的好方法。您想写心情日记吗？'
      },
      familyTasks: {
        path: '/pages/family-garden/task-management/index',
        title: '家庭关爱任务',
        tip: '照顾家人真是太贴心了！让我帮您为亲人设置提醒吧。'
      },
      chatTogether: {
        path: '/pages/family-garden/chat-together/index',
        title: '与年轻朋友聊天',
        tip: '与年轻人交流可以带来新鲜的视角和活力。您想找人聊天吗？'
      },
      stickman: {
        path: '/pages/counseling/stickman/index',
        title: '压力释放空间',
        tip: '每个人都需要释放压力。这是一个安全的空间，您可以在这里自由地发泄情绪。'
      },
      warmSpace: {
        path: '/pages/family-garden/warm-space/index',
        title: '家庭温馨空间',
        tip: '家庭时光是珍贵的！您想照料家庭小树或查看家人最近的动态吗？'
      },
      // 情绪对应的处理页面和提示信息
      anxiety: {
        path: '/pages/counseling/conversation/index',
        title: '焦虑情绪支持',
        tip: '我注意到您提到了焦虑。需要带您前去寻求专业的心理支持吗？'
      },
      depression: {
        path: '/pages/counseling/conversation/index',
        title: '抑郁情绪关怀',
        tip: '我感受到了您的低落情绪。需要带您前去寻求专业的心理支持吗？'
      },
      anger: {
        path: '/pages/counseling/conversation/index',
        title: '愤怒情绪管理',
        tip: '愤怒是正常的情绪。需要带您前去寻求专业的心理支持吗？'
      },
      loneliness: {
        path: '/pages/counseling/conversation/index',
        title: '孤独感支持',
        tip: '孤独可能很痛苦。需要带您前去寻求专业的心理支持吗？'
      },
      stress: {
        path: '/pages/counseling/conversation/index',
        title: '压力缓解指导',
        tip: '看起来您承受了很大的压力。需要带您前去寻求专业的心理支持吗？'
      },
      happiness: {
        path: '/pages/counseling/conversation/index',
        title: '积极情绪分享',
        tip: '我为您感到高兴！您想分享这份喜悦或聊聊如何保持好心情吗？'
      },
      love: {
        path: '/pages/counseling/conversation/index',
        title: '情感关系咨询',
        tip: '感情关系可能很复杂。需要带您前去寻求专业的心理支持吗？'
      },
      confusion: {
        path: '/pages/counseling/conversation/index',
        title: '人生困惑指导',
        tip: '迷茫时最需要指引。需要带您前去寻求专业的心理支持吗？'
      },
      guilt: {
        path: '/pages/counseling/conversation/index',
        title: '内疚情绪咨询',
        tip: '内疚可能很痛苦。需要带您前去寻求专业的心理支持吗？'
      },
      fear: {
        path: '/pages/counseling/conversation/index',
        title: '恐惧克服支持',
        tip: '我理解恐惧的感受。需要带您前去寻求专业的心理支持吗？'
      }
      
    },
    // 用户画像
    userProfile: {
      interests: [],
      location: '',
      schedule: {},
      preferences: {}
    }
  },

  onLoad(options) {
    this.getUserInfo()
    this.loadUserProfile()
    
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

  // 获取用户信息
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
  },

  // 加载用户画像
  loadUserProfile() {
    const profile = wx.getStorageSync('userProfile')
    if (profile) {
      this.setData({ userProfile: profile })
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
        
        // 确保每条消息都有头像
        const messagesWithAvatar = chat.messages.map(msg => ({
          ...msg,
          avatar: msg.type === 'user' ? '/images/user-avatar.png' : '/images/ai-avatar.png'
        }));
        
        this.setData({
          messages: messagesWithAvatar,
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

  // 查看历史记录
  onHistoryTap() {
    console.log('=== 历史记录按钮被点击 ===');
    
    // 直接跳转到历史记录页面，无需检查登录状态
    wx.showLoading({
      title: '正在跳转...',
    });
    
    wx.navigateTo({
      url: '/pages/profile/chat-history/index',
      success: () => {
        console.log('成功跳转到历史记录页面');
        wx.hideLoading();
      },
      fail: (error) => {
        console.error('跳转历史记录页面失败:', error);
        wx.hideLoading();
        wx.showToast({
          title: '跳转失败',
          icon: 'error'
        });
      }
    })
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
      // 识别意图
      const intent = this.recognizeIntent(inputValue)
      console.log('识别到的意图:', intent)

      if (intent) {
        console.log('开始处理意图导航')
        // 处理意图导航
        await this.handleIntentNavigation(intent, inputValue)
      }

      // 调用AI接口
      const response = await this.callAI(inputValue)
      
      // 处理AI回复
      await this.handleAIResponse(response, inputValue)
      
      // 更新用户画像
      this.updateUserProfile(inputValue, response)
      
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
    const { messages } = this.data
    const apiMessages = [
      {
        role: 'system',
        // 修改系统提示词
        content: `您是"AI导航助手"，是这个小程序中的情感支持和功能导航代理。您的目标：

- 识别用户的情绪和需求，提供理解和安慰；
- 根据用户的具体情况和小程序中可用的功能，提供合适的功能建议和下一步行动；
- 当用户需要时，建议导航到相应页面（应用程序将处理实际导航）。

应用模块和主要页面（请务必熟悉并适当推荐）：

1. 心理支持与咨询
- 咨询首页：/pages/counseling/index（查看心理功能概览）
- 心理对话室：/pages/counseling/conversation/index（为焦虑、抑郁、愤怒、孤独、压力、快乐、爱情、困惑、内疚、恐惧等情绪提供陪伴和建议）
- 情感树洞：/pages/counseling/treehole/index（当您想倾诉或需要有人倾听时）
- 心情日记：/pages/counseling/diary/index（记录今天的心情和想法）
- 压力小人：/pages/counseling/stickman/index（释放压力和VENT）

2. 家庭花园
- 首页：/pages/family-garden/index（家庭功能入口）
- 家庭任务：/pages/family-garden/family-tasks/index（为家庭成员设置用药/护理提醒）
- 一起聊天：/pages/family-garden/chat-together/index（与年轻人聊天并获得陪伴）
- 智能提示：/pages/family-garden/smart-tips/index（基于场景的温馨提示）
- 温馨空间：/pages/family-garden/warm-space/index（浇灌家庭小树，浏览家庭相册和动态）

3. 个人中心
- 聊天记录：/pages/profile/chat-history/index（查看与AI的历史聊天记录）

对话风格：

- 温和、理解、不评判；先共情，再提建议；
- 专注于1-3个具体且可行的建议；
- 如果识别到严重困扰或风险，温和地建议寻求专业人士帮助。

语言和格式：

- 自动使用与用户输入相同的语言（中文或英文）；如果难以确定，默认使用中文；
- 您可以使用[情绪标签] + 简短共情 + 要点建议的结构；
- 在建议中，您可以引用页面名称，避免输出URL链接；
- 不要承诺自动导航；而是表述为"我可以带您去..."。
`
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

  // 检测输入语言
  detectLanguage(input) {
    // 简单的语言检测：如果包含中文字符则为中文，否则为英文
    const chineseRegex = /[\u4e00-\u9fa5]/
    return chineseRegex.test(input) ? 'zh' : 'en'
  },

  // 检查是否为英文输入
  isEnglishInput(input) {
    // 只有当输入不包含中文字符时才认为是英文输入
    const chineseRegex = /[\u4e00-\u9fa5]/
    return !chineseRegex.test(input)
  },

  // 识别用户意图
  // 修改recognizeIntent函数，使其更适合情绪识别
  recognizeIntent(input) {
    console.log('开始识别意图, 输入:', input)
    const { intentKeywords } = this.data
    const emotions = []
    
    // 将输入文本转换为小写以进行不区分大小写的匹配（对英文有效）
    const lowerInput = input.toLowerCase()
    
    for (const [emotion, keywords] of Object.entries(intentKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        // 对于中文关键词，直接匹配；对于英文关键词，转换为小写后匹配
        const hasKeyword = input.includes(keyword) || lowerInput.includes(keyword.toLowerCase())
        if (hasKeyword) {
          console.log('匹配到关键词:', keyword, '类别:', emotion)
        }
        return acc + (hasKeyword ? 1 : 0)
      }, 0)
      
      if (score > 0) {
        emotions.push({ type: emotion, score })
      }
    }

    emotions.sort((a, b) => b.score - a.score)
    const result = emotions[0]?.score > 0 ? emotions[0].type : null
    console.log('最终识别的类别:', result)
    return result
  },

  // 处理意图跳转
  // 修改handleIntentNavigation函数
  async handleIntentNavigation(emotion, input) {
    console.log('进入handleIntentNavigation, 情绪:', emotion)
    const { intentPages } = this.data
    const pageInfo = intentPages[emotion]

    if (!pageInfo) {
      console.log('未找到对应的情绪处理页面')
      return
    }

    console.log('准备询问是否需要功能/情绪支持:', pageInfo.title)
    wx.showModal({
      title: `前往${pageInfo.title}`,
      content: pageInfo.tip,
      confirmText: '跳转',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          console.log('用户确认前往:', pageInfo.path)
          // 检查是否为 tabbar 页面
          const tabbarPages = [
            '/pages/ai-assistant/chat/index',
            '/pages/counseling/index',
            '/pages/family-garden/index',
            '/pages/profile/index'
          ];
          
          if (tabbarPages.includes(pageInfo.path)) {
            wx.switchTab({
              url: pageInfo.path
            })
          } else {
            wx.navigateTo({
              url: pageInfo.path
            })
          }
        } else if (res.cancel) {
          console.log('用户选择继续聊天')
        }
      },
      fail: (error) => {
        console.error('显示功能/情绪支持确认弹窗失败:', error)
      }
    })
  },

  // 更新用户画像
  updateUserProfile(input, response) {
    const { userProfile } = this.data
    const intent = this.recognizeIntent(input)
    
    if (intent && !userProfile.interests.includes(intent)) {
      userProfile.interests.push(intent)
      wx.setStorageSync('userProfile', userProfile)
    }
  },

  // 点击快捷操作
  onQuickActionTap(e) {
    const { type } = e.currentTarget.dataset
    this.navigateToPage(type)
  },

  // 点击推荐卡片
  onCardTap(e) {
    const { type, action, intent } = e.currentTarget.dataset
    console.log('推荐卡片点击:', { type, action, intent });

    if (action === 'publish') {
      // 如果是发布操作，显示发布弹窗并填充草稿信息
      const targetIntent = intent || type
      // 这里的input参数可以考虑如何获取更相关的，暂时用空字符串
      const draftInfo = this.generateDraftInfo ? this.generateDraftInfo(targetIntent, '') : null
      if (draftInfo) {
        wx.nextTick(() => {
          this.setData({
            showPublishPopup: true,
            publishInfo: {
              type: targetIntent,
              title: this.data.intentPages[targetIntent]?.title || '发布信息',
              ...draftInfo.content
            }
          })
        })
      } else {
        // 如果没有草稿信息生成方法，直接跳转到对应页面
        this.navigateToPage(targetIntent)
      }
    } else if (action === 'view') {
      // 如果是查看操作，跳转到对应页面
      const targetIntent = intent || type
      this.navigateToPage(targetIntent)
    } else if (action === 'counseling') {
      // 如果是心理咨询操作，跳转到心理咨询页面
      this.navigateToPage('counseling')
    } else {
      // 默认跳转到对应页面
      const targetIntent = intent || type
      this.navigateToPage(targetIntent)
    }
  },

  // 页面跳转
  navigateToPage(type, id = '') {
    const routes = {
      counseling: '/pages/counseling/index',
      treehole: '/pages/counseling/treehole/index',
      diary: '/pages/counseling/diary/index',
      familyTasks: '/pages/family-garden/family-tasks/index',
      chatTogether: '/pages/family-garden/chat-together/index',
      stickman: '/pages/counseling/stickman/index',
      warmSpace: '/pages/family-garden/warm-space/index',
      history: '/pages/profile/chat-history/index',
      anxiety: '/pages/counseling/conversation/index',
      depression: '/pages/counseling/conversation/index',
      anger: '/pages/counseling/conversation/index',
      loneliness: '/pages/counseling/conversation/index',
      stress: '/pages/counseling/conversation/index',
      happiness: '/pages/counseling/conversation/index',
      love: '/pages/counseling/conversation/index',
      confusion: '/pages/counseling/conversation/index',
      guilt: '/pages/counseling/conversation/index',
      fear: '/pages/counseling/conversation/index'
    };
    
    // 定义 tabbar 页面列表
    const tabbarPages = [
      '/pages/ai-assistant/chat/index',
      '/pages/counseling/index',
      '/pages/family-garden/index',
      '/pages/profile/index'
    ];
    
    let url = routes[type];

    if (routes[type]) {
      console.log('准备跳转到页面:', routes[type])
      
      const isTabbarPage = tabbarPages.includes(routes[type]);
      
      if (isTabbarPage) {
        wx.switchTab({
          url: routes[type],
          success: () => {
            console.log('页面跳转成功')
          },
          fail: (error) => {
            console.error('页面跳转失败:', error)
            wx.showToast({
              title: '页面跳转失败',
              icon: 'error'
            })
          }
        })
      } else {
        // 对于非 tabbar 页面，使用 navigateTo
        wx.navigateTo({
          url: id ? `${routes[type]}?id=${id}` : routes[type],
          success: () => {
            console.log('页面跳转成功')
          },
          fail: (error) => {
            console.error('页面跳转失败:', error)
            wx.showToast({
              title: '页面跳转失败',
              icon: 'error'
            })
          }
        })
      }
    } else {
      console.warn('未知的页面类型:', type)
    }
  },

  // 点击语音按钮
  onVoiceTap() {
    // TODO: 实现语音输入
    wx.showToast({
      title: '语音输入功能开发中',
      icon: 'none'
    })
  },

  // 点击图片按钮
  onImageTap() {
    // TODO: 实现图片上传
    wx.showToast({
      title: '图片上传功能开发中',
      icon: 'none'
    })
  },

  // 滚动到顶部
  onScrollToUpper() {
    // TODO: 加载历史消息
    console.log('加载历史消息')
  },

  // 处理AI回复
  async handleAIResponse(response, input) {
    // 识别意图
    const intent = this.recognizeIntent(input)
    let recommendations = []

    if (intent) {
      // 生成推荐卡片
      recommendations = this.generateRecommendations(intent, input)
    }

    // 添加AI回复到消息列表
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response.content,
      recommendations: recommendations,
      avatar: '/images/ai-avatar.png'
    }

    this.setData({
      messages: [...this.data.messages, aiMessage],
      scrollToMessage: `msg-${aiMessage.id}`
    })
  },



  // 生成推荐卡片
  generateRecommendations(intent, input) {
    console.log('生成推荐卡片，意图:', intent, '输入:', input);
    
    const recommendations = []
    const intentConfig = this.data.intentPages[intent]
    
    if (intentConfig) {
      // 根据意图类型生成不同的推荐卡片
      if (['anxiety', 'depression', 'anger', 'loneliness', 'stress', 'happiness', 'love', 'confusion', 'guilt', 'fear', 'counseling'].includes(intent)) {
        // 情绪类推荐卡片
        recommendations.push({
          id: `rec_${Date.now()}_1`,
          type: 'emotion',
          title: intentConfig.title || '心理支持',
          tip: intentConfig.tip || '需要专业的心理支持吗？',
          action: 'counseling',
          intent: intent,
          icon: '💝'
        })
      } else if (['treehole', 'diary', 'familyTasks', 'chatTogether', 'stickman', 'warmSpace', 'history'].includes(intent)) {
        // 功能类推荐卡片
        recommendations.push({
          id: `rec_${Date.now()}_2`,
          type: 'feature',
          title: intentConfig.title,
          tip: intentConfig.tip,
          action: 'view',
          intent: intent,
          icon: this.getIntentIcon(intent)
        })
      }
    }
    
    console.log('生成的推荐卡片:', recommendations);
    return recommendations
  },

  // 获取意图对应的图标
  getIntentIcon(intent) {
    const iconMap = {
      counseling: '💝',
      treehole: '🕳️',
      diary: '📓',
      familyTasks: '⏰',
      chatTogether: '👥',
      stickman: '🧘',
      warmSpace: '🏡',
      history: '🗂️',
      anxiety: '😰',
      depression: '😢',
      anger: '😠',
      loneliness: '😔',
      stress: '😫',
      happiness: '😊',
      love: '💕',
      confusion: '🤔',
      guilt: '😞',
      fear: '😨'
    }
    return iconMap[intent] || '💡'
  }


})