Page({
  data: {
    // 任务统计数据
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    
    // 快速添加任务表单
    newTaskContent: '',
    selectedAssigneeIndex: 0,
    assigneeNames: [],
    
    // 任务筛选
    currentFilter: 'all',
    
    // 任务列表
    tasks: [],
    filteredTasks: [],
    
    // 任务分类 - 针对孤寡老人的关怀任务
    taskCategories: [
      {
        id: 1,
        name: '健康提醒',
        icon: '❤️',
        count: 0
      },
      {
        id: 2,
        name: '生活照料',
        icon: '🏠',
        count: 0
      },
      {
        id: 3,
        name: '情感陪伴',
        icon: '👥',
        count: 0
      },
      {
        id: 4,
        name: '安全监护',
        icon: '🛡️',
        count: 0
      }
    ],
    
    // 完成度统计
    completionRate: 0,
    weeklyCompleted: 0,
    weeklyAdded: 0
  },

  onLoad() {
    console.log('任务管理页面加载');
    
    // 初始化任务数据
    this.initTasks();
    
    // 初始化负责人列表
    this.initAssignees();
    
    // 更新统计数据
    this.updateStats();
    
    // 更新分类统计
    this.updateCategoryStats();
    
    // 更新完成度统计
    this.updateProgressStats();
  },

  // 初始化任务数据 - 针对孤寡老人的关怀任务
  initTasks() {
    const tasks = [
      {
        id: 1,
        title: '早上8点服用降压药',
        description: '记得饭后服用，每天一次',
        assigneeName: '社区医生',
        assigneeAvatar: '👨‍⚕️',
        priority: 'high',
        priorityText: '重要',
        deadline: '每天',
        category: '健康提醒',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: '每周一次视频通话',
        description: '和子女视频聊天，分享生活近况',
        assigneeName: '志愿者小李',
        assigneeAvatar: '👧',
        priority: 'medium',
        priorityText: '一般',
        deadline: '周日',
        category: '情感陪伴',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: '社区医院体检',
        description: '季度健康检查，测量血压血糖',
        assigneeName: '社区护士',
        assigneeAvatar: '👩‍⚕️',
        priority: 'medium',
        priorityText: '一般',
        deadline: '本月15日',
        category: '健康提醒',
        completed: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        title: '帮忙购买生活用品',
        description: '需要买米、油、盐等日常用品',
        assigneeName: '社区志愿者',
        assigneeAvatar: '👨',
        priority: 'low',
        priorityText: '不急',
        deadline: '本周内',
        category: '生活照料',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];
    
    this.setData({ tasks });
    this.filterTasks();
  },

  // 初始化负责人列表 - 针对孤寡老人的服务人员
  initAssignees() {
    const assignees = ['社区医生', '社区护士', '志愿者小李', '社工小王'];
    this.setData({ assigneeNames: assignees });
  },

  // 更新统计数据
  updateStats() {
    const { tasks } = this.data;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    this.setData({
      totalTasks,
      completedTasks,
      pendingTasks
    });
  },

  // 更新分类统计
  updateCategoryStats() {
    const { tasks, taskCategories } = this.data;
    
    const updatedCategories = taskCategories.map(category => {
      const count = tasks.filter(task => task.category === category.name).length;
      return { ...category, count };
    });
    
    this.setData({ taskCategories: updatedCategories });
  },

  // 更新完成度统计
  updateProgressStats() {
    const { tasks } = this.data;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // 模拟本周数据
    const weeklyCompleted = 12;
    const weeklyAdded = 15;
    
    this.setData({
      completionRate,
      weeklyCompleted,
      weeklyAdded
    });
  },

  // 语音输入关怀事项
  onVoiceInput() {
    wx.showLoading({
      title: '正在录音...'
    });
    
    // 模拟语音识别
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟语音转文字结果
      const voiceText = '我需要有人帮我买点生活用品';
      
      this.setData({
        newTaskContent: voiceText
      });
      
      wx.showToast({
        title: '语音识别成功',
        icon: 'success'
      });
    }, 2000);
  },

  // 输入任务内容
  onTaskInput(e) {
    this.setData({
      newTaskContent: e.detail.value
    });
  },

  // 选择负责人
  onAssigneeChange(e) {
    this.setData({
      selectedAssigneeIndex: e.detail.value
    });
  },

  // 添加任务
  onAddTask() {
    const { newTaskContent, selectedAssigneeIndex, assigneeNames, tasks } = this.data;
    
    if (!newTaskContent.trim()) {
      wx.showToast({
        title: '请输入任务内容',
        icon: 'none'
      });
      return;
    }
    
    const newTask = {
      id: Date.now(),
      title: newTaskContent.trim(),
      description: '',
      assigneeName: assigneeNames[selectedAssigneeIndex],
      assigneeAvatar: this.getAssigneeAvatar(assigneeNames[selectedAssigneeIndex]),
      priority: 'medium',
      priorityText: '中等',
      deadline: '今天',
      category: '家务劳动',
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    tasks.unshift(newTask);
    this.setData({ 
      tasks,
      newTaskContent: ''
    });
    
    // 更新相关统计
    this.updateStats();
    this.updateCategoryStats();
    this.updateProgressStats();
    this.filterTasks();
    
    wx.showToast({
      title: '任务添加成功',
      icon: 'success'
    });
  },

  // 获取负责人头像 - 针对服务人员
  getAssigneeAvatar(name) {
    const avatarMap = {
      '社区医生': '👨‍⚕️',
      '社区护士': '👩‍⚕️',
      '志愿者小李': '👧',
      '社工小王': '👨'
    };
    return avatarMap[name] || '👤';
  },

  // 切换任务完成状态
  onTaskToggle(e) {
    const { id } = e.currentTarget.dataset;
    const { tasks } = this.data;
    const task = tasks.find(t => t.id === id);
    
    if (task) {
      task.completed = !task.completed;
      this.setData({ tasks });
      
      // 更新相关统计
      this.updateStats();
      this.updateProgressStats();
      this.filterTasks();
    }
  },

  // 查看任务详情
  onTaskDetail(e) {
    const { id } = e.currentTarget.dataset;
    const task = this.data.tasks.find(t => t.id === id);
    
    if (task) {
      wx.showModal({
        title: task.title,
        content: `负责人：${task.assigneeName}\n优先级：${task.priorityText}\n截止时间：${task.deadline}\n\n${task.description || '暂无详细描述'}`,
        confirmText: '确定',
        showCancel: false
      });
    }
  },

  // 编辑任务
  onEditTask(e) {
    const { id } = e.currentTarget.dataset;
    const task = this.data.tasks.find(t => t.id === id);
    
    if (task) {
      wx.showModal({
        title: '编辑任务',
        editable: true,
        placeholderText: '修改任务内容...',
        content: task.title,
        success: (res) => {
          if (res.confirm && res.content) {
            task.title = res.content;
            this.setData({ tasks });
            this.filterTasks();
            
            wx.showToast({
              title: '任务修改成功',
              icon: 'success'
            });
          }
        }
      });
    }
  },

  // 删除任务
  onDeleteTask(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '删除任务',
      content: '确定要删除这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          const { tasks } = this.data;
          const updatedTasks = tasks.filter(task => task.id !== id);
          this.setData({ tasks: updatedTasks });
          
          // 更新相关统计
          this.updateStats();
          this.updateCategoryStats();
          this.updateProgressStats();
          this.filterTasks();
          
          wx.showToast({
            title: '任务删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 切换筛选条件
  onFilterChange(e) {
    const { filter } = e.currentTarget.dataset;
    this.setData({ currentFilter: filter });
    this.filterTasks();
  },

  // 筛选任务
  filterTasks() {
    const { tasks, currentFilter } = this.data;
    let filteredTasks = [];
    
    switch (currentFilter) {
      case 'all':
        filteredTasks = tasks;
        break;
      case 'pending':
        filteredTasks = tasks.filter(task => !task.completed);
        break;
      case 'completed':
        filteredTasks = tasks.filter(task => task.completed);
        break;
    }
    
    this.setData({ filteredTasks });
  },

  // 点击任务分类
  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset;
    const category = this.data.taskCategories.find(c => c.id === id);
    
    if (category) {
      wx.showModal({
        title: category.name,
        content: `共有${category.count}个相关任务`,
        confirmText: '查看任务',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '分类筛选功能开发中',
              icon: 'none'
            });
          }
        }
      });
    }
  }
});