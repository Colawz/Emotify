Page({
  data: {
    counselor: null,
    messages: [],
    inputValue: '',
    scrollToView: '',
    isLoading: false, // 控制对话加载动画
    isGeneratingImage: false, // 控制图片生成加载动画
    latestImageUrl: '', // 最新生成的图片URL
    userMessageCount: 0, // 用户发送的消息计数
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
    
    // 确保云环境已初始化
    this.ensureCloudInit();
    
    if (!wx.cloud) {
      console.error('云开发环境不可用');
      this.handleAiReplyError('云开发环境不可用，请检查基础库版本');
      return Promise.reject('云开发环境不可用');
    }
    
    const { messages } = this.data;

    const systemPrompt = `你是一个善解人意的好伙伴，你的名字叫Dora。请以这个角色的口吻和身份与用户进行对话，不要暴露你是一个AI模型。`;

    const history = messages.slice(1).map(msg => ({
      role: msg.type === 'counselor' ? 'assistant' : 'user',
      content: msg.content
    }));

    return wx.cloud.callFunction({
      name: 'callAI',
      data: {
        system: systemPrompt,
        messages: history
      }
    }).then(res => {
      const aiReplyContent = res.result;
      if (aiReplyContent) {
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
        throw new Error('AI回复为空');
      }
    }).catch(err => {
      console.error('调用AI失败', err);
      this.handleAiReplyError('抱歉，我好像走神了，请再说一遍吧。');
    }).finally(() => {
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