Page({
  data: {
    chats: [],
    loading: true
  },

  onLoad() {
    this.loadChats()
  },

  onShow() {
    // 每次显示页面时重新加载对话列表
    this.loadChats()
  },

  // 加载对话列表
  async loadChats() {
    console.log('开始加载对话列表...');
    try {
      this.setData({ loading: true })
      
      // 确保云环境已初始化
      if (!wx.cloud) {
        console.error('云开发未启用');
        throw new Error('云开发未启用');
      }
      
      // 检查并初始化云环境
      try {
        await wx.cloud.init({
          env: 'cloud1-1gjz5ckoe28a6c4a',
          traceUser: true
        });
        console.log('云环境初始化检查完成');
      } catch (initError) {
        console.log('云环境可能已初始化:', initError.message);
      }
      
      const db = wx.cloud.database()
      const userInfo = wx.getStorageSync('userInfo') || {}
      const openid = userInfo.openid || ''
      
      console.log('获取到的openid:', openid);
      
      if (!openid) {
        console.warn('警告: openid为空，可能无法从云数据库加载数据');
      }
      
      // 从云数据库加载
      console.log('尝试从云数据库加载对话列表...');
      const cloudResult = await db.collection('History')
        .where({ openid: openid })
        .orderBy('lastUpdate', 'desc')
        .get()
      
      console.log('云数据库查询结果:', {
        success: cloudResult.data ? true : false,
        count: cloudResult.data ? cloudResult.data.length : 0,
        data: cloudResult.data
      });
      
      let chatList = cloudResult.data || []
      
      // 如果云数据库没有数据，尝试从本地存储加载
      if (chatList.length === 0) {
        console.log('云数据库中没有对话记录，尝试从本地加载');
        const localChats = wx.getStorageSync('chats') || {}
        console.log('本地存储的对话数据:', localChats);
        chatList = Object.values(localChats).sort((a, b) => b.lastUpdate - a.lastUpdate)
        console.log('从本地加载的对话列表:', chatList);
      } else {
        console.log('从云数据库加载对话列表成功，数量:', chatList.length);
      }
      
      this.setData({
        chats: chatList,
        loading: false
      })
    } catch (error) {
      console.error('加载对话列表失败:', error)
      console.error('错误详情:', {
        message: error.message,
        errCode: error.errCode,
        errMsg: error.errMsg
      });
      
      // 如果云数据库加载失败，尝试从本地存储加载
      try {
        console.log('云数据库加载失败，尝试从本地存储加载...');
        const chats = wx.getStorageSync('chats') || {}
        console.log('本地存储的对话数据（备用）:', chats);
        const chatList = Object.values(chats).sort((a, b) => b.lastUpdate - a.lastUpdate)
        console.log('从本地加载的对话列表（备用）:', chatList);
        
        this.setData({
          chats: chatList,
          loading: false
        })
      } catch (localError) {
        console.error('本地加载也失败:', localError)
        wx.showToast({
          title: '加载失败',
          icon: 'error'
        })
        this.setData({ loading: false })
      }
    }
  },

  // 进入对话
  onChatTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/ai-assistant/chat/index?chatId=${id}`
    })
  },

  // 删除对话
  onDeleteChat(e) {
    const { id } = e.currentTarget.dataset
    
    wx.showModal({
      title: '删除对话',
      content: '确定要删除这个对话吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const db = wx.cloud.database()
            const userInfo = wx.getStorageSync('userInfo') || {}
        const openid = userInfo.openid || ''
            
            // 从云数据库删除
            await db.collection('History').where({
              id: id,
              openid: openid
            }).remove()
            
            // 从本地存储删除
            const chats = wx.getStorageSync('chats') || {}
            delete chats[id]
            wx.setStorageSync('chats', chats)
            
            // 重新加载对话列表
            this.loadChats()
            
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
          } catch (error) {
            console.error('删除对话失败:', error)
            
            // 如果云数据库删除失败，至少删除本地的
            try {
              const chats = wx.getStorageSync('chats') || {}
              delete chats[id]
              wx.setStorageSync('chats', chats)
              this.loadChats()
              
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
            } catch (localError) {
              wx.showToast({
                title: '删除失败',
                icon: 'error'
              })
            }
          }
        }
      }
    })
  },

  // 清空所有对话
  onClearAll() {
    wx.showModal({
      title: '清空所有对话',
      content: '确定要清空所有对话记录吗？此操作不可恢复。',
      success: async (res) => {
        if (res.confirm) {
          try {
            const db = wx.cloud.database()
            const userInfo = wx.getStorageSync('userInfo') || {}
        const openid = userInfo.openid || ''
            
            // 从云数据库清空
            await db.collection('History').where({
              openid: openid
            }).remove()
            
            // 清空本地存储
            wx.removeStorageSync('chats')
            this.setData({ chats: [] })
            
            wx.showToast({
              title: '已清空',
              icon: 'success'
            })
          } catch (error) {
            console.error('清空对话失败:', error)
            
            // 如果云数据库清空失败，至少清空本地的
            try {
              wx.removeStorageSync('chats')
              this.setData({ chats: [] })
              
              wx.showToast({
                title: '已清空',
                icon: 'success'
              })
            } catch (localError) {
              wx.showToast({
                title: '操作失败',
                icon: 'error'
              })
            }
          }
        }
      }
    })
  }
})