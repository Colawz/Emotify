Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: ''
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname')
  },

  onLoad() {
    // 页面加载时的逻辑
  },

  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    });
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    const { nickName } = this.data.userInfo;
    this.setData({
      'userInfo.avatarUrl': avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== ''
    });
  },

  onInputChange(e) {
    const nickName = e.detail.value;
    const { avatarUrl } = this.data.userInfo;
    this.setData({
      'userInfo.nickName': nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== ''
    });
  },

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    });
  },

  // 功能卡片跳转方法
  navigateToDormMatching() {
    wx.navigateTo({
      url: '/pages/discover/dorm-matching/index'
    });
  },

  navigateToCarpool() {
    wx.navigateTo({
      url: '/pages/discover/carpool/index'
    });
  },

  navigateToSports() {
    wx.navigateTo({
      url: '/pages/discover/sports-team/index'
    });
  },

  navigateToCanteenReview() {
    wx.navigateTo({
      url: '/pages/canteen-review/index'
    });
  },

  navigateToCanteen() {
    wx.navigateTo({
      url: '/pages/discover/canteen-review/index'
    });
  },

  navigateToCounseling() {
    wx.navigateTo({
      url: '/pages/counseling/index'
    });
  }
}); 