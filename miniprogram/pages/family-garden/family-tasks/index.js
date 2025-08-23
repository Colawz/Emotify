Page({
  data: {
    // 今日关怀提醒
    careTasks: [
      {
        id: 1,
        title: '测量血压',
        time: '上午 9:00',
        icon: '🩺',
        completed: false
      },
      {
        id: 2,
        title: '服用降压药',
        time: '上午 10:00',
        icon: '💊',
        completed: false
      },
      {
        id: 3,
        title: '午休时间',
        time: '下午 2:00',
        icon: '😴',
        completed: false
      },
      {
        id: 4,
        title: '视频通话',
        time: '下午 7:00',
        icon: '📱',
        completed: false
      }
    ],

    // 健康监测
    healthTasks: [
      {
        id: 1,
        title: '血压记录',
        description: '记录今日血压值',
        icon: '🩺'
      },
      {
        id: 2,
        title: '血糖监测',
        description: '测量血糖水平',
        icon: '🩸'
      },
      {
        id: 3,
        title: '体重记录',
        description: '记录体重变化',
        icon: '⚖️'
      },
      {
        id: 4,
        title: '运动步数',
        description: '记录今日步数',
        icon: '🚶'
      }
    ],

    // 安全检查
    safetyTasks: [
      {
        id: 1,
        text: '检查门窗是否锁好',
        checked: false
      },
      {
        id: 2,
        text: '检查燃气阀门',
        checked: false
      },
      {
        id: 3,
        text: '检查电器电源',
        checked: false
      },
      {
        id: 4,
        text: '检查地面是否干燥',
        checked: false
      },
      {
        id: 5,
        text: '检查紧急药品',
        checked: false
      }
    ],

    // 社交互动
    socialTasks: [
      {
        id: 1,
        title: '社区活动',
        description: '参加老年活动中心',
        icon: '🏘️'
      },
      {
        id: 2,
        title: '亲友通话',
        description: '给家人朋友打电话',
        icon: '📞'
      },
      {
        id: 3,
        title: '邻里聊天',
        description: '和邻居说说话',
        icon: '👥'
      },
      {
        id: 4,
        title: '兴趣小组',
        description: '参加兴趣小组活动',
        icon: '🎨'
      }
    ],

    // 紧急联系
    emergencyContacts: [
      {
        id: 1,
        name: '张医生',
        relation: '家庭医生',
        phone: '138-0000-1234',
        avatar: '👨‍⚕️'
      },
      {
        id: 2,
        name: '李阿姨',
        relation: '社区志愿者',
        phone: '138-0000-5678',
        avatar: '👩‍🦳'
      },
      {
        id: 3,
        name: '王儿子',
        relation: '儿子',
        phone: '138-0000-9012',
        avatar: '👨'
      }
    ]
  },

  onLoad() {
    console.log('家庭小任务页面加载');
    this.updateSafetyCheckedCount();
  },

  // 更新安全检查完成数量
  updateSafetyCheckedCount() {
    const { safetyTasks } = this.data;
    const safetyCheckedCount = safetyTasks.filter(task => task.checked).length;
    this.setData({ safetyCheckedCount });
  },

  // 关怀提醒点击事件
  onCareTaskTap(e) {
    const { id } = e.currentTarget.dataset;
    const { careTasks } = this.data;
    const task = careTasks.find(t => t.id === id);
    
    if (task) {
      // 切换完成状态
      task.completed = !task.completed;
      this.setData({ careTasks });
      
      // 显示提示
      wx.showToast({
        title: task.completed ? '任务已完成' : '任务标记为未完成',
        icon: 'success',
        duration: 2000
      });
    }
  },

  // 健康监测点击事件
  onHealthTaskTap(e) {
    const { id } = e.currentTarget.dataset;
    const { healthTasks } = this.data;
    const task = healthTasks.find(t => t.id === id);
    
    if (task) {
      wx.showModal({
        title: task.title,
        content: `请记录${task.description}`,
        editable: true,
        placeholderText: '请输入数值...',
        success: (res) => {
          if (res.confirm && res.content) {
            wx.showToast({
              title: '记录成功',
              icon: 'success',
              duration: 2000
            });
          }
        }
      });
    }
  },

  // 安全检查点击事件
  onSafetyTaskTap(e) {
    const { id } = e.currentTarget.dataset;
    const { safetyTasks } = this.data;
    const task = safetyTasks.find(t => t.id === id);
    
    if (task) {
      // 切换检查状态
      task.checked = !task.checked;
      this.setData({ safetyTasks });
      this.updateSafetyCheckedCount();
      
      // 显示提示
      wx.showToast({
        title: task.checked ? '检查完成' : '取消检查',
        icon: 'success',
        duration: 2000
      });
    }
  },

  // 社交互动点击事件
  onSocialTaskTap(e) {
    const { id } = e.currentTarget.dataset;
    const { socialTasks } = this.data;
    const task = socialTasks.find(t => t.id === id);
    
    if (task) {
      wx.showModal({
        title: task.title,
        content: task.description,
        confirmText: '好的',
        showCancel: false
      });
    }
  },

  // 紧急联系点击事件
  onEmergencyCall(e) {
    const { phone } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '紧急联系',
      content: `是否拨打 ${phone}？`,
      confirmText: '拨打',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phone,
            fail: () => {
              wx.showToast({
                title: '拨打失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      }
    });
  }
});