Page({
  data: {
    category: null, // 保存上级页面传来的主题数据
    // 预设的气泡背景色
    bubbleColors: [
      '#FFDDC1', '#FFD1DC', '#D1FFDC', '#D1D1FF', '#FFFFD1',
      '#C1FFD7', '#D7C1FF', '#FFC1C1', '#C1D7FF', '#DDC1FF'
    ]
  },

  onLoad(options) {
    if (options.category) {
      const category = JSON.parse(decodeURIComponent(options.category));

      // 为每个topic随机分配一个背景色并截断prompt
      if (category.topics && category.topics.length > 0) {
        category.topics.forEach(topic => {
          // 随机颜色
          const randomIndex = Math.floor(Math.random() * this.data.bubbleColors.length);
          topic.bgColor = this.data.bubbleColors[randomIndex];
          // 简短介绍
          if (topic.prompt) {
            topic.shortPrompt = topic.prompt.substring(0, 20) + '...';
          }
        });
      }

      this.setData({
        category: category
      });
      // 动态设置导航栏标题为当前主题的标题
      wx.setNavigationBarTitle({
        title: category.title || '选择话题'
      });
    }
  },

  onTopicTap(e) {
    const { topic } = e.currentTarget.dataset;
    // 跳转到具体的日记编写页面，并传递话题信息
    wx.navigateTo({
      url: `/pages/counseling/diary/write/index?topic=${encodeURIComponent(JSON.stringify(topic))}`
    });
  }
}); 