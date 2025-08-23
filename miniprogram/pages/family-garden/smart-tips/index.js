Page({
  data: {
    // 今日提醒数据
    todayTips: [
      {
        id: 1,
        icon: '💊',
        title: '吃药提醒',
        description: '记得按时服用降压药',
        time: '08:00'
      },
      {
        id: 2,
        icon: '🏃',
        title: '运动提醒',
        description: '下午3点记得散步30分钟',
        time: '15:00'
      },
      {
        id: 3,
        icon: '💧',
        title: '饮水提醒',
        description: '记得多喝水，保持身体水分',
        time: '10:00'
      }
    ],
    
    // 健康建议数据
    healthTips: [
      {
        id: 1,
        icon: '🥗',
        title: '饮食建议',
        content: '建议多吃蔬菜水果，减少油腻食物摄入，保持饮食均衡。',
        category: '饮食',
        time: '今天 09:00'
      },
      {
        id: 2,
        icon: '😴',
        title: '睡眠建议',
        content: '保持规律作息，每天保证7-8小时睡眠，避免熬夜。',
        category: '作息',
        time: '今天 20:00'
      },
      {
        id: 3,
        icon: '🧘',
        title: '心理建议',
        content: '保持心情愉悦，适当进行放松活动，如冥想、听音乐等。',
        category: '心理',
        time: '今天 14:00'
      }
    ],
    
    // 添加提醒表单数据
    tipTypes: ['健康提醒', '运动提醒', '饮食提醒', '用药提醒', '其他'],
    tipTypeIndex: 0,
    tipContent: '',
    tipTime: ''
  },

  onLoad() {
    console.log('智能提示页面加载');
  },

  // 完成提醒
  onCompleteTip(e) {
    const { id } = e.currentTarget.dataset;
    const { todayTips } = this.data;
    const tipIndex = todayTips.findIndex(tip => tip.id === id);
    
    if (tipIndex !== -1) {
      todayTips.splice(tipIndex, 1);
      this.setData({ todayTips });
      
      wx.showToast({
        title: '提醒已完成',
        icon: 'success'
      });
    }
  },

  // 提醒类型选择
  onTypeChange(e) {
    this.setData({
      tipTypeIndex: e.detail.value
    });
  },

  // 提醒内容输入
  onContentInput(e) {
    this.setData({
      tipContent: e.detail.value
    });
  },

  // 时间选择
  onTimeChange(e) {
    this.setData({
      tipTime: e.detail.value
    });
  },

  // 添加提醒
  onAddTip() {
    const { tipTypes, tipTypeIndex, tipContent, tipTime } = this.data;
    
    if (!tipContent.trim()) {
      wx.showToast({
        title: '请输入提醒内容',
        icon: 'none'
      });
      return;
    }
    
    if (!tipTime) {
      wx.showToast({
        title: '请选择提醒时间',
        icon: 'none'
      });
      return;
    }
    
    const newTip = {
      id: Date.now(),
      icon: this.getTipIcon(tipTypes[tipTypeIndex]),
      title: tipTypes[tipTypeIndex],
      description: tipContent,
      time: tipTime
    };
    
    const { todayTips } = this.data;
    todayTips.push(newTip);
    
    this.setData({
      todayTips,
      tipContent: '',
      tipTime: ''
    });
    
    wx.showToast({
      title: '提醒添加成功',
      icon: 'success'
    });
  },

  // 根据提醒类型获取图标
  getTipIcon(type) {
    const iconMap = {
      '健康提醒': '💊',
      '运动提醒': '🏃',
      '饮食提醒': '🥗',
      '用药提醒': '💊',
      '其他': '📝'
    };
    return iconMap[type] || '📝';
  }
});