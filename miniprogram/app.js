// app.js
App({
  onLaunch: function () {
    // 初始化云开发
 
      wx.cloud.init({
        env: 'cloud1-1gjz5ckoe28a6c4a',
        traceUser: true
      })
      console.log('云开发初始化完成')
    

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})