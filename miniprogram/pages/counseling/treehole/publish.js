Page({
  data: {
    content: '', // 帖子内容
    fileList: [], // 上传的图片列表
    isAnonymous: true, // 是否匿名发布
    selectedAvatar: '/assets/avatars_treehole/1.jpg', // 默认选中的头像
    avatarList: [
      '/assets/avatars_treehole/1.jpg',
      '/assets/avatars_treehole/2.jpg', 
      '/assets/avatars_treehole/3.png',
      '/assets/avatars_treehole/4.png',
      '/assets/avatars_treehole/5.jpg',
      '/assets/avatars_treehole/6.jpg',
      '/assets/avatars_treehole/7.png',
      '/assets/avatars_treehole/8.jpg',
      '/assets/avatars_treehole/9.png'
    ],
    tagOptions: [
      { label: '学业压力', value: '学业压力' },
      { label: '情感问题', value: '情感问题' },
      { label: '人际关系', value: '人际关系' },
      { label: '职业规划', value: '职业规划' },
      { label: '心理健康', value: '心理健康' },
      { label: '求助', value: '求助' },
      { label: '分享', value: '分享' },
      { label: '考研', value: '考研' }
    ],
    selectedTags: [],
    isSubmitting: false
  },

  // 选择头像
  selectAvatar(e) {
    const { avatar } = e.currentTarget.dataset;
    this.setData({
      selectedAvatar: avatar
    });
  },

  // 内容输入
  onContentChange(e) {
    this.setData({
      content: e.detail.value
    });
  },

  // 图片上传成功
  handleSuccess(e) {
    const { fileList } = this.data;
    fileList.push({ url: e.detail.file.url || 'https://via.placeholder.com/200/10b981/FFFFFF?text=TreeHole+Image' });
    this.setData({
      fileList
    });
  },

  // 图片上传失败
  handleFail(e) {
    wx.showToast({
      title: '图片上传失败',
      icon: 'none'
    });
  },

  // 删除图片
  handleRemove(e) {
    const { index } = e.detail;
    const { fileList } = this.data;
    fileList.splice(index, 1);
    this.setData({
      fileList
    });
    return true;
  },

  // 切换匿名状态
  toggleAnonymous() {
    this.setData({
      isAnonymous: !this.data.isAnonymous
    });
  },

  // 选择标签
  onTagsChange(e) {
    this.setData({
      selectedTags: e.detail.value
    });
  },

  // 提交帖子
  submitPost() {
    const { content, selectedTags, isAnonymous, fileList } = this.data;
    
    // 验证必填字段
    if (!content.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }
    
    if (selectedTags.length === 0) {
      wx.showToast({
        title: '请至少选择一个标签',
        icon: 'none'
      });
      return;
    }
    
    // 显示提交状态
    this.setData({ isSubmitting: true });
    
    // 模拟提交
    setTimeout(() => {
      this.setData({ isSubmitting: false });
      
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          // 延迟返回列表页
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
    }, 1000);
  },
  
  // 返回上一页
  onBackTap() {
    if (this.data.content) {
      wx.showModal({
        title: '提示',
        content: '确定要放弃当前内容吗？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  }
});
