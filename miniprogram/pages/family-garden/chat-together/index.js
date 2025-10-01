// pages/family-garden/chat-together/index.js
Page({
  data: {
    showScheduleForm: false,
    showCompanionDetail: false,
    selectedDate: '',
    selectedTime: '',
    callTypeIndex: 0,
    callTypes: ['语音通话', '视频通话', '文字聊天'],
    remark: '',
    selectedCompanion: null,

    companions: [
      {
        id: 1,
        name: '小王',
        type: '情感陪伴',
        rating: 4.9,
        avatar: '/assets/avatars_chat_with_me/1.jpg',
        intro: '我是一个温暖贴心的陪伴者，擅长倾听和提供情感支持。',
        services: ['情感支持', '生活指导', '压力缓解', '情感咨询'],
        online: true,
        age: 25,
        major: '心理学',
        experience: '3年心理咨询经验',
        companionCount: 156,
        responseRate: '98%',
        serviceTime: '9:00-22:00',
        specialties: ['焦虑缓解', '情绪调节', '人际关系']
      },
      {
        id: 2,
        name: '暖暖',
        type: '生活导师',
        rating: 4.8,
        avatar: '/assets/avatars_chat_with_me/2.png',
        intro: '专业的生活教练，帮助你找到人生方向和动力。',
        services: ['生活规划', '目标设定', '职业指导', '个人成长'],
        online: false,
        age: 32,
        major: '管理学',
        experience: '5年生活指导经验',
        companionCount: 203,
        responseRate: '95%',
        serviceTime: '10:00-20:00',
        specialties: ['职业规划', '时间管理', '目标达成']
      },
      {
        id: 3,
        name: '小月',
        type: '学习伙伴',
        rating: 4.7,
        avatar: '/assets/avatars_chat_with_me/3.png',
        intro: '耐心的学习陪伴者，帮助你克服学习困难，提高效率。',
        services: ['学习规划', '学习方法', '考试准备', '学业支持'],
        online: true,
        age: 23,
        major: '教育学',
        experience: '2年教育指导经验',
        companionCount: 89,
        responseRate: '97%',
        serviceTime: '14:00-23:00',
        specialties: ['学习效率', '考试焦虑', '学习习惯']
      }
    ]
  },

  onLoad: function(options) {
    // 页面加载时的初始化逻辑
    console.log('陪我聊聊页面加载');
  },

  // 一键呼叫功能
  onQuickCall(e) {
    const type = e.currentTarget.dataset.type;
    console.log('快速呼叫类型:', type);
    
    if (type === 'schedule') {
      this.setData({
        showScheduleForm: true
      });
    } else {
      wx.showToast({
        title: type === 'voice' ? '正在连接语音通话...' : '正在连接视频通话...',
        icon: 'loading',
        duration: 2000
      });
      
      // 模拟连接过程
      setTimeout(() => {
        wx.showToast({
          title: '连接成功！',
          icon: 'success'
        });
      }, 2000);
    }
  },

  // 语音通话
  onVoiceCall() {
    wx.showToast({
      title: '正在连接语音通话...',
      icon: 'loading',
      duration: 2000
    });
  },

  // 视频通话
  onVideoCall() {
    wx.showToast({
      title: '正在连接视频通话...',
      icon: 'loading',
      duration: 2000
    });
  },

  // 预约时间
  onScheduleCall() {
    this.setData({
      showScheduleForm: true
    });
  },

  // 显示预约表单
  showScheduleForm() {
    this.setData({
      showScheduleForm: true
    });
  },

  // 关闭预约表单
  closeScheduleForm() {
    this.setData({
      showScheduleForm: false,
      selectedDate: '',
      selectedTime: '',
      callTypeIndex: 0,
      remark: ''
    });
  },

  // 日期选择
  onDateChange(e) {
    this.setData({
      selectedDate: e.detail.value
    });
  },

  // 时间选择
  onTimeChange(e) {
    this.setData({
      selectedTime: e.detail.value
    });
  },

  // 通话类型选择
  onCallTypeChange(e) {
    this.setData({
      callTypeIndex: e.detail.value
    });
  },

  // 备注输入
  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 提交预约
  submitSchedule() {
    if (!this.data.selectedDate || !this.data.selectedTime) {
      wx.showToast({
        title: '请选择日期和时间',
        icon: 'none'
      });
      return;
    }

    wx.showToast({
      title: '预约成功！',
      icon: 'success'
    });

    this.closeScheduleForm();
  },

  // 预约成功
  onScheduleSuccess() {
    wx.showToast({
      title: '预约成功！我们会及时联系您',
      icon: 'success',
      duration: 2000
    });
    this.setData({
      showScheduleForm: false
    });
  },

  // 显示陪伴者详情
  onCompanionTap(e) {
    const id = e.currentTarget.dataset.id;
    const companion = this.data.companions.find(c => c.id === id);
    this.setData({
      selectedCompanion: companion,
      showCompanionDetail: true
    });
  },

  // 关闭陪伴者详情
  closeCompanionDetail() {
    this.setData({
      showCompanionDetail: false,
      selectedCompanion: null
    });
  },

  // 联系陪伴者
  contactCompanion() {
    wx.showToast({
      title: '正在连接陪伴者...',
      icon: 'loading',
      duration: 2000
    });
    
    setTimeout(() => {
      wx.showToast({
        title: '连接成功！',
        icon: 'success'
      });
    }, 2000);
  },

  // 分享应用
  onShareAppMessage() {
    return {
      title: '温暖陪伴，让爱更近',
      path: '/pages/family-garden/chat-together/index'
    };
  },

  // 页面显示时的处理
  onShow: function() {
    // 页面显示时的逻辑
  },

  // 页面隐藏时的处理
  onHide: function() {
    // 页面隐藏时的逻辑
  },

  // 页面卸载时的处理
  onUnload: function() {
    // 页面卸载时的逻辑
  },


});