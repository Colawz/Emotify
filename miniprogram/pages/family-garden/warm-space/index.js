Page({
  data: {
    isWatering: false,
    currentTab: 'tree',
    // 家庭小树数据
    familyTree: {
      name: '家庭爱心树',
      level: 'Lv.1 幼苗期',
      emoji: '🌱',
      progress: 30,
      maxProgress: 100,
      days: 7,
      waterCount: 12,
      memberCount: 4
    },
    
    // 浇水记录数据
    waterRecords: [
      {
        id: 1,
        time: '今天 14:30',
        member: '妈妈',
        action: '温柔地给小树浇了水💕'
      },
      {
        id: 2,
        time: '今天 09:15',
        member: '爸爸',
        action: '认真地给小树浇了水🌿'
      },
      {
        id: 3,
        time: '昨天 18:45',
        member: '小明',
        action: '开心地给小树浇了水🌱'
      },
      {
        id: 4,
        time: '昨天 12:20',
        member: '小红',
        action: '充满爱心地给小树浇了水💚'
      },
      {
        id: 5,
        time: '前天 16:30',
        member: '妈妈',
        action: '带着微笑给小树浇了水😊'
      }
    ],
    
    // 家庭动态数据
    familyPosts: [
      {
        id: 1,
        authorName: '妈妈',
        authorAvatar: '👩',
        time: '2小时前',
        content: '今天做了小明最爱吃的红烧肉，看着他吃得那么香，心里特别满足。孩子健康成长就是最大的幸福！',
        images: [
          '/assets/images_warm_space/红烧肉.png', 
          '/assets/images_warm_space/吃红烧肉.png' 
        ],
        likeCount: 12,
        commentCount: 3,
        isLiked: false
      },
      {
        id: 2,
        authorName: '爸爸',
        authorAvatar: '👨',
        time: '昨天',
        content: '周末带孩子们去公园玩，看到他们开心的样子，所有的辛苦都值得了。家庭时光是最珍贵的财富。',
        images: [
          '/assets/images_warm_space/公园.png' 
        ],
        likeCount: 8,
        commentCount: 5,
        isLiked: true
      }
    ],
    
    // 家庭相册数据
    familyAlbum: [
      {
        id: 1,
        title: '2024春节',
        cover: '/assets/images_warm_space/年夜饭.png', 
        photoCount: 24
      },
      {
        id: 2,
        title: '小明生日',
         cover:  '/assets/images_warm_space/小明生日.png', 
        photoCount: 18
      },
      {
        id: 3,
        title: '家庭旅行',
        cover: '/assets/images_warm_space/旅行.png', 
        photoCount: 32
      },
      {
        id: 4,
        title: '日常点滴',
        cover: '/assets/images_warm_space/日常.png', 
        photoCount: 56
      }
    ],
    
    // 重要时刻数据
    importantMoments: [
      {
        id: 1,
        date: '2024年1月1日',
        title: '新年家庭聚会',
        description: '全家人一起迎接新年，许下了美好的愿望，希望新的一年家人健康平安。',
        images: [
          '/assets/images_warm_space/元旦家庭聚会.png' 
        ]
      },
      {
        id: 2,
        date: '2023年12月25日',
        title: '小明考试第一名',
        description: '小明在期末考试中取得了全班第一的好成绩，全家人都为他感到骄傲！',
        images: [
          '/assets/images_warm_space/第一名.png' 
        ]
      },
      {
        id: 3,
        date: '2023年10月1日',
        title: '国庆家庭旅行',
        description: '全家人一起去海边旅行，孩子们第一次看到大海，特别兴奋。',
        images: [
          '/assets/images_warm_space/国庆旅行.png' 
        ]
      }
    ],
    
    // 家庭成员数据
    familyMembers: [
      {
        id: 1,
        name: '爸爸',
        role: '父亲',
        avatar: '👨'
      },
      {
        id: 2,
        name: '妈妈',
        role: '母亲',
        avatar: '👩'
      },
      {
        id: 3,
        name: '小明',
        role: '儿子',
        avatar: '👦'
      },
      {
        id: 4,
        name: '小红',
        role: '女儿',
        avatar: '👧'
      }
    ]
  },

  // 选择图片
  chooseImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const images = res.tempFilePaths;
        wx.showModal({
          title: '发布动态',
          editable: true,
          placeholderText: '说点什么...',
          success: (res) => {
            if (res.confirm) {
              this.addNewPost({
                content: res.content || '分享了一些照片',
                images: images
              });
            }
          }
        });
      }
    });
  },

  // 发布动态
  onAddPost() {
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success: (res) => {
        const actions = ['camera', 'album'];
        this.chooseImage(actions[res.tapIndex]);
      }
    });
  },

  // 添加新动态
  addNewPost(postData) {
    const { familyPosts } = this.data;
    const newPost = {
      id: Date.now(),
      authorName: '我',
      authorAvatar: '👤',
      time: '刚刚',
      content: postData.content,
      images: postData.images,
      likeCount: 0,
      commentCount: 0,
      isLiked: false
    };
    
    familyPosts.unshift(newPost);
    this.setData({ familyPosts });
    
    wx.showToast({
      title: '发布成功',
      icon: 'success'
    });
  },

  // 动态菜单
  onPostMenu(e) {
    const { id } = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ['编辑', '删除', '举报'],
      success: (res) => {
        const actions = ['edit', 'delete', 'report'];
        this.handlePostAction(actions[res.tapIndex], id);
      }
    });
  },

  // 处理动态操作
  handlePostAction(action, postId) {
    switch (action) {
      case 'edit':
        wx.showToast({
          title: '编辑功能开发中',
          icon: 'none'
        });
        break;
      case 'delete':
        wx.showModal({
          title: '删除动态',
          content: '确定要删除这条动态吗？',
          success: (res) => {
            if (res.confirm) {
              this.deletePost(postId);
            }
          }
        });
        break;
      case 'report':
        wx.showToast({
          title: '举报功能开发中',
          icon: 'none'
        });
        break;
    }
  },

  // 删除动态
  deletePost(postId) {
    const { familyPosts } = this.data;
    const updatedPosts = familyPosts.filter(post => post.id !== postId);
    this.setData({ familyPosts: updatedPosts });
    
    wx.showToast({
      title: '删除成功',
      icon: 'success'
    });
  },

  // 点击家庭成员
  onMemberTap(e) {
    const { id } = e.currentTarget.dataset;
    const member = this.data.familyMembers.find(m => m.id === id);
    
    if (member) {
      wx.showModal({
        title: member.name,
        content: `角色：${member.role}`,
        confirmText: '查看详情',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '成员详情功能开发中',
              icon: 'none'
            });
          }
        }
      });
    }
  },

  // 浇水功能
  onWaterTree() {
    const { familyTree, waterRecords } = this.data;
    const now = new Date();
    const timeStr = `今天 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // 随机选择一个家庭成员
    const members = ['我', '爸爸', '妈妈', '小明', '小红'];
    const randomMember = members[Math.floor(Math.random() * members.length)];
    
    // 丰富的浇水动作描述
    const waterActions = [
      '小心翼翼地给小树浇了水💧',
      '开心地给小树浇了水🌱',
      '温柔地给小树浇了水💕',
      '认真地给小树浇了水🌿',
      '充满爱心地给小树浇了水💚',
      '轻柔地给小树浇了水🍃',
      '兴奋地给小树浇了水🌳',
      '细心地给小树浇了水🌲',
      '满怀期待地给小树浇了水🌴',
      '带着微笑给小树浇了水😊',
      '哼着歌给小树浇了水🎵',
      '边跳舞边给小树浇了水💃',
      '带着阳光的心情给小树浇了水☀️',
      '用爱心滋养小树🥰',
      '为小树带来生命之源💦'
    ];
    
    const randomAction = waterActions[Math.floor(Math.random() * waterActions.length)];
    
    // 更新小树数据
    const newProgress = Math.min(familyTree.progress + 5, familyTree.maxProgress);
    const newWaterCount = familyTree.waterCount + 1;
    
    // 添加浇水记录
    const newRecord = {
      id: Date.now(),
      time: timeStr,
      member: randomMember,
      action: randomAction
    };
    
    // 更新小树等级
    let newLevel = familyTree.level;
    let newEmoji = familyTree.emoji;
    
    if (newProgress >= 80 && newProgress < 100) {
      newLevel = 'Lv.2 茁壮期';
      newEmoji = '🌿';
    } else if (newProgress >= 50 && newProgress < 80) {
      newLevel = 'Lv.1.5 成长期';
      newEmoji = '🍃';
    }
    
    // 更新数据
    this.setData({
      'familyTree.progress': newProgress,
      'familyTree.waterCount': newWaterCount,
      'familyTree.level': newLevel,
      'familyTree.emoji': newEmoji,
      waterRecords: [newRecord, ...waterRecords]
    });
    
    // 触发浇水动画
    this.setData({
      'isWatering': true
    });
    
    setTimeout(() => {
      this.setData({
        'isWatering': false
      });
    }, 800);
    
    // 丰富的浇水反馈消息
    const waterMessages = [
      '浇水成功！小树很开心~',
      '小树喝饱了水，长得更精神了！',
      '哇！小树好像长高了一点点！',
      '小树在向你招手呢！🌱',
      '浇水成功！小树充满活力！',
      '小树感受到了你的爱意~💕',
      '太棒了！小树又成长了一些！',
      '小树在阳光下闪闪发光✨',
      '浇水成功！小树很开心！',
      '小树说谢谢你的照顾！🥰'
    ];
    
    const randomMessage = waterMessages[Math.floor(Math.random() * waterMessages.length)];
    
    // 显示浇水成功提示
    wx.showToast({
      title: randomMessage,
      icon: 'success',
      duration: 2000
    });
    
    // 随机显示小树表情变化
    const treeEmojis = ['🌱', '🌿', '🍃', '🌳', '🌲', '🎋'];
    if (newWaterCount % 5 === 0) {
      const newEmoji = treeEmojis[Math.floor(Math.random() * treeEmojis.length)];
      this.setData({
        'familyTree.emoji': newEmoji
      });
    }
    
    // 检查是否升级
    if (newProgress >= familyTree.maxProgress) {
      setTimeout(() => {
        wx.showModal({
          title: '恭喜！',
          content: '小树已经长大啦！即将进入下一阶段...',
          showCancel: false,
          confirmText: '太棒了！'
        });
      }, 1500);
    }
    
    // 特殊里程碑提示
    if (newWaterCount === 20) {
      setTimeout(() => {
        wx.showModal({
          title: '里程碑达成！',
          content: '已经浇水20次了！小树越来越茂盛了！',
          showCancel: false,
          confirmText: '继续加油！'
        });
      }, 2500);
    } else if (newWaterCount === 50) {
      setTimeout(() => {
        wx.showModal({
          title: '超级里程碑！',
          content: '已经浇水50次了！你是个超级园丁！',
          showCancel: false,
          confirmText: '太厉害了！'
        });
      }, 2500);
    }
  },

  // 底部导航栏点击事件
  onNavTap: function(e) {
    const tab = e.currentTarget.dataset.tab;
    
    // 更新当前选中的标签，页面内容会根据currentTab自动切换显示
    this.setData({
      currentTab: tab
    });
  }
});