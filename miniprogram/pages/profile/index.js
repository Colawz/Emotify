const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    userInfo: {},
    unreadCount: 0,
    avatarUrl: '',
    nickName: '',
    showAuthModal: false,
    modalAvatarUrl: '',
    modalNickName: ''
  },

  onLoad() {
    // 重置用户头像
    this.resetUserAvatar();
    
    // 检查登录状态
    this.checkLoginStatus();
    // 获取未读消息数
    this.getUnreadCount();
  },

  onShow() {
    // 每次显示页面时更新未读消息数
    this.getUnreadCount();
    // 更新用户信息
    this.checkLoginStatus();
  },

  // 重置用户头像
  resetUserAvatar() {
    // 确保使用最新的头像
    const currentUserInfo = getApp().globalData.userInfo || wx.getStorageSync('userInfo');
    
    if (currentUserInfo) {
      // 更新头像路径
      currentUserInfo.avatarUrl = '/assets/images/male (5).png';
      
      // 保存回全局和存储
      getApp().globalData.userInfo = currentUserInfo;
      wx.setStorageSync('userInfo', currentUserInfo);
      
      console.log('已重置用户头像为: /assets/images/male (5).png');
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    // 优先使用全局数据中的用户信息
    let userInfo = getApp().globalData.userInfo;
    
    // 如果全局数据中没有，则尝试从本地存储获取
    if (!userInfo) {
      userInfo = wx.getStorageSync('userInfo');
      
      // 如果找到了本地存储的用户信息，同步到全局数据
      if (userInfo) {
        getApp().globalData.userInfo = userInfo;
      } else {
        // 如果没有用户信息，设置未登录状态
        this.setData({
          userInfo: {
            nickName: '未登录',
            avatarUrl: defaultAvatarUrl
          },
          avatarUrl: '',
          nickName: ''
        });
        return;
      }
    }
    
    // 更新页面显示
    if (userInfo) {
      this.setData({ 
        userInfo,
        avatarUrl: userInfo.avatarUrl || defaultAvatarUrl,
        nickName: userInfo.nickName || ''
      });
    }
  },

  // 获取未读消息数
  getUnreadCount() {
    // 从全局消息状态中获取未读消息数
    const messageStatus = getApp().globalData.messageStatus || {};
    let totalUnread = 0;
    
    // 计算所有未读消息数量
    for (let i = 1; i <= 5; i++) {
      if (!messageStatus[i] || !messageStatus[i].read) {
        // 每个未读聊天只计算1个未读消息
        if (i === 1 || i === 3 || i === 5) {
          totalUnread += 1;
        }
      }
    }
    
    this.setData({ unreadCount: totalUnread });
  },

  // 登录
  // 头像选择回调
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatarUrl
    });
  },

  // 昵称输入回调
  getName(e) {
    console.log('输入的昵称:', e.detail.value); // 这里的这个bug已经被修复了，所以回调不用担心
    this.setData({
      nickName: e.detail.value
    });
  },

  // 提交用户信息（登录）
  onSubmitUserInfo(e) {
    const { nickName, avatarUrl } = this.data;
    
    if (!avatarUrl) {
      wx.showToast({
        title: '请先选择头像',
        icon: 'none'
      });
      return;
    }
    
    if (!nickName.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }
    
    // 生成用户ID
    const userId = 'user_' + Date.now();
    
    const userInfo = {
      nickName: nickName.trim(),
      avatarUrl: avatarUrl,
      userId: userId
    };
    
    // 保存用户信息
    wx.setStorageSync('userInfo', userInfo);
    getApp().globalData.userInfo = userInfo;
    
    this.setData({ userInfo });
    
    // 刷新未读消息计数
    this.getUnreadCount();
    
    wx.showToast({
      title: '登录成功',
      icon: 'success'
    });
    
    // 延迟刷新页面，确保登录状态生效
    setTimeout(() => {
      this.checkLoginStatus();
    }, 500);
  },

  // 导航到我的发布
  navigateToMyPosts() {
    wx.navigateTo({
      url: '/pages/find-partner/index'
    });
    
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 导航到我的收藏
  navigateToMyFavorites() {
    wx.navigateTo({
      url: '/pages/discover/index'
    });
    
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 导航到我的消息
  navigateToMyMessages() {
    wx.switchTab({
      url: '/pages/message/index'
    });
  },

  // 导航到设置
  navigateToSettings() {
    // 根据登录状态动态生成菜单项
    const isLoggedIn = this.data.userInfo && this.data.userInfo.userId;
    const itemList = ['清除缓存', '关于我们'];
    
    // 只有已登录才显示退出登录选项
    if (isLoggedIn) {
      itemList.push('退出登录');
    }
    
    // 显示设置菜单
    wx.showActionSheet({
      itemList: itemList,
      success: (res) => {
        if (isLoggedIn && res.tapIndex === 2) {
          // 退出登录（只有已登录时才会有这个选项）
          this.logout();
        } else if (res.tapIndex === 0) {
          // 清除缓存
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        } else if (res.tapIndex === 1) {
          // 关于我们
          wx.navigateTo({
            url: '/pages/profile/about/index'
          });
        }
      }
    });
  },
  
  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录状态
          // 1. 清除全局数据
          if (getApp().globalData) {
            getApp().globalData.userInfo = null;
          }
          
          // 2. 清除本地存储
          wx.removeStorageSync('userInfo');
          
          // 3. 更新页面显示
          this.setData({
            userInfo: {
              nickName: '未登录',
              avatarUrl: defaultAvatarUrl
            },
            avatarUrl: '',
            nickName: ''
          });
          
          wx.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 2000
          });
        }
      }
    })
  },

  // 显示授权登录弹窗
  showAuthModal() {
    // 初始化弹窗数据，如果已有数据则使用现有数据
    this.setData({
      showAuthModal: true,
      modalAvatarUrl: this.data.avatarUrl || '',
      modalNickName: this.data.nickName || ''
    })
  },

  // 关闭授权登录弹窗
  closeAuthModal() {
    this.setData({
      showAuthModal: false
    })
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 阻止点击弹窗内容时关闭弹窗
  },

  // 弹窗内头像选择
  onModalChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      modalAvatarUrl: avatarUrl
    })
  },

  // 弹窗内昵称输入
  onModalGetName(e) {
    this.setData({
      modalNickName: e.detail.value
    })
  },



  // 确认授权
  confirmAuth() {
    const { modalAvatarUrl, modalNickName } = this.data
    
    // 验证必填信息
    if (!modalAvatarUrl || !modalNickName.trim()) {
      wx.showToast({
        title: '请完善头像和昵称信息',
        icon: 'none',
        duration: 2000
      })
      return
    }
    
    // 使用当前表单信息进行登录
    this.processCustomLogin(modalAvatarUrl, modalNickName)
    
    this.setData({
      showAuthModal: false
    })
  },

  // 处理自定义信息登录
  processCustomLogin(avatarUrl, nickName) {
    // 检查云开发是否可用
    if (!wx.cloud) {
      wx.showToast({
        title: '云服务不可用，请更新微信版本',
        icon: 'none',
        duration: 3000
      })
      return
    }

    // 确保云开发已初始化
    try {
      wx.cloud.init({
        env: 'cloud1-1gjz5ckoe28a6c4a',
        traceUser: true
      })
    } catch (error) {
      console.log('云开发已初始化或初始化失败', error)
    }

    // 生成用户ID
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    
    // 显示加载提示
    wx.showLoading({
      title: '上传头像中...'
    })
    
    // 先上传头像到云存储
    const cloudPath = `avatars/${userId}.png`
    
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: avatarUrl,
      success: uploadRes => {
        console.log('头像上传成功', uploadRes)
        
        // 创建用户信息对象（使用云存储的fileID）
        const userInfo = {
          userId: userId,
          nickName: nickName,
          avatarUrl: uploadRes.fileID // 使用云存储的fileID
        }
        
        // 保存到本地存储和全局数据
        wx.setStorageSync('userInfo', userInfo)
        getApp().globalData.userInfo = userInfo
        
        // 更新页面数据
        this.setData({
          userInfo: userInfo,
          avatarUrl: uploadRes.fileID,
          nickName: nickName
        })
        
        wx.hideLoading()
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 2000
        })
        
        // 延迟保存到云数据库
        setTimeout(() => {
          try {
            const db = wx.cloud.database()
            db.collection('User').add({
              data: userInfo
            }).then(dbRes => {
              console.log('用户信息保存到数据库成功', dbRes)
            }).catch(dbErr => {
              console.warn('保存用户信息到数据库失败', dbErr)
            })
          } catch (error) {
            console.warn('云数据库操作失败', error)
          }
        }, 1000)
      },
      fail: uploadErr => {
        console.error('头像上传失败', uploadErr)
        wx.hideLoading()
        
        // 头像上传失败时，使用本地头像路径作为备选方案
        const userInfo = {
          userId: userId,
          nickName: nickName,
          avatarUrl: avatarUrl // 使用本地头像路径作为备选
        }
        
        // 保存到本地存储和全局数据
        wx.setStorageSync('userInfo', userInfo)
        getApp().globalData.userInfo = userInfo
        
        // 更新页面数据
        this.setData({
          userInfo: userInfo,
          avatarUrl: avatarUrl,
          nickName: nickName
        })
        
        wx.showToast({
          title: '登录成功（头像上传失败）',
          icon: 'success',
          duration: 2000
        })
        
        // 延迟保存到云数据库
        setTimeout(() => {
          try {
            const db = wx.cloud.database()
            db.collection('User').add({
              data: userInfo
            }).then(dbRes => {
              console.log('用户信息保存到数据库成功', dbRes)
            }).catch(dbErr => {
              console.warn('保存用户信息到数据库失败', dbErr)
            })
          } catch (error) {
            console.warn('云数据库操作失败', error)
          }
        }, 1000)
      }
    })
  }
});