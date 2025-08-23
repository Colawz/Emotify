// pages/family-garden/chat-together/index.js
Page({
  data: {
    showScheduleForm: false,
    showCompanionDetail: false,
    selectedDate: '',
    selectedTime: '',
    callTypeIndex: 0,
    callTypes: ['语音通话', '视频通话'],
    remark: '',
    selectedCompanion: null,

    companions: [
      {
        id: 1,
        name: '温暖陪伴者',
        type: '学生志愿者',
        rating: 4.9,
        avatar: '👤',
        intro: '我是大学生志愿者，热爱与人交流，擅长倾听和陪伴。希望能用我的时间和温暖，为您带来愉快的聊天体验。',
        services: ['💬 日常聊天', '🎵 音乐分享', '📚 故事分享', '🌟 情感支持'],
        online: true,
        age: 22,
        major: '心理学',
        experience: '2年陪伴经验',
        companionCount: 156,
        responseRate: '98%',
        serviceTime: '周一至周五 18:00-22:00',
        specialties: ['情感倾听', '心理疏导', '生活分享', '学习指导']
      },
      {
        id: 2,
        name: '阳光陪伴者',
        type: '专业陪伴师',
        rating: 4.8,
        avatar: '🌞',
        intro: '我是一名专业的陪伴师，具有丰富的沟通经验和心理学知识。擅长为不同年龄段的人提供个性化的陪伴服务。',
        services: ['💬 深度交流', '🧠 心理支持', '🎯 目标规划', '🌱 成长陪伴'],
        online: true,
        age: 28,
        major: '应用心理学',
        experience: '5年陪伴经验',
        companionCount: 342,
        responseRate: '95%',
        serviceTime: '周一至周日 10:00-22:00',
        specialties: ['专业咨询', '情绪管理', '关系指导', '生涯规划']
      },
      {
        id: 3,
        name: '知心陪伴者',
        type: '退休教师',
        rating: 4.7,
        avatar: '👵',
        intro: '我是一名退休的语文教师，有丰富的人生阅历和教学经验。喜欢与年轻人交流，分享人生智慧和温暖关怀。',
        services: ['💬 人生分享', '📖 文化交流', '🍵 生活指导', '🎨 兴趣培养'],
        online: false,
        age: 62,
        major: '汉语言文学',
        experience: '10年陪伴经验',
        companionCount: 89,
        responseRate: '92%',
        serviceTime: '周二、周四、周六 14:00-18:00',
        specialties: ['人生指导', '文化传承', '情感支持', '兴趣培养']
      }
    ]
  },

  onLoad: function(options) {
    // 页面加载时的初始化逻辑
    console.log('陪我聊聊页面加载');
  },

  // 一键呼叫功能
  onQuickCall: function(e) {
    const type = e.currentTarget.dataset.type;
    
    switch(type) {
      case 'voice':
        this.makeVoiceCall();
        break;
      case 'video':
        this.makeVideoCall();
        break;
      case 'schedule':
        this.showScheduleForm();
        break;
    }
  },

  // 语音通话
  makeVoiceCall: function() {
    wx.showModal({
      title: '语音通话',
      content: '正在为您连接语音通话...',
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          // 这里可以添加实际的通话逻辑
          wx.showToast({
            title: '通话功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 视频通话
  makeVideoCall: function() {
    wx.showModal({
      title: '视频通话',
      content: '正在为您连接视频通话...',
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          // 这里可以添加实际的通话逻辑
          wx.showToast({
            title: '通话功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 显示约定时间表单
  showScheduleForm: function() {
    this.setData({
      showScheduleForm: true
    });
  },

  // 关闭约定时间表单
  closeScheduleForm: function() {
    this.setData({
      showScheduleForm: false,
      selectedDate: '',
      selectedTime: '',
      callTypeIndex: 0,
      remark: ''
    });
  },

  // 日期选择
  onDateChange: function(e) {
    this.setData({
      selectedDate: e.detail.value
    });
  },

  // 时间选择
  onTimeChange: function(e) {
    this.setData({
      selectedTime: e.detail.value
    });
  },

  // 通话类型选择
  onCallTypeChange: function(e) {
    this.setData({
      callTypeIndex: e.detail.value
    });
  },

  // 备注输入
  onRemarkInput: function(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 提交约定
  submitSchedule: function() {
    const { selectedDate, selectedTime, callTypeIndex, remark } = this.data;
    
    if (!selectedDate || !selectedTime) {
      wx.showToast({
        title: '请选择日期和时间',
        icon: 'none'
      });
      return;
    }
    
    const callType = this.data.callTypes[callTypeIndex];
    const scheduleInfo = {
      date: selectedDate,
      time: selectedTime,
      type: callType,
      remark: remark,
      createTime: new Date().toISOString()
    };
    
    // 这里可以添加保存到数据库的逻辑
    console.log('约定信息:', scheduleInfo);
    
    wx.showModal({
      title: '约定成功',
      content: `您已成功约定${callType}，时间：${selectedDate} ${selectedTime}`,
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          this.closeScheduleForm();
          wx.showToast({
            title: '约定成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 陪伴者服务
  onCompanionTap: function(e) {
    const companionId = e.currentTarget.dataset.id;
    const companion = this.data.companions.find(item => item.id === companionId);
    
    if (companion) {
      this.setData({
        selectedCompanion: companion,
        showCompanionDetail: true
      });
    }
  },

  // 关闭陪伴者详情
  closeCompanionDetail: function() {
    this.setData({
      showCompanionDetail: false
    });
  },

  // 联系陪伴者
  contactCompanion: function() {
    wx.showModal({
      title: '联系陪伴者',
      content: '正在为您连接陪伴者...',
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          // 这里可以添加实际的联系逻辑
          wx.showToast({
            title: '联系功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 分享功能
  onShareAppMessage: function() {
    return {
      title: '陪我聊聊 - 温暖陪伴，让爱不再遥远',
      path: '/pages/family-garden/chat-together/index',
      imageUrl: '/images/share-image.jpg'
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