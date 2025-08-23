Page({
  data: {
    searchValue: '',
    currentTab: 'discover', // 底部导航栏当前选中的tab
    // 心理测试类型
    testTypes: [
      { id: 'pressure', name: '压力测试', icon: 'explore', color: '#9c26b0' },
      { id: 'emotion', name: '情绪评估', icon: 'heart', color: '#2196f3' },
      { id: 'personality', name: '人格分析', icon: 'user', color: '#4caf50' },
      { id: 'health', name: '心理健康评估', icon: 'root-list', color: '#ff9800' }
    ],
    // 分类标签
    activeTab: 'all',
    categories: [
      { id: 'all', name: '全部' },
      { id: 'book', name: '心理书籍' },
      { id: 'article', name: '心理文章' },
      { id: 'video', name: '心理视频' },
      { id: 'course', name: '心理课程' }
    ],
    // 资源列表
    resourceList: [],
    // 心理咨询师
    counselors: [
      {
        id: 1,
        name: '王老师',
        title: '国家二级心理咨询师',
        avatar: '/images/counselor1.png',
        tags: ['情绪管理', '学业压力', '人际关系'],
        description: '擅长处理学业压力、人际关系等心理问题，有10年心理咨询经验。',
        rating: 4.9,
        appointmentCount: 128
      },
      {
        id: 2,
        name: '李老师',
        title: '国家三级心理咨询师',
        avatar: '/images/counselor2.png',
        tags: ['情感问题', '职业规划', '自我认知'],
        description: '专注于大学生情感问题和职业规划指导，有5年心理咨询经验。',
        rating: 4.8,
        appointmentCount: 93
      }
    ],
    // 预约记录
    appointments: [
      {
        id: 1,
        counselorName: '王老师',
        time: '今天 14:30-15:30',
        status: '待咨询',
        location: '心理咨询中心 302室'
      }
    ],
    featureCards: [
      {
        id: 'conversation',
        title: '陪你聊天',
        description: '选择一个伙伴，开始一段轻松对话',
        emoji: '💬',
        url: '/pages/counseling/conversation/index'
      },
      {
        id: 'treehole',
        title: '情绪树洞',
        description: '在这里倾诉你的烦恼与秘密',
        emoji: '🌳',
        url: '/pages/counseling/treehole/index'
      },
      {
        id: 'diary',
        title: '心情日记',
        description: '记录点滴，回顾成长',
        emoji: '📔',
        url: '/pages/counseling/diary/index' // 这是一个尚待创建的页面
      },
      {
        id: 'profile',
        title: '我的足迹',
        description: '查看你的所有记录和成就',
        emoji: '👣',
        url: '/pages/counseling/user-profile/index' // 这是一个尚待创建的页面
      },
      {
        id: 'games',
        title: '解压游戏',
        description: '玩个小游戏，放松一下心情',
        emoji: '🎮',
        url: '/pages/counseling/stickman/index'
      }
    ]
  },

  onLoad() {
    this.loadResourceList();
  },

  // 加载资源列表
  loadResourceList(category = 'all') {
    // 显示加载提示
    wx.showLoading({
      title: '加载中...',
    });

    // 模拟数据
    const mockData = [
      {
        id: 1,
        title: '大学生心理健康指南',
        description: '本书针对大学生常见的心理问题，提供了实用的解决方案和自我调节方法。',
        image: 'https://via.placeholder.com/300/9c26b0/FFFFFF?text=Book',
        author: '张教授',
        publishTime: '2024-03-15',
        tags: ['心理健康', '自我调节', '大学生'],
        type: 'book'
      },
      {
        id: 2,
        title: '压力管理与情绪调节',
        description: '通过科学的方法，帮助读者有效管理压力，调节情绪，提升生活质量。',
        image: 'https://via.placeholder.com/300/2196f3/FFFFFF?text=Article',
        author: '李博士',
        publishTime: '2024-03-10',
        tags: ['压力管理', '情绪调节', '生活品质'],
        type: 'article'
      },
      {
        id: 3,
        title: '职场压力应对策略',
        description: '提供职场压力的成因分析和实用应对策略，助你轻松面对工作挑战。',
        image: 'https://via.placeholder.com/300/4caf50/FFFFFF?text=Video',
        author: '职业心理咨询师',
        publishTime: '2024-03-05',
        tags: ['职场压力', '应对策略', '心态调整'],
        type: 'video'
      },
      {
        id: 4,
        title: '人际沟通技巧提升课程',
        description: '系统学习人际沟通的核心技巧，改善人际关系，增强沟通效果。',
        image: 'https://via.placeholder.com/300/ff9800/FFFFFF?text=Course',
        author: '沟通专家',
        publishTime: '2024-02-28',
        tags: ['人际沟通', '技巧提升', '关系建立'],
        type: 'course'
      }
    ];

    // 根据分类筛选数据
    let filteredData = mockData;
    if (category !== 'all') {
      filteredData = mockData.filter(item => item.type === category);
    }

    // 延迟模拟网络请求
    setTimeout(() => {
    this.setData({
        resourceList: filteredData
      });
      wx.hideLoading();
    }, 500);
  },

  // 搜索相关
  onSearchChange(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  onSearchSubmit(e) {
    const searchValue = e.detail.value || this.data.searchValue;
    console.log('搜索关键词：', searchValue);
    
    // 实现搜索功能（模拟）
    wx.showToast({
      title: '搜索: ' + searchValue,
      icon: 'none'
    });
    
    // TODO: 根据搜索内容筛选资源
  },

  // 标签页切换
  onTabChange(e) {
    const category = this.data.categories[e.detail.value].id;
    
    this.setData({
      activeTab: category
    });
    
    // 根据分类加载对应资源
    this.loadResourceList(category);
  },

  // 资源点击
  onResourceTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/counseling/detail/index?id=${id}`
    });
  },

  // 查看全部测试
  goToAllTests() {
    wx.navigateTo({
      url: '/pages/counseling/tests/index'
    });
  },
  
  // 查看全部咨询师
  goToAllCounselors() {
    wx.navigateTo({
      url: '/pages/counseling/counselors/index'
    });
  },
  
  // 查看全部预约
  goToAllAppointments() {
    wx.navigateTo({
      url: '/pages/counseling/appointments/index'
    });
  },

  // 跳转到咨询页面
  navigateToCounseling() {
    wx.navigateTo({
      url: '/pages/counseling/chat/index'
    });
  },
  
  // 跳转到AI心理助手
  navigateToAIChat() {
    wx.navigateTo({
      url: '/pages/ai-chat/index'
    });
  },
  
  // 跳转到翱翔门户
  navigateToPortal() {
    wx.showToast({
      title: '翱翔门户功能开发中',
      icon: 'none'
    });
  },
  
  // 跳转到心情树洞
  navigateToTreehole() {
    wx.navigateTo({
      url: '/pages/counseling/treehole/index'
    });
  },
  
  // 发布树洞动态
  createTreeholePost() {
    wx.navigateTo({
      url: '/pages/counseling/treehole/publish'
    });
  },

  // 跳转到暴揍火柴人游戏
  navigateToStickman() {
    wx.navigateTo({
      url: '/pages/counseling/stickman/index'
    });
  },

  // 查看更多游戏
  viewMoreGames() {
    wx.showToast({
      title: '更多游戏即将上线',
      icon: 'none'
    });
  },

  // 紧急求助
  handleEmergency() {
    wx.showModal({
      title: '紧急求助',
      content: '是否拨打心理咨询热线？',
      confirmText: '拨打',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-123-4567'
          });
        }
      }
    });
  },

  // 开始心理测试
  startTest(e) {
    const testType = e.currentTarget.dataset.type;
    const selectedTest = this.data.testTypes.find(item => item.id === testType);
    
    wx.navigateTo({
      url: `/pages/counseling/test/index?type=${testType}&name=${selectedTest.name}`
    });
  },

  // 预约咨询
  makeAppointment(e) {
    const { id } = e.currentTarget.dataset;
    const counselor = this.data.counselors.find(item => item.id === id);
    
    wx.navigateTo({
      url: `/pages/counseling/appointment/index?id=${id}&name=${counselor.name}`
    });
  },

  // 查看预约详情
  viewAppointment(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/counseling/appointment/detail?id=${id}`
    });
  },
  
  // 下拉刷新
  onPullDownRefresh() {
    // 重新加载数据
    this.loadResourceList(this.data.activeTab);
    
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  
  // 分享页面
  onShareAppMessage() {
    return {
      title: '心理辅导 - 情感支持助手',
      path: '/pages/counseling/index'
    }
  },

  // 底部导航栏切换事件处理函数
  onTabBarChange(e) {
    const value = e.detail.value;
    
    // 更新当前选中的标签
    this.setData({
      currentTab: value
    });
    
    // 根据选中的tab的value进行页面跳转
    switch (value) {
      case 'ai-chat':
        wx.switchTab({ url: '/pages/ai-chat/index' });
        break;
      case 'discover':
        // 已在发现页面，不需要跳转
        break;
      case 'message':
        wx.switchTab({ url: '/pages/message/index' });
        break;
      case 'profile':
        wx.switchTab({ url: '/pages/profile/index' });
        break;
    }
  },

  // 生命周期函数--监听页面显示
  onShow: function () {
    // 更新底部tabBar的选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1 // 假设"发现"页在tabBar中索引为1
      });
    }
  },

  onCardTap(e) {
    const { url } = e.currentTarget.dataset;
    if (url) {
      // 检查页面是否存在
      // 注意：小程序没有一个直接的API来检查页面是否存在，
      // 这里的跳转会直接尝试，如果失败会在控制台报错。
      // 在JS中添加fail回调可以捕获这个错误并给出提示。
      wx.navigateTo({
        url: url,
        fail: (err) => {
          console.error(`跳转失败: ${url}`, err);
          wx.showToast({
            title: '功能正在开发中',
            icon: 'none'
          });
        }
      });
    } else {
        wx.showToast({
            title: '功能正在开发中',
            icon: 'none'
        });
    }
  },
});