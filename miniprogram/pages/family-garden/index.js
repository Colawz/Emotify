Page({
  data: {
    smartTips: [
      {
        id: 1,
        icon: '💡',
        title: '天气提醒',
        description: '今天降温，记得提醒家人添衣',
        time: '2小时前'
      },
      {
        id: 2,
        icon: '🎂',
        title: '生日提醒',
        description: '爸爸生日还有3天',
        time: '1天前'
      },
      {
        id: 3,
        icon: '💊',
        title: '用药提醒',
        description: '妈妈该吃降压药了',
        time: '30分钟前'
      }
    ],
    otherCards: [
      {
        id: 'chat-together',
        title: '陪我聊聊',
        description: '多种沟通方式，随时联系家人',
        emoji: '💬',
        url: '/pages/family-garden/chat-together/index',
        cardclass: 'chat-card'
      },
      {
        id: 'warm-space',
        title: '温暖空间',
        description: '分享生活点滴，记录美好时光',
        emoji: '🌳',
        url: '/pages/family-garden/warm-space/index',
        cardclass: 'warm-card'
      },
      {
        id: 'family-tasks',
        title: '家庭小任务',
        description: '关怀提醒，健康监测，让生活更安心',
        emoji: '📋',
        url: '/pages/family-garden/task-management/index',
        cardclass: 'task-card'
      }
    ]
  },

  onLoad() {
    console.log('亲情驿站页面加载');
  },

  // 卡片点击事件
  onCardTap(e) {
    const { url } = e.currentTarget.dataset;
    console.log('卡片点击，跳转至:', url);
    
    // 检查页面是否存在，如果不存在则显示提示
    wx.navigateTo({
      url: url,
      fail: (err) => {
        console.log('页面跳转失败:', err);
        wx.showModal({
          title: '功能开发中',
          content: '该功能页面正在开发中，敬请期待！',
          showCancel: false
        });
      }
    });
  },

  // 智能提示卡片点击事件
  onSmartTipTap(e) {
    const { url } = e.currentTarget.dataset;
    console.log('智能提示卡片点击，跳转至:', url);
    
    // 检查页面是否存在，如果不存在则显示提示
    wx.navigateTo({
      url: url,
      fail: (err) => {
        console.log('页面跳转失败:', err);
        wx.showModal({
          title: '功能开发中',
          content: '该功能页面正在开发中，敬请期待！',
          showCancel: false
        });
      }
    });
  }
});