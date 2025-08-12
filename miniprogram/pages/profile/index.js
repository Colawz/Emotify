Page({
  data: {
    userInfo: {},
    unreadCount: 0
  },

  onLoad() {
    // 重置用户头像
    this.resetUserAvatar();
    
    // 检查登录状态
    this.checkLoginStatus();
    // 获取未读消息数
    this.getUnreadCount();
  },

  onShow() {
    // 每次显示页面时更新未读消息数
    this.getUnreadCount();
    // 更新用户信息
    this.checkLoginStatus();
  },

  // 重置用户头像
  resetUserAvatar() {
    // 确保使用最新的头像
    const currentUserInfo = getApp().globalData.userInfo || wx.getStorageSync('userInfo');
    
    if (currentUserInfo) {
      // 更新头像路径
      currentUserInfo.avatarUrl = '/assets/images/male (5).png';
      
      // 保存回全局和存储
      getApp().globalData.userInfo = currentUserInfo;
      wx.setStorageSync('userInfo', currentUserInfo);
      
      console.log('已重置用户头像为: /assets/images/male (5).png');
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    // 优先使用全局数据中的用户信息
    let userInfo = getApp().globalData.userInfo;
    
    // 如果全局数据中没有，则尝试从本地存储获取
    if (!userInfo) {
      userInfo = wx.getStorageSync('userInfo');
      
      // 如果找到了本地存储的用户信息，同步到全局数据
      if (userInfo) {
        getApp().globalData.userInfo = userInfo;
      } else {
        // 如果没有用户信息，设置未登录状态
        this.setData({
          userInfo: {
            nickName: '未登录',
            avatarUrl: '/assets/images/default-avatar.png'
          }
        });
        return;
      }
    }
    
    // 更新页面显示
    if (userInfo) {
      this.setData({ userInfo });
    }
  },

  // 获取未读消息数
  getUnreadCount() {
    // 从全局消息状态中获取未读消息数
    const messageStatus = getApp().globalData.messageStatus || {};
    let totalUnread = 0;
    
    // 计算所有未读消息数量
    for (let i = 1; i <= 5; i++) {
      if (!messageStatus[i] || !messageStatus[i].read) {
        // 每个未读聊天只计算1个未读消息
        if (i === 1 || i === 3 || i === 5) {
          totalUnread += 1;
        }
      }
    }
    
    this.setData({ unreadCount: totalUnread });
  },

  // 登录
  onLogin() {
    // 直接使用预设的用户信息
    const userInfo = {
      nickName: '叶清风',
      avatarUrl: '/assets/images/male (5).png',
      gender: 1,
      userId: 'user_001'
    };
    
    // 保存用户信息
    wx.setStorageSync('userInfo', userInfo);
    getApp().globalData.userInfo = userInfo;
    
    this.setData({ userInfo });
    
    // 刷新未读消息计数
    this.getUnreadCount();
    
    wx.showToast({
      title: '登录成功',
      icon: 'success'
    });
    
    // 延迟刷新页面，确保登录状态生效
    setTimeout(() => {
      this.checkLoginStatus();
    }, 500);
  },

  // 导航到我的发布
  navigateToMyPosts() {
    wx.navigateTo({
      url: '/pages/find-partner/index'
    });
    
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 导航到我的收藏
  navigateToMyFavorites() {
    wx.navigateTo({
      url: '/pages/discover/index'
    });
    
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 导航到我的消息
  navigateToMyMessages() {
    wx.switchTab({
      url: '/pages/message/index'
    });
  },

  // 导航到设置
  navigateToSettings() {
    // 显示模拟设置菜单
    wx.showActionSheet({
      itemList: ['清除缓存', '关于我们', '退出登录'],
      success: (res) => {
        if (res.tapIndex === 2) {
          // 退出登录
          this.logout();
        } else {
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },
  
  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录状态
          // 1. 清除全局数据
          if (getApp().globalData) {
            getApp().globalData.userInfo = null;
          }
          
          // 2. 清除本地存储
          wx.removeStorageSync('userInfo');
          
          // 3. 更新页面显示
          this.setData({
            userInfo: {
              nickName: '未登录',
              avatarUrl: '/assets/images/default-avatar.png'
            }
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 2000
          });
        }
      }
    });
  }
}); 