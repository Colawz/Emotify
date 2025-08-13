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
    // 弹窗相关数据
    showPublishPopup: false,
    publishInfo: {
      type: '',
      title: '',
      from: '',
      to: '',
      time: '',
      seats: '',
      price: '',
      sportType: '',
      location: '',
      players: '',
      level: '',
      remark: ''
    },
    // 意图识别关键词
    intentKeywords: {
      carpool: ['拼车', '打车', '顺风车', '车', '出行', '回家', '返校', '去学校', '去机场', '去车站', '找人拼车', '找车'],
      sports: ['运动', '打球', '篮球', '足球', '羽毛球', '乒乓球', '健身', '跑步', '游泳', '网球', '约球', '找球友'],
      food: ['吃', '美食', '餐厅', '食堂', '外卖', '推荐', '好吃', '午饭', '晚饭', '早餐', '夜宵', '找饭友'],
      study: ['学习', '自习', '考研', '考试', '图书馆', '教室', '作业', '复习', '补课', '辅导', '找学习伙伴'],
      counseling: ['心理咨询', '心理', '压力', '焦虑', '抑郁', '情绪', '烦恼', '困扰', '找心理老师'],
      dorm: ['宿舍', '室友', '住宿', '租房', '合租', '公寓', '找室友'],
      activity: ['活动', '社团', '比赛', '讲座', '演出', '展览', '志愿者', '找活动'],
      // 情绪识别关键词
      anxiety: ['焦虑', '担心', '紧张', '不安', '烦躁', '坐立不安', '心慌', '害怕', '恐惧', '担忧', '压力', '喘不过气', '提心吊胆'],
      depression: ['抑郁', '沮丧', '低落', '难过', '悲伤', '绝望', '无助', '空虚', '无趣', '疲惫', '没精神', '想哭', '自责', '内疚', '无价值'],
      anger: ['生气', '愤怒', '恼火', '暴躁', '发火', '怒气', '怨恨', '不满', '委屈', '愤恨', '易怒', '烦躁'],
      loneliness: ['孤独', '寂寞', '孤单', '被孤立', '没人理解', '无助', '空虚', '没朋友', '被抛弃', '疏离'],
      stress: ['压力大', '疲惫', '累', '崩溃', '撑不住', '负荷', '紧张', '失眠', '头疼', '胃疼', '身体不舒服'],
      happiness: ['开心', '快乐', '高兴', '兴奋', '幸福', '满足', '喜悦', '愉快', '轻松', '舒服', '自在'],
      love: ['喜欢', '爱', '心动', '暗恋', '表白', '失恋', '分手', '单恋', '相思', '思念'],
      confusion: ['迷茫', '困惑', '不知道', '不确定', '纠结', '犹豫', '选择困难', '方向', '未来', '前途'],
      guilt: ['内疚', '后悔', '自责', '惭愧', '对不起', '羞愧', '负罪感', '良心不安'],
      fear: ['害怕', '恐惧', '担心', '胆怯', '退缩', '不敢', '恐慌', '惊吓', '噩梦']
    },
    // 意图对应的页面和提示信息
    intentPages: {
      carpool: {
        path: '/pages/discover/carpool/index',
        title: '拼车匹配',
        publishTip: '是否需要发布拼车信息？',
        viewTip: '是否需要查看拼车信息？'
      },
      sports: {
        path: '/pages/discover/sports-team/index',
        title: '体育运动',
        publishTip: '是否需要发布运动组队信息？',
        viewTip: '是否需要查看运动组队信息？'
      },
      food: {
        path: '/pages/discover/canteen-review/index',
        title: '食堂点评',
        publishTip: '是否需要发布食堂点评？',
        viewTip: '是否需要查看食堂点评？'
      },
      study: {
        path: '/pages/study/index',
        title: '学习伙伴',
        publishTip: '是否需要发布学习伙伴招募？',
        viewTip: '是否需要查看学习伙伴信息？'
      },
      counseling: {
        path: '/pages/counseling/index',
        title: '心理咨询',
        publishTip: '是否需要预约心理咨询？',
        viewTip: '是否需要查看心理咨询信息？'
      },
      dorm: {
        path: '/pages/discover/dorm-matching/index',
        title: '宿舍匹配',
        publishTip: '是否需要发布宿舍匹配信息？',
        viewTip: '是否需要查看宿舍匹配信息？'
      },
      activity: {
        path: '/pages/discover/index',
        title: '活动发现',
        publishTip: '是否需要发布活动信息？',
        viewTip: '是否需要查看活动信息？'
      },
      // 情绪对应的处理页面和提示信息
      anxiety: {
        path: '/pages/counseling/index',
        title: '焦虑情绪疏导',
        tip: '我注意到您提到了焦虑的情绪，是否需要专业的心理支持？'
      },
      depression: {
        path: '/pages/counseling/index',
        title: '抑郁情绪关怀',
        tip: '感受到您的低落情绪，让我为您提供一些温暖的陪伴和建议'
      },
      anger: {
        path: '/pages/counseling/index',
        title: '愤怒情绪管理',
        tip: '生气是很正常的情绪，让我们一起找到平静下来的方法'
      },
      loneliness: {
        path: '/pages/counseling/index',
        title: '孤独情绪陪伴',
        tip: '孤独的感觉很难受，我在这里陪伴您，一起聊聊好吗？'
      },
      stress: {
        path: '/pages/counseling/index',
        title: '压力释放指导',
        tip: '看起来您承受了很大压力，需要一些放松和减压的建议吗？'
      },
      happiness: {
        path: '/pages/counseling/index',
        title: '积极情绪分享',
        tip: '为您感到高兴！愿意分享这份喜悦，或者聊聊如何保持好心情吗？'
      },
      love: {
        path: '/pages/counseling/index',
        title: '情感关系咨询',
        tip: '感情的事最复杂了，需要聊聊您的情感困扰吗？'
      },
      confusion: {
        path: '/pages/counseling/index',
        title: '人生困惑解答',
        tip: '迷茫的时候最需要指引，让我们一起找到前进的方向'
      },
      guilt: {
        path: '/pages/counseling/index',
        title: '内疚情绪疏导',
        tip: '内疚感让人很难受，让我们一起学会原谅自己'
      },
      fear: {
        path: '/pages/counseling/index',
        title: '恐惧情绪克服',
        tip: '害怕的感觉我理解，让我们一起面对和克服这些恐惧'
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
        content: `你是一个温暖的心理支持助手，专门帮助用户处理各种情绪问题。
        你的核心任务是：
        1. **识别和理解用户的情绪状态**（焦虑、抑郁、愤怒、孤独、压力、快乐、爱恋、困惑、内疚、恐惧等）
        2. **提供情绪支持和安慰**，让用户感受到被理解和接纳
        3. **给出实用的情绪调节建议**，帮助用户更好地管理自己的情绪
        4. **在适当时机引导用户寻求专业帮助**

        请使用温柔、理解、不评判的语气与用户交流。当识别到用户有严重情绪困扰时，请温和地建议他们寻求专业心理咨询。

        回答格式要求：
        - 使用**情绪标签**来标注识别到的主要情绪
        - 用❤️表达关心和理解
        - 使用- 列出具体的建议或方法
        - 用> 引用用户的情绪表达以示重视
        - 保持温暖、耐心的交流风格`
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

  // 识别用户意图
  // 修改recognizeIntent函数，使其更适合情绪识别
  recognizeIntent(input) {
    console.log('开始识别情绪, 输入:', input)
    const { intentKeywords } = this.data
    const emotions = []
    
    // 将输入文本转换为小写以进行不区分大小写的匹配
    const lowerInput = input.toLowerCase()
    
    for (const [emotion, keywords] of Object.entries(intentKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        const hasKeyword = lowerInput.includes(keyword.toLowerCase())
        if (hasKeyword) {
          console.log('匹配到情绪关键词:', keyword, '情绪:', emotion)
        }
        return acc + (hasKeyword ? 1 : 0)
      }, 0)
      
      if (score > 0) {
        console.log('情绪得分:', emotion, score)
        emotions.push({ type: emotion, score })
      }
    }

    // 按分数排序
    emotions.sort((a, b) => b.score - a.score)
    
    // 只有当最高分数的情绪得分大于0时才返回
    const result = emotions[0]?.score > 0 ? emotions[0].type : null
    console.log('最终识别的情绪:', result)
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

    // 情绪识别后的处理方式：询问是否需要情绪支持
    console.log('准备询问是否需要情绪支持:', pageInfo.title)
    wx.showModal({
      title: '情绪识别提示',
      content: pageInfo.tip,
      confirmText: '需要支持',
      cancelText: '继续聊聊',
      success: (res) => {
        if (res.confirm) {
          console.log('用户确认需要情绪支持')
          // 跳转到心理咨询页面
          wx.navigateTo({
            url: pageInfo.path
          })
        } else if (res.cancel) {
          console.log('用户选择继续聊天')
          // 用户选择继续与AI聊天，不执行跳转
        }
      },
      fail: (error) => {
        console.error('显示情绪支持确认弹窗失败:', error)
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
      canteen: '/pages/discover/canteen-review/index',
      carpool: '/pages/discover/carpool/index',
      sports: '/pages/discover/sports-team/index',
      study: '/pages/discover/study-partner/index',
      dorm: '/pages/discover/dorm-matching/index',
      food: '/pages/discover/canteen-review/index', // 'food' is an alias for 'canteen'
      counseling: '/pages/counseling/index',
      activity: '/pages/discover/index', // General discovery page
      job: '/pages/job/index' // Assuming a job page exists
    };
    
    let url = routes[type];

    if (routes[type]) {
      console.log('准备跳转到页面:', routes[type])
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

  // 关闭弹窗
  onPopupClose() {
    this.setData({
      showPublishPopup: false
    })
  },

  // 处理输入框变化
  onFromChange(e) {
    this.setData({
      'publishInfo.from': e.detail.value
    })
  },

  onToChange(e) {
    this.setData({
      'publishInfo.to': e.detail.value
    })
  },

  onTimeChange(e) {
    this.setData({
      'publishInfo.time': e.detail.value
    })
  },

  onSeatsChange(e) {
    this.setData({
      'publishInfo.seats': e.detail.value
    })
  },

  onPriceChange(e) {
    this.setData({
      'publishInfo.price': e.detail.value
    })
  },

  onSportTypeChange(e) {
    this.setData({
      'publishInfo.sportType': e.detail.value
    })
  },

  onLocationChange(e) {
    this.setData({
      'publishInfo.location': e.detail.value
    })
  },

  onPlayersChange(e) {
    this.setData({
      'publishInfo.players': e.detail.value
    })
  },

  onLevelChange(e) {
    this.setData({
      'publishInfo.level': e.detail.value
    })
  },

  onRemarkChange(e) {
    this.setData({
      'publishInfo.remark': e.detail.value
    })
  },

  // 生成推荐卡片
  generateRecommendations(intent, input) {
    console.log('生成推荐卡片，意图:', intent, '输入:', input);
    
    const recommendations = []
    const intentConfig = this.data.intentPages[intent]
    
    if (intentConfig) {
      // 根据意图类型生成不同的推荐卡片
      if (['carpool', 'sports', 'food', 'study', 'dorm', 'activity'].includes(intent)) {
        // 功能类推荐卡片
        recommendations.push({
          id: `rec_${Date.now()}_1`,
          type: 'action',
          title: intentConfig.publishTip || '发布信息',
          action: 'publish',
          intent: intent,
          icon: this.getIntentIcon(intent)
        })
        
        recommendations.push({
          id: `rec_${Date.now()}_2`,
          type: 'action', 
          title: intentConfig.viewTip || '查看信息',
          action: 'view',
          intent: intent,
          icon: this.getIntentIcon(intent)
        })
      } else if (['anxiety', 'depression', 'anger', 'loneliness', 'stress', 'happiness', 'love', 'confusion', 'guilt', 'fear', 'counseling'].includes(intent)) {
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
      }
    }
    
    console.log('生成的推荐卡片:', recommendations);
    return recommendations
  },

  // 获取意图对应的图标
  getIntentIcon(intent) {
    const iconMap = {
      carpool: '🚗',
      sports: '⚽',
      food: '🍽️',
      study: '📚',
      dorm: '🏠',
      activity: '🎉',
      counseling: '💝',
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
  },

  // 发布信息
  async onPublish() {
    const { publishInfo } = this.data
    try {
      // 调用发布接口
      const response = await apiService.publishInfo(publishInfo)
      
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      })
      
      // 关闭弹窗
      this.onPopupClose()
      
      // 跳转到对应页面
      this.navigateToPage(publishInfo.type)
    } catch (error) {
      console.error('发布失败：', error)
      wx.showToast({
        title: '发布失败',
        icon: 'error'
      })
    }
  }
})