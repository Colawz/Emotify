Page({
  data: {
    searchValue: '',
    messageList: [],
    defaultAvatar: '/assets/images/default-avatar.png',
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
    ],
    globalUserInfo: {} // 全局用户信息
  },

  onLoad() {
    // 初始化全局消息状态（实际应用中应该从服务器或本地存储获取）
    if (!getApp().globalData) {
      getApp().globalData = {};
    }
    
    if (!getApp().globalData.messageStatus) {
      getApp().globalData.messageStatus = {}; 
    }
    
    // 初始化消息内容全局存储
    if (!getApp().globalData.chatMessages) {
      getApp().globalData.chatMessages = {};
      
      // 初始化聊天记录
      this.initChatMessages();
    }
    
    // 获取全局用户信息
    this.getUserInfo();
    
    // 加载消息列表数据
    this.loadMessageList();
  },

  onShow() {
    // 每次显示页面时刷新消息列表
    this.loadMessageList();
    
    // 更新用户信息
    this.getUserInfo();
  },

  // 搜索相关方法
  onSearchChange(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  onSearchSubmit(e) {
    // 实现搜索逻辑
    console.log('搜索关键词：', e.detail.value);
    this.filterMessageList(e.detail.value);
  },

  // 获取固定头像
  getAvatarByUserId(userId, gender) {
    const { maleAvatars, femaleAvatars } = this.data;
    const avatarArray = gender === 'female' ? femaleAvatars : maleAvatars;
    // 使用用户ID来确定头像索引，这样每次都会获得相同的头像
    const index = (userId - 1) % avatarArray.length;
    return avatarArray[index];
  },

  // 标记消息为已读
  markMessageAsRead(id) {
    // 更新全局状态
    getApp().globalData.messageStatus[id] = {
      read: true,
      lastReadTime: new Date()
    };
    
    // 更新本地数据
    const { messageList } = this.data;
    const updatedList = messageList.map(item => {
      if (item.id === id) {
        return { ...item, unreadCount: 0 };
      }
      return item;
    });
    
    this.setData({ messageList: updatedList });
  },

  // 点击消息项
  onMessageTap(e) {
    const { id, avatar, nickname, gender } = e.currentTarget.dataset;
    
    // 标记为已读
    this.markMessageAsRead(parseInt(id, 10));
    
    wx.navigateTo({
      url: `/pages/message/chat/index?id=${id}&avatar=${encodeURIComponent(avatar)}&nickname=${encodeURIComponent(nickname)}&gender=${gender}`
    });
  },

  // 加载消息列表
  loadMessageList() {
    // 获取全局消息状态
    const messageStatus = getApp().globalData?.messageStatus || {};
    const chatMessages = getApp().globalData?.chatMessages || {};
    
    // 基于全局聊天记录生成消息列表
    const messageList = [
      {
        id: 1,
        avatar: this.getAvatarByUserId(1, 'female'),
        nickname: '林初晨',
        gender: 'female',
        lastMessage: this.getLastMessage(chatMessages['1']),
        lastTime: this.getLastMessageTime(chatMessages['1']),
        unreadCount: messageStatus[1] && messageStatus[1].read ? 0 : 1
      },
      {
        id: 2,
        avatar: this.getAvatarByUserId(2, 'male'),
        nickname: '陈昊天',
        gender: 'male',
        lastMessage: this.getLastMessage(chatMessages['2']),
        lastTime: this.getLastMessageTime(chatMessages['2']),
        unreadCount: messageStatus[2] && messageStatus[2].read ? 0 : 0
      },
      {
        id: 3,
        avatar: this.getAvatarByUserId(3, 'male'),
        nickname: '魏辰杰',
        gender: 'male',
        lastMessage: this.getLastMessage(chatMessages['3']),
        lastTime: this.getLastMessageTime(chatMessages['3']),
        unreadCount: messageStatus[3] && messageStatus[3].read ? 0 : 1
      },
      {
        id: 4,
        avatar: this.getAvatarByUserId(4, 'female'),
        nickname: '苏雨萱',
        gender: 'female',
        lastMessage: this.getLastMessage(chatMessages['4']),
        lastTime: this.getLastMessageTime(chatMessages['4']),
        unreadCount: messageStatus[4] && messageStatus[4].read ? 0 : 0
      },
      {
        id: 5,
        avatar: this.getAvatarByUserId(5, 'male'),
        nickname: '黄子轩',
        gender: 'male',
        lastMessage: this.getLastMessage(chatMessages['5']),
        lastTime: this.getLastMessageTime(chatMessages['5']),
        unreadCount: messageStatus[5] && messageStatus[5].read ? 0 : 1
      }
    ];
    
    this.setData({ messageList });
  },

  // 获取最后一条消息内容
  getLastMessage(messages) {
    if (!messages || !messages.length) {
      return '暂无消息';
    }
    return messages[messages.length - 1].content;
  },
  
  // 获取最后一条消息时间
  getLastMessageTime(messages) {
    if (!messages || !messages.length) {
      return '';
    }
    return messages[messages.length - 1].time;
  },

  // 筛选消息列表
  filterMessageList(keyword) {
    // 实现搜索筛选逻辑
    console.log('筛选关键词：', keyword);
  },

  // 初始化聊天记录数据
  initChatMessages() {
    // 林初晨的聊天记录
    getApp().globalData.chatMessages['1'] = [
      {
        id: 1,
        content: '你好，请问宿舍还有空位吗？',
        time: '10:30',
        isSelf: false
      },
      {
        id: 2,
        content: '有的，我们宿舍正好有一个空位',
        time: '10:31',
        isSelf: true
      },
      {
        id: 3,
        content: '太好了，请问是什么时候可以入住？',
        time: '10:32',
        isSelf: false
      }
    ];
    
    // 陈昊天的聊天记录
    getApp().globalData.chatMessages['2'] = [
      {
        id: 1,
        content: '明天的活动你来参加吗？',
        time: '昨天 15:40',
        isSelf: false
      },
      {
        id: 2,
        content: '是的，我会准时到',
        time: '昨天 15:50',
        isSelf: true
      },
      {
        id: 3,
        content: '好的，我们明天见！',
        time: '昨天 16:05',
        isSelf: false
      }
    ];
    
    // 魏辰杰的聊天记录
    getApp().globalData.chatMessages['3'] = [
      {
        id: 1,
        content: '周末一起打球吗？',
        time: '周一 18:30',
        isSelf: false
      },
      {
        id: 2,
        content: '好啊，几点？',
        time: '周一 18:45',
        isSelf: true
      },
      {
        id: 3,
        content: '下午2点，篮球场见',
        time: '周一 19:00',
        isSelf: false
      }
    ];
    
    // 苏雨萱的聊天记录
    getApp().globalData.chatMessages['4'] = [
      {
        id: 1,
        content: '报名活动的截止时间是什么时候？',
        time: '09:15',
        isSelf: false
      },
      {
        id: 2,
        content: '截止时间是明天下午5点',
        time: '09:20',
        isSelf: true
      },
      {
        id: 3,
        content: '谢谢，我会尽快完成报名的',
        time: '09:23',
        isSelf: false
      }
    ];
    
    // 黄子轩的聊天记录
    getApp().globalData.chatMessages['5'] = [
      {
        id: 1,
        content: '请问食堂今天有什么特色菜？',
        time: '昨天 12:30',
        isSelf: false
      },
      {
        id: 2,
        content: '今天有红烧排骨和鱼香肉丝',
        time: '昨天 12:35',
        isSelf: true
      },
      {
        id: 3,
        content: '太好了，我最喜欢鱼香肉丝了',
        time: '昨天 12:38',
        isSelf: false
      }
    ];
  },

  onUnload() {
    // 页面卸载时的清理工作
  },
  
  // 格式化时间
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  // 获取全局用户信息
  getUserInfo() {
    const globalUserInfo = getApp().globalData.userInfo || {};
    this.setData({ globalUserInfo });
  },
  
  // 导航到个人页面
  navigateToProfile() {
    wx.switchTab({
      url: '/pages/profile/index'
    });
  }
}); 