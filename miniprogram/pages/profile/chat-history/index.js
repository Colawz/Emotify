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
  loadChats() {
    try {
      const chats = wx.getStorageSync('chats') || {}
      const chatList = Object.values(chats).sort((a, b) => b.lastUpdate - a.lastUpdate)
      
      this.setData({
        chats: chatList,
        loading: false
      })
    } catch (error) {
      console.error('加载对话列表失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    }
  },

  // 进入对话
  onChatTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/ai-chat/index?chatId=${id}`
    })
  },

  // 删除对话
  onDeleteChat(e) {
    const { id } = e.currentTarget.dataset
    
    wx.showModal({
      title: '删除对话',
      content: '确定要删除这个对话吗？',
      success: (res) => {
        if (res.confirm) {
          try {
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
            wx.showToast({
              title: '删除失败',
              icon: 'error'
            })
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
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('chats')
            this.setData({ chats: [] })
            
            wx.showToast({
              title: '已清空',
              icon: 'success'
            })
          } catch (error) {
            console.error('清空对话失败:', error)
            wx.showToast({
              title: '操作失败',
              icon: 'error'
            })
          }
        }
      }
    })
  }
}) 