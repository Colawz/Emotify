Page({
  data: {
    currentTab: 'discover', // 底部导航栏当前选中的tab
    postList: [], // 树洞帖子列表
    isRefreshing: false,
    // 添加头像配置
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
    ]
  },

  onLoad() {
    this.loadPosts();
  },

  // 根据ID获取固定头像
  getAvatarById(id) {
    const { avatarList } = this.data;
    const index = (id - 1) % avatarList.length;
    return avatarList[index];
  },

  // 加载帖子数据
  loadPosts() {
    wx.showLoading({
      title: '加载中...',
    });

    // 模拟数据
    const mockPosts = [
      {
        id: 1,
        content: '最近压力好大，总是莫名其妙地烦躁',
        publishTime: '2024-03-15',
        tags: ['学业压力', '求助'],
        likeCount: 23,
        commentCount: 8,
        isLiked: false,
        avatar: this.getAvatarById(1), // 使用固定头像
        comments: [
          {
            id: 1,
            username: '匿名用户',
            content: '建议你试试运动，我每次压力大的时候都去跑步，效果很好！',
            time: '1小时前',
            avatar: this.getAvatarById(8) // 评论者使用固定头像
          }
        ]
      },
      {
        id: 2,
        content: '和室友的关系最近有点紧张，不知道该怎么处理，好烦恼...',
        publishTime: '昨天',
        tags: ['人际关系', '情感'],
        likeCount: 15,
        commentCount: 12,
        isLiked: false,
        avatar: this.getAvatarById(2),
        comments: []
      },
      {
        id: 3,
        content: '今天和朋友聊天，发现自己对未来的职业规划还是很迷茫。大家都是怎么确定自己的职业方向的？',
        publishTime: '2天前',
        tags: ['职业规划', '求助'],
        likeCount: 45,
        commentCount: 20,
        isLiked: false,
        avatar: this.getAvatarById(3),
        comments: []
      },
      {
        id: 4,
        content: '考研的压力真的太大了，每天都焦虑得睡不着觉，感觉永远都学不完...',
        publishTime: '3天前',
        tags: ['学业压力', '考研'],
        likeCount: 56,
        commentCount: 25,
        isLiked: false,
        avatar: this.getAvatarById(4),
        comments: []
      },
      {
        id: 5,
        content: '有没有同学暗恋过别人的？那段时间是怎么熬过来的？',
        publishTime: '3天前',
        tags: ['情感问题', '分享'],
        likeCount: 78,
        commentCount: 30,
        isLiked: false,
        avatar: this.getAvatarById(5),
        comments: []
      }
    ];

    // 延迟模拟网络请求
    setTimeout(() => {
      this.setData({
        postList: mockPosts,
        isRefreshing: false
      });
      wx.hideLoading();
    }, 500);
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      isRefreshing: true
    });
    this.loadPosts();
    wx.stopPullDownRefresh();
  },

  // 点赞操作
  onLikeTap(e) {
    const { id, index } = e.currentTarget.dataset;
    const posts = [...this.data.postList];
    const isLiked = !posts[index].isLiked;
    
    posts[index].isLiked = isLiked;
    posts[index].likeCount = isLiked 
      ? posts[index].likeCount + 1 
      : posts[index].likeCount - 1;
    
    this.setData({
      postList: posts
    });
    
    wx.showToast({
      title: isLiked ? '已点赞' : '已取消点赞',
      icon: 'none'
    });
  },

  // 评论操作
  onCommentTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.showToast({
      title: '评论功能开发中',
      icon: 'none'
    });
  },

  // 分享操作
  onShareTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  },

  // 帖子详情
  onPostTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.showToast({
      title: '详情页面开发中',
      icon: 'none'
    });
  },

  // 发布新帖子
  onPublishTap() {
    wx.navigateTo({
      url: '/pages/counseling/treehole/publish'
    });
  },

  // 返回上一页
  onBackTap() {
    wx.navigateBack();
  },

  // 底部导航栏切换事件处理函数
  onTabBarChange(e) {
    const value = e.detail.value;
    
    // 更新当前选中的标签
    this.setData({
      currentTab: value
    });
    
    // 根据选中的tab的value进行页面跳转
    switch (value) {
      case 'ai-chat':
        wx.switchTab({ url: '/pages/ai-chat/index' });
        break;
      case 'discover':
        wx.switchTab({ url: '/pages/discover/index' });
        break;
      case 'message':
        wx.switchTab({ url: '/pages/message/index' });
        break;
      case 'profile':
        wx.switchTab({ url: '/pages/profile/index' });
        break;
    }
  },
});