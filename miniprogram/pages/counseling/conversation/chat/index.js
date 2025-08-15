const apiService = require('../../../services/api')
Page({
  data: {
    counselor: null,
    messages: [],
    inputValue: '',
    scrollToView: '',
    isLoading: false,
    isGeneratingImage: false,
    latestImageUrl: '',
    userMessageCount: 0,
  },

  onLoad(options) {
    // 确保云环境初始化
    this.ensureCloudInit();
    
    if (options.counselor) {
      const counselor = JSON.parse(options.counselor);
      this.setData({ 
        counselor: counselor
      });
      this.startNewConversation(counselor);
    }
  },

  ensureCloudInit() {
    if (!wx.cloud) {
      console.error('云开发环境不可用，请检查基础库版本');
      return;
    }
    
    // 如果云环境还没有初始化，重新初始化
    try {
      wx.cloud.init({
        env: 'cloud1-1gjz5ckoe28a6c4a',
        traceUser: true
      });
      console.log('页面级云开发初始化完成');
    } catch (error) {
      console.error('页面级云开发初始化失败:', error);
    }
  },

  onNavigateBack() {
    wx.navigateBack();
  },

  startNewConversation(counselor) {
    // 根据不同角色设置符合身份的开场白
    let greeting = '';
    switch (counselor.id) {
      case 'dora':
        greeting = '嗨！我是Dora，一个充满好奇心的小探险家！今天又发现了好多有趣的事情，你呢？有什么新鲜事想跟我分享吗？';
        break;
      case 'lazy_goat':
        greeting = '呼...我是懒羊羊，刚睡醒呢。虽然我平时很懒，但听你说话我还是很有精神的！有什么烦恼就跟我说说吧~';
        break;
      case 'grey_wolf':
        greeting = '哼！我是灰太狼，虽然抓羊总是失败，但我从不放弃！有什么困难跟我说，我帮你分析分析，一定能找到解决办法的！';
        break;
      case 'boonie_bear_xiongda':
        greeting = '你好，我是熊大。作为森林的守护者，我总是很冷静。如果你有什么烦恼或困惑，我可以帮你理清思路，找到解决问题的方法。';
        break;
      case 'boonie_bear_xionger':
        greeting = '嘿！俺是熊二！俺虽然有点笨，但俺最会安慰人啦！不管遇到啥事，跟俺 says，俺陪你一起想办法！';
        break;
      default:
        greeting = `你好！我是${counselor.name}，很高兴能和你聊天。有什么想说的吗？`;
    }
    
    this.setData({
      messages: [
        {
          id: 'msg_0',
          type: 'counselor',
          content: greeting
        }
      ],
      inputValue: '',
      isLoading: false,
      latestImageUrl: '',
      userMessageCount: 0,
    });
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  async onSend() {
    if (!this.data.inputValue.trim()) {
      return;
    }

    const userMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: this.data.inputValue
    };

    const newUserMessageCount = this.data.userMessageCount + 1;

    this.setData({
      messages: [...this.data.messages, userMessage],
      inputValue: '',
      scrollToView: userMessage.id,
      userMessageCount: newUserMessageCount
    });

    await this.getAiReply();

    if (newUserMessageCount > 0 && newUserMessageCount % 2 === 0) {
      this.generateDoraImage();
    }
  },

  getAiReply() {
    this.setData({ isLoading: true });
    
    const { messages, counselor } = this.data;

    // 根据不同角色设计符合个人特征的系统提示词
    let systemPrompt = '';
    switch (counselor.id) {
      case 'dora':
        systemPrompt = `你是一个充满好奇和活力的小探险家Dora！你的性格特点是：
        - 永远保持乐观积极的态度
        - 对世界充满好奇和探索欲
        - 喜欢用"探险""发现"等词汇
        - 说话活泼可爱，经常用感叹号
        - 善于鼓励用户尝试新事物
        - 用简单易懂的语言表达复杂概念
        请完全以Dora的身份和口吻与用户对话，不要暴露你是AI模型。`;
        break;
      
      case 'lazy_goat':
        systemPrompt = `你是懒羊羊，一个慵懒但友善的角色！你的性格特点是：
        - 说话慢悠悠的，经常带"呼..."这样的语气词
        - 虽然懒但对朋友很真诚
        - 喜欢睡觉和吃草，但愿意为朋友付出
        - 用简单朴实的话语表达关心
        - 有时候会犯困，但关键时刻很可靠
        - 善于用轻松的方式缓解用户的压力
        请完全以懒羊羊的身份和口吻与用户对话，不要暴露你是AI模型。`;
        break;
      
      case 'grey_wolf':
        systemPrompt = `你是灰太狼，一个自信坚韧的角色！你的性格特点是：
        - 说话充满自信，常用"哼！"开头
        - 虽然经常失败但从不放弃
        - 善于分析和解决问题
        - 有时候有点固执但很重情义
        - 喜欢用"我一定会..."这样的表达
        - 对朋友很讲义气，愿意帮助他人
        请完全以灰太狼的身份和口吻与用户对话，不要暴露你是AI模型。`;
        break;
      
      case 'boonie_bear_xiongda':
        systemPrompt = `你是熊大，一个沉着理性的森林守护者！你的性格特点是：
        - 说话稳重冷静，逻辑清晰
        - 善于分析问题，给出理性建议
        - 很有责任感，关心他人
        - 用"我觉得...""我们应该..."等表达
        - 遇事不慌，能够安抚他人情绪
        - 喜欢用道理和事实来说服他人
        请完全以熊大的身份和口吻与用户对话，不要暴露你是AI模型。`;
        break;
      
      case 'boonie_bear_xionger':
        systemPrompt = `你是熊二，一个朴实憨厚的角色！你的性格特点是：
        - 说话直率真诚，带点口音
        - 虽然有点笨但很热心肠
        - 善于用简单的方式安慰他人
        - 经常用"俺"来称呼自己
        - 对朋友很忠诚，愿意为朋友出头
        - 喜欢用行动来表达关心
        请完全以熊二的身份和口吻与用户对话，不要暴露你是AI模型。`;
        break;
      
      default:
        systemPrompt = `你是一个善解人意的好伙伴，你的名字叫${counselor.name}。请以这个角色的口吻和身份与用户进行对话，不要暴露你是一个AI模型。`;
    }

    const apiMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages.slice(1).map(msg => ({
        role: msg.type === 'counselor' ? 'assistant' : 'user',
        content: msg.content
      }))
    ];

    return apiService.chat(apiMessages)
      .then(result => {
        if (result && result.choices && result.choices[0] && result.choices[0].message) {
          const aiReplyContent = result.choices[0].message.content;
          const aiReply = {
            id: `msg_${Date.now() + 1}`,
            type: 'counselor',
            content: aiReplyContent
          };
          this.setData({
            messages: [...this.data.messages, aiReply],
            scrollToView: aiReply.id
          });
        } else {
          throw new Error('AI回复格式错误');
        }
      })
      .catch(err => {
        console.error('调用AI失败', err);
        this.handleAiReplyError('抱歉，我好像走神了，请再说一遍吧。');
      })
      .finally(() => {
        this.setData({ isLoading: false });
      });
  },

  handleAiReplyError(message) {
    const errorReply = {
      id: `msg_${Date.now() + 1}`,
      type: 'counselor',
      content: message
    };
    this.setData({
      messages: [...this.data.messages, errorReply],
      scrollToView: errorReply.id
    });
  },

  generateDoraImage() {
    this.setData({ isGeneratingImage: true });

    // 确保云环境已初始化
    this.ensureCloudInit();
    
    if (!wx.cloud) {
      console.error('云开发环境不可用');
      wx.showToast({
        title: '云开发环境不可用',
        icon: 'none'
      });
      this.setData({ isGeneratingImage: false });
      return;
    }

    const fixedPrompt = '一只可爱的卡通小猫，名字叫Dora，粉色，带有赛博朋克风格的耳机。';
    
    const userMessages = this.data.messages.filter(m => m.type === 'user');
    const recentUserMessages = userMessages.slice(-2).map(m => m.content).join('; ');
    
    const finalPrompt = `${fixedPrompt} 她正在和人聊关于"${recentUserMessages}"的话题。`;
    console.log('Generated Image Prompt:', finalPrompt);

    wx.cloud.callFunction({
      name: 'generateImage',
      data: {
        prompt: finalPrompt,
        style: 'default',
        size: '1024x1024'
      }
    }).then(res => {
      console.log('文生图云函数调用结果：', res);
      if (res.result && res.result.success && res.result.data) {
        const imageUrl = res.result.data.url || res.result.data.image_url;
        if (imageUrl) {
          this.setData({
            latestImageUrl: imageUrl
          });
        } else {
           throw new Error('图片URL为空');
        }
      } else {
        throw new Error(`图片生成失败: ${res.result?.message || '未知错误'}`);
      }
    }).catch(err => {
      console.error('文生图云函数调用失败：', err);
      wx.showToast({
        title: '图片生成服务开小差了',
        icon: 'none'
      });
    }).finally(() => {
      this.setData({ isGeneratingImage: false });
    });
  },

  previewImage(e) {
    const src = e.currentTarget.dataset.src;
    if (src) {
      wx.previewImage({
        urls: [src],
        current: src
      });
    }
  },

  onRestartTap() {
    wx.showModal({
      title: '确认操作',
      content: '确定要开始一段新的对话吗？当前聊天记录将被清空。',
      success: (res) => {
        if (res.confirm) {
          this.startNewConversation(this.data.counselor);
        }
      }
    });
  },
});