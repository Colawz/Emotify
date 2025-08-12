Page({
  data: {
    diaries: [],
    isLoading: true,
    activityStats: [
      {
        id: 'mindfulness',
        label: '正念思考',
        value: 85,
        color: '#a8e063'
      },
      {
        id: 'exploration',
        label: '探索实践',
        value: 60,
        color: '#f6d365'
      },
      {
        id: 'relationships',
        label: '健康关系',
        value: 75,
        color: '#ff9a9e'
      },
      {
        id: 'chat',
        label: 'AI 对话',
        value: 90,
        color: '#8A32E8'
      }
    ]
  },

  // 使用 onShow 是为了确保每次进入页面都能加载最新的日记列表
  onShow() {
    this.loadDiaries();
  },

  loadDiaries() {
    this.setData({ isLoading: true });
    try {
      const diaries = wx.getStorageSync('diaries') || [];
      
      // 如果没有真实日记，则加载示例数据
      if (diaries.length === 0) {
        this.loadMockDiaries();
        return;
      }

      // 简单地格式化时间以便显示
      const formattedDiaries = diaries.map(diary => {
        return {
          ...diary,
          displayTime: this.formatTime(diary.createdAt)
        };
      });
      this.setData({
        diaries: formattedDiaries,
        isLoading: false
      });
    } catch (e) {
      console.error("加载日记失败", e);
      this.setData({ isLoading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
    }
  },

  // 加载示例数据
  loadMockDiaries() {
    const mockDiaries = [
      {
        id: 'mock1',
        topic: { title: '感恩日记' },
        content: '今天天气真好，阳光明媚，让我心情舒畅。感谢食堂阿姨今天多给了我一块肉，小小的善意温暖了一整天。晚上和朋友们打球很开心，享受到了运动的乐趣。',
        createdAt: '2024-05-20T12:30:00.000Z'
      },
      {
        id: 'mock2',
        topic: { title: '探索你的爱好' },
        content: '下午在图书馆无意中翻到一本关于古典建筑的书，里面的插图和历史故事深深吸引了我。突然发现，自己对这些古老而宏伟的东西很着迷，或许这是一个可以深入探索的新爱好。',
        createdAt: '2024-05-18T18:00:00.000Z'
      },
      {
        id: 'mock3',
        topic: { title: '让爱涌现' },
        content: '晚上给家里打了个电话，和妈妈聊了很久。虽然只是些家常，但能听到她的声音就觉得很安心。感受到了家人的爱，是支撑我前进的最大动力。',
        createdAt: '2024-05-15T21:00:00.000Z'
      }
    ];

    const formattedMocks = mockDiaries.map(diary => ({
      ...diary,
      displayTime: this.formatTime(diary.createdAt)
    }));

    this.setData({
      diaries: formattedMocks,
      isLoading: false
    });
  },

  // 简单的时间格式化函数
  formatTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
  },

  onDiaryTap(e) {
    // 将来可以实现点击查看日记详情的功能
    wx.showToast({
      title: '详情功能开发中',
      icon: 'none'
    });
  }
}); 