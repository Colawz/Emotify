Page({
  data: {
    counselor: null, // 当前聊天对象
    messages: [],    // 消息列表
    inputValue: '',  // 输入框内容
    scrollToView: '' // 控制滚动位置
  },

  onLoad(options) {
    if (options.counselor) {
      // 解析从上一个页面传来的JSON字符串
      const counselor = JSON.parse(options.counselor);
      this.setData({ 
        counselor: counselor
      });
      // 开始新对话
      this.startNewConversation(counselor);
    }
  },

  /**
   * 点击返回按钮
   */
  onNavigateBack() {
    wx.navigateBack();
  },

  // 开始一段新对话
  startNewConversation(counselor) {
    this.setData({
      messages: [
        {
          id: 'msg_0',
          type: 'counselor',
          content: `你好！我是${counselor.name}，很高兴能和你聊天。有什么想说的吗？`
        }
      ],
      inputValue: '',
      isLoading: false,
    });
  },

  // 处理输入框内容变化
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 发送消息
  onSend() {
    if (!this.data.inputValue.trim()) {
      return;
    }

    const messages = this.data.messages;
    const userMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: this.data.inputValue
    };

    this.setData({
      messages: [...messages, userMessage],
      inputValue: '', // 清空输入框
      scrollToView: userMessage.id // 滚动到新消息
    });

    // 调用真实的AI回复
    this.getAiReply();
  },

  /**
   * 点击"重聊"按钮
   */
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

  /**
   * 点击"总结"按钮
   */
  onSummarizeTap() {
    wx.showToast({
      title: '总结功能开发中...',
      icon: 'none'
    });
    // 后续可以实现调用AI进行总结
  },

  // 获取AI的真实回复
  getAiReply() {
    this.setData({ isLoading: true });
    
    const { counselor, messages } = this.data;

    // 1. 构建系统提示词 (System Prompt)
    const systemPrompt = `你现在扮演一个角色，你需要严格按照以下人设进行对话。
人设名：${counselor.name}
人设描述：${counselor.description}
你的任务是始终以这个角色的口吻和身份与用户进行对话，不要暴露你是一个AI模型。请根据用户的输入，以符合人设的方式进行回应。`;

    // 2. 准备对话历史 (除了第一条欢迎语)
    const history = messages.slice(1).map(msg => ({
      role: msg.type === 'counselor' ? 'assistant' : 'user',
      content: msg.content
    }));

    // 3. 调用云函数
    wx.cloud.callFunction({
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
      const errorReply = {
        id: `msg_${Date.now() + 1}`,
        type: 'counselor',
        content: '抱歉，我好像走神了，请再说一遍吧。'
      };
      this.setData({
        messages: [...this.data.messages, errorReply],
        scrollToView: errorReply.id
      });
    }).finally(() => {
      this.setData({ isLoading: false });
    });
  }
}); 