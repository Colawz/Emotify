Page({
  data: {
    chatId: null,
    inputValue: '',
    messageList: [],
    scrollToMessage: '',
    isLoading: false,
    userInfo: {
      avatar: '/assets/images/male (1).png',
      nickname: '我'
    },
    targetUser: {
      avatar: '/assets/images/default-avatar.png',
      nickname: '对方',
      gender: 'male'
    },
    maleAvatars: [
      '/assets/images/male (1).png',
      '/assets/images/male (2).png',
      '/assets/images/male (3).png',
      '/assets/images/male (4).png'
    ],
    femaleAvatars: [
      '/assets/images/female (1).png',
      '/assets/images/female (2).png',
      '/assets/images/female (3).png',
      '/assets/images/female (4).png'
    ]
  },

  onLoad(options) {
    const { id, avatar, nickname, gender } = options;
    
    // 解码URL参数
    const decodedAvatar = avatar ? decodeURIComponent(avatar) : null;
    const decodedNickname = nickname ? decodeURIComponent(nickname) : null;
    
    console.log('聊天页面接收参数:', { id, avatar: decodedAvatar, nickname: decodedNickname, gender });
    
    // 获取全局用户信息
    const globalUserInfo = getApp().globalData.userInfo || {};
    
    // 强制使用最新头像
    const myAvatar = '/assets/images/male (5).png';
    
    this.setData({ 
      chatId: id,
      // 使用全局用户信息
      userInfo: {
        avatar: myAvatar,
        nickname: globalUserInfo.nickName || '叶清风'
      },
      targetUser: {
        avatar: decodedAvatar || this.getAvatarByUserId(id, gender || 'male'),
        nickname: decodedNickname || '对方',
        gender: gender || 'male'
      }
    });
    
    // 加载聊天记录
    this.loadChatHistory();
  },

  // 根据用户ID获取固定头像
  getAvatarByUserId(userId, gender) {
    const { maleAvatars, femaleAvatars } = this.data;
    const avatarArray = gender === 'female' ? femaleAvatars : maleAvatars;
    // 使用用户ID来确定头像索引，这样每次都会获得相同的头像
    const index = (userId - 1) % avatarArray.length;
    return avatarArray[index];
  },

  // 加载聊天历史
  loadChatHistory() {
    const { chatId } = this.data;
    this.setData({ isLoading: true });
    
    // 从全局数据获取聊天记录
    setTimeout(() => {
      // 获取全局消息
      const globalMessages = getApp().globalData?.chatMessages?.[chatId] || [];
      
      // 为消息添加头像
      const messages = globalMessages.map(msg => ({
        ...msg,
        avatar: msg.isSelf ? this.data.userInfo.avatar : this.data.targetUser.avatar
      }));
      
      this.setData({
        messageList: messages,
        isLoading: false
      });
      
      this.scrollToBottom();
    }, 500);
  },

  // 输入框内容变化
  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  // 发送消息
  onSend() {
    const { inputValue, messageList, chatId } = this.data;
    if (!inputValue.trim()) return;

    // 创建新消息
    const newMessage = {
      id: messageList.length + 1,
      content: inputValue,
      time: this.formatTime(new Date()),
      isSelf: true,
      avatar: '/assets/images/male (5).png'  // 强制使用最新头像
    };

    // 更新界面
    this.setData({
      messageList: [...messageList, newMessage],
      inputValue: ''
    });

    // 更新全局聊天记录
    const globalMessages = getApp().globalData.chatMessages[chatId] || [];
    const { avatar, ...messageWithoutAvatar } = newMessage;
    getApp().globalData.chatMessages[chatId] = [...globalMessages, messageWithoutAvatar];

    this.scrollToBottom();

    // 模拟对方回复
    setTimeout(() => {
      // 生成回复消息
      const replyMessage = {
        id: messageList.length + 2,
        content: this.getRandomReply(),
        time: this.formatTime(new Date()),
        isSelf: false,
        avatar: this.data.targetUser.avatar
      };

      // 更新界面
      this.setData({
        messageList: [...this.data.messageList, replyMessage]
      });

      // 更新全局聊天记录
      const updatedGlobalMessages = getApp().globalData.chatMessages[chatId] || [];
      const { avatar: replyAvatar, ...replyWithoutAvatar } = replyMessage;
      getApp().globalData.chatMessages[chatId] = [...updatedGlobalMessages, replyWithoutAvatar];

      this.scrollToBottom();
    }, 1000);
  },

  // 获取随机回复
  getRandomReply() {
    const replies = [
      '好的，我明白了',
      '这个想法不错，我同意',
      '好的，我们明天见！',
      '这个问题我需要考虑一下',
      '谢谢你的帮助',
      '有什么其他事情需要我帮忙吗？'
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  },

  // 滚动到底部
  scrollToBottom() {
    const { messageList } = this.data;
    if (messageList.length > 0) {
      this.setData({
        scrollToMessage: `msg-${messageList[messageList.length - 1].id}`
      });
    }
  },

  // 滚动到顶部加载更多
  onScrollToUpper() {
    // 实现加载更多历史消息的逻辑
    console.log('加载更多历史消息');
  },

  // 格式化时间
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  onUnload() {
    // 页面卸载时，确保消息已读状态已保存
    const { chatId } = this.data;
    if (chatId) {
      // 更新全局消息状态
      if (!getApp().globalData) {
        getApp().globalData = {};
      }
      
      if (!getApp().globalData.messageStatus) {
        getApp().globalData.messageStatus = {};
      }
      
      // 标记当前聊天为已读
      getApp().globalData.messageStatus[chatId] = {
        read: true,
        lastReadTime: new Date()
      };
    }
  }
}); 