Page({
  data: {
    topic: null,      // 当前日记主题
    inputValue: ''    // 用户输入的内容
  },

  onLoad(options) {
    if (options.topic) {
      const topic = JSON.parse(decodeURIComponent(options.topic));
      this.setData({
        topic: topic
      });
      wx.setNavigationBarTitle({
        title: topic.title || '写日记'
      });
    }
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  onSave() {
    if (!this.data.inputValue.trim()) {
      wx.showToast({
        title: '内容不能为空哦',
        icon: 'none'
      });
      return;
    }

    const newDiary = {
      id: Date.now(),
      topic: this.data.topic,
      content: this.data.inputValue,
      createdAt: new Date().toISOString()
    };

    // 从缓存中获取旧日记
    const diaries = wx.getStorageSync('diaries') || [];
    // 添加新日记并存回缓存
    wx.setStorageSync('diaries', [newDiary, ...diaries]);

    wx.showToast({
      title: '保存成功！',
      icon: 'success'
    });

    // 延时返回上一页
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
}); 