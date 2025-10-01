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
        avatar: '/assets/Counselor_Headshot/doro.jpg',
        description: '我是Dora，一个充满好奇心和正能量的探险家，愿意倾听你的任何故事。'
      },
      {
        id: 'human_psychologist',
        name: '咨询师晨晨',
        avatar: '/assets/Counselor_Headshot/human.jpg',
        description: '专业的人类心理咨询师，为你提供温暖与专业的支持。'
      },
      {
        id: 'lazy_goat',
        name: '懒羊羊',
        avatar: '/assets/Counselor_Headshot/lan.jpg',
        description: '虽然我平时很懒，但听你倾诉，我总是有时间的。'
      },
      
      {
        id: 'boonie_bear_xiongda',
        name: '熊大',
        avatar: '/assets/Counselor_Headshot/bear1.png',
        description: '作为森林的守护者，我沉着冷静，可以帮你理清思绪。'
      },
      {
        id: 'boonie_bear_xionger',
        name: '熊二',
        avatar: '/assets/Counselor_Headshot/bear2.png',
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