Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 预设的咨询师/聊天伙伴列表
    counselorList: [
      {
        id: 'dora',
        name: 'Dora',
        avatar: '/images/doro.png', // 这是一个占位符，你需要替换成真实的图片路径
        description: '我是Dora，一个充满好奇心和正能量的探险家，愿意倾听你的任何故事。'
      },
      {
        id: 'lazy_goat',
        name: '懒羊羊',
        avatar: '/images/lan.png', // 这是一个占位符
        description: '虽然我平时很懒，但听你倾诉，我总是有时间的。'
      },
      {
        id: 'grey_wolf',
        name: '灰太狼',
        avatar: '/images/hui.png', // 这是一个占位符
        description: '我屡败屡战，从不放弃！有什么烦恼，跟我说说吧，我帮你分析分析。'
      },
      {
        id: 'boonie_bear_xiongda',
        name: '熊大',
        avatar: '/images/bear1.jpg', // 这是一个占位符
        description: '作为森林的守护者，我沉着冷静，可以帮你理清思绪。'
      },
      {
        id: 'boonie_bear_xionger',
        name: '熊二',
        avatar: '/images/bear2.jpg', // 这是一个占位符
        description: '俺虽然有点笨，但俺最会安慰人啦！'
      }
    ]
  },

  /**
   * 当用户点击一个咨询师卡片时触发
   */
  onCounselorTap(e) {
    const { counselor } = e.currentTarget.dataset;
    // 将选择的咨询师信息转换为JSON字符串，通过URL参数传递给聊天页面
    wx.navigateTo({
      url: `/pages/counseling/conversation/chat/index?counselor=${JSON.stringify(counselor)}`
    });
  },

  /**
   * 当用户点击"创建我的专属咨询师"时触发
   */
  onCreateTap() {
    // wx.showToast({
    //   title: '功能开发中...',
    //   icon: 'none'
    // });
    // 后续可以跳转到创建页面
    wx.navigateTo({
      url: '/pages/counseling/conversation/create/index'
    });
  },

  /**
   * 跳转到我的心理画像页面
   */
  onProfileTap() {
    wx.navigateTo({
      url: '/pages/counseling/profile-analysis/index'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  }
}); 