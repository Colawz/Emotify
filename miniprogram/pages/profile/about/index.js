// pages/profile/about/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    appInfo: {
      name: '校园生活助手',
      version: '1.0.0',
      description: '专为大学生打造的综合性校园服务应用'
    },
    features: [
      {
        icon: '🤖',
        name: 'AI智能助手',
        desc: '24小时在线，解答学习生活问题'
      },
      {
        icon: '💚',
        name: '心理疗愈',
        desc: '专业心理咨询，守护心理健康'
      },
      {
        icon: '👥',
        name: '社交互动',
        desc: '结识志同道合的朋友'
      }
    ],
    contactInfo: {
      email: 'support@campus-helper.com',
      qq: '123456789'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: '关于我们'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 页面渲染完成
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // 页面隐藏
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 下拉刷新
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 上拉触底
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '校园生活助手 - 让校园生活更美好',
      path: '/pages/profile/about/index',
      imageUrl: '/assets/images/share-cover.png'
    };
  },

  /**
   * 复制联系方式
   */
  copyContact(e) {
    const { type } = e.currentTarget.dataset;
    let text = '';
    
    if (type === 'email') {
      text = this.data.contactInfo.email;
    } else if (type === 'qq') {
      text = this.data.contactInfo.qq;
    }
    
    if (text) {
      wx.setClipboardData({
        data: text,
        success: () => {
          wx.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          });
        }
      });
    }
  },

  /**
   * 查看更新日志
   */
  viewUpdateLog() {
    wx.showModal({
      title: '更新日志',
      content: 'v1.0.0\n- 初始版本发布\n- AI智能助手功能\n- 心理疗愈模块\n- 用户个人中心',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * 意见反馈
   */
  feedback() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的关注！如有任何建议或问题，请通过邮箱或QQ群联系我们。',
      showCancel: false,
      confirmText: '好的'
    });
  }
});