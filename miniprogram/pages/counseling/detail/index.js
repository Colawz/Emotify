Page({
  data: {
    resource: null,
    recommendList: [],
    isCollected: false
  },

  onLoad(options) {
    const { id } = options
    this.loadResourceDetail(id)
    this.loadRecommendList()
  },

  // 加载资源详情
  loadResourceDetail(id) {
    // 模拟数据
    const mockData = {
      id: parseInt(id),
      title: '大学生心理健康指南',
      description: '本书针对大学生常见的心理问题，提供了实用的解决方案和自我调节方法。通过深入浅出的讲解和丰富的案例分析，帮助大学生更好地认识自我、调节情绪、处理人际关系，从而保持健康的心理状态。',
      image: 'https://tdesign.gtimg.com/miniprogram/images/resource1.jpg',
      author: '张教授',
      publishTime: '2024-03-15',
      tags: ['心理健康', '自我调节', '大学生'],
      content: `
        <div class="chapter">
          <h3>第一章：认识自我</h3>
          <p>自我认知是心理健康的基础。本章将帮助你了解自己的性格特点、情绪模式和行为习惯，从而更好地认识自我。</p>
          <h4>1.1 性格分析</h4>
          <p>通过科学的性格测试，了解自己的性格类型，发现自己的优势和不足。</p>
          <h4>1.2 情绪管理</h4>
          <p>学习识别和调节自己的情绪，掌握有效的情绪管理方法。</p>
        </div>
        <div class="chapter">
          <h3>第二章：人际关系</h3>
          <p>良好的人际关系是心理健康的重要保障。本章将探讨如何建立和维护健康的人际关系。</p>
          <h4>2.1 沟通技巧</h4>
          <p>学习有效的沟通方法，提高人际交往能力。</p>
          <h4>2.2 冲突处理</h4>
          <p>掌握处理人际冲突的技巧，维护和谐的人际关系。</p>
        </div>
      `
    }
    this.setData({
      resource: mockData
    })
  },

  // 加载推荐列表
  loadRecommendList() {
    // 模拟数据
    const mockData = [
      {
        id: 2,
        title: '压力管理与情绪调节',
        description: '通过科学的方法，帮助读者有效管理压力，调节情绪，提升生活质量。',
        image: 'https://tdesign.gtimg.com/miniprogram/images/resource2.jpg'
      },
      {
        id: 3,
        title: '大学生人际交往指南',
        description: '针对大学生在人际交往中常见的问题，提供实用的建议和解决方案。',
        image: 'https://tdesign.gtimg.com/miniprogram/images/resource3.jpg'
      }
    ]
    this.setData({
      recommendList: mockData
    })
  },

  // 推荐项点击
  onRecommendTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/counseling/detail/index?id=${id}`
    })
  },

  // 分享
  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  // 收藏
  onCollect() {
    const { isCollected } = this.data
    this.setData({
      isCollected: !isCollected
    })
    wx.showToast({
      title: isCollected ? '已取消收藏' : '已收藏',
      icon: 'success'
    })
  },

  // 开始阅读
  onStartReading() {
    const { resource } = this.data
    wx.navigateTo({
      url: `/pages/counseling/reader/index?id=${resource.id}`
    })
  }
}) 