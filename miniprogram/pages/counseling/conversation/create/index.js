// miniprogram/pages/counseling/conversation/create/index.js
Page({
  data: {
    avatarUrl: '', // 用于预览的头像URL
    name: '',
    description: ''
  },

  // 用户选择头像后触发
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatarUrl,
    });
  },

  // 监听昵称输入
  onNameInput(e) {
    this.setData({
      name: e.detail.value
    });
  },

  // 监听描述输入
  onDescriptionInput(e) {
    this.setData({
      description: e.detail.value
    });
  },

  // 用户点击“创建并开始聊天”
  onStartChat() {
    const { avatarUrl, name, description } = this.data;

    if (!name.trim()) {
      wx.showToast({ title: '请输入一个昵称', icon: 'none' });
      return;
    }
    if (!avatarUrl) {
      wx.showToast({ title: '请选择一个头像', icon: 'none' });
      return;
    }

    // 组装成咨询师对象
    const counselor = {
      id: `custom_${Date.now()}`,
      name: name,
      avatar: avatarUrl,
      description: description || `我是你创建的专属伙伴 ${name}。` // 如果描述为空，提供一个默认值
    };

    // 跳转到聊天页面，并传递新创建的伙伴信息
    wx.navigateTo({
      url: `/pages/counseling/conversation/chat/index?counselor=${JSON.stringify(counselor)}`
    });
  }
})
