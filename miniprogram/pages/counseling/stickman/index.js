Page({
  data: {
    showInstructions: true,
    stressRelief: 0,
    selectedWeapon: 'fist',
    effects: [],
    canvas: null,
    ctx: null,
    canvasWidth: 0,
    canvasHeight: 0,
    stickman: {
      x: 0,
      y: 0,
      isHit: false,
      hitAnimation: 0,
      health: 100,
      maxHealth: 100
    },
    weapons: [
      { id: 'fist', name: '拳头', icon: '●', damage: 5, color: '#ff6b6b' },
      { id: 'bat', name: '球棒', icon: '|', damage: 15, color: '#ff9500' },
      { id: 'hammer', name: '锤子', icon: 'T', damage: 25, color: '#dc2626' },
      { id: 'sword', name: '利剑', icon: '/', damage: 30, color: '#7c3aed' },
      { id: 'magic', name: '魔法', icon: '*', damage: 35, color: '#06b6d4' }
    ],
    animationId: null
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '暴揍火柴人'
    });
  },

  onReady() {
    this.initCanvas();
  },

  initCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#gameCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        
        const dpr = wx.getSystemInfoSync().pixelRatio;
        const width = res[0].width;
        const height = res[0].height;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        
        this.setData({
          canvas,
          ctx,
          canvasWidth: width,
          canvasHeight: height,
          'stickman.x': width / 2,
          'stickman.y': height / 2
        });
      });
  },

  // 开始游戏
  startGame() {
    this.setData({
      showInstructions: false,
      stressRelief: 0,
      'stickman.health': 100,
      'stickman.isHit': false
    });
    this.gameLoop();
  },

  // 游戏循环
  gameLoop() {
    if (this.data.showInstructions) return;
    
    this.updateStickman();
    this.drawGame();
    this.updateEffects();
    
    this.data.animationId = this.data.canvas.requestAnimationFrame(() => {
      this.gameLoop();
    });
  },

  // 更新火柴人状态
  updateStickman() {
    if (this.data.stickman.isHit) {
      let hitAnimation = this.data.stickman.hitAnimation - 1;
      if (hitAnimation <= 0) {
        this.setData({
          'stickman.isHit': false,
          'stickman.hitAnimation': 0
        });
      } else {
        this.setData({
          'stickman.hitAnimation': hitAnimation
        });
      }
    }
  },

  // 绘制游戏场景
  drawGame() {
    const { ctx, canvasWidth, canvasHeight, stickman } = this.data;
    
    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // 绘制背景装饰
    this.drawBackground();
    
    // 绘制火柴人
    this.drawStickman();
    
    // 绘制打击范围提示
    this.drawHitArea();
  },

  // 绘制背景
  drawBackground() {
    const { ctx, canvasWidth, canvasHeight } = this.data;
    
    // 绘制地面
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, canvasHeight - 50, canvasWidth, 50);
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvasWidth; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasHeight);
      ctx.stroke();
    }
    for (let i = 0; i < canvasHeight; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvasWidth, i);
      ctx.stroke();
    }
  },

  // 绘制火柴人
  drawStickman() {
    const { ctx, stickman } = this.data;
    const { x, y, isHit, hitAnimation } = stickman;
    
    ctx.save();
    ctx.translate(x, y);
    
    // 被打击时的震动效果
    if (isHit) {
      const shake = hitAnimation * 2;
      ctx.translate(
        (Math.random() - 0.5) * shake,
        (Math.random() - 0.5) * shake
      );
    }
    
    // 设置线条样式
    ctx.strokeStyle = isHit ? '#ff0000' : '#000000';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    
    // 绘制头部
    ctx.beginPath();
    ctx.arc(0, -60, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    // 绘制身体
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(0, 40);
    ctx.stroke();
    
    // 绘制手臂
    const armOffset = isHit ? 15 : 0;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-30 - armOffset, 10);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(30 + armOffset, 10);
    ctx.stroke();
    
    // 绘制腿部
    const legOffset = isHit ? 10 : 0;
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(-25 - legOffset, 80);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(25 + legOffset, 80);
    ctx.stroke();
    
    // 绘制面部表情
    if (isHit) {
      // 痛苦表情
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(-8, -65, 4, 4); // 左眼
      ctx.fillRect(4, -65, 4, 4);  // 右眼
      ctx.beginPath();
      ctx.arc(0, -50, 8, 0, Math.PI);
      ctx.stroke(); // 痛苦的嘴
    } else {
      // 正常表情
      ctx.fillStyle = '#000000';
      ctx.fillRect(-6, -65, 3, 3); // 左眼
      ctx.fillRect(3, -65, 3, 3);  // 右眼
      ctx.beginPath();
      ctx.arc(0, -52, 5, 0, Math.PI);
      ctx.stroke(); // 嘴巴
    }
    
    ctx.restore();
  },

  // 绘制打击区域
  drawHitArea() {
    const { ctx, stickman } = this.data;
    const { x, y } = stickman;
    
    // 绘制可点击区域提示
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.arc(x, y, 80, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  },

  // 处理触摸事件
  onTouchStart(e) {
    if (this.data.showInstructions) return;
    
    const touch = e.touches[0];
    const { stickman } = this.data;
    
    // 计算点击位置与火柴人的距离
    const distance = Math.sqrt(
      Math.pow(touch.x - stickman.x, 2) + 
      Math.pow(touch.y - (stickman.y - 60), 2) // 减去头部高度偏移
    );
    
    // 如果点击在火柴人附近
    if (distance < 80) {
      this.hitStickman(touch.x, touch.y);
    }
  },

  onTouchMove() {
    // 不处理移动事件
  },

  onTouchEnd() {
    // 不处理结束事件
  },

  // 打击火柴人
  hitStickman(x, y) {
    const weapon = this.data.weapons.find(w => w.id === this.data.selectedWeapon);
    
    // 设置被击中状态
    this.setData({
      'stickman.isHit': true,
      'stickman.hitAnimation': 20 // 20帧的动画
    });
    
    // 增加压力释放值
    const newStressRelief = Math.min(100, this.data.stressRelief + weapon.damage / 2);
    this.setData({
      stressRelief: Math.floor(newStressRelief)
    });
    
    // 创建打击特效
    this.createEffect(x, y, weapon);
    
    // 震动反馈
    wx.vibrateShort();
  },

  // 创建特效
  createEffect(x, y, weapon) {
    const effects = this.data.effects;
    const effectTexts = ['POW', 'BAM', 'HIT', 'BANG', 'ZAP'];
    const randomText = effectTexts[Math.floor(Math.random() * effectTexts.length)];
    
    const effect = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 40,
      text: randomText,
      color: weapon.color,
      opacity: 1,
      timer: 60 // 60帧后消失
    };
    
    effects.push(effect);
    this.setData({ effects });
    
    // 设置特效消失定时器
    setTimeout(() => {
      this.removeEffect(effect.id);
    }, 1000);
  },

  // 更新特效
  updateEffects() {
    const effects = this.data.effects.map(effect => {
      effect.timer--;
      effect.opacity = effect.timer / 60;
      effect.y -= 2; // 向上移动
      return effect;
    }).filter(effect => effect.timer > 0);
    
    this.setData({ effects });
  },

  // 移除特效
  removeEffect(effectId) {
    const effects = this.data.effects.filter(effect => effect.id !== effectId);
    this.setData({ effects });
  },

  // 选择武器
  selectWeapon(e) {
    const weaponId = e.currentTarget.dataset.weapon;
    this.setData({
      selectedWeapon: weaponId
    });
    
    wx.vibrateShort();
  },

  // 重新开始游戏
  restartGame() {
    this.setData({
      stressRelief: 0,
      'stickman.isHit': false,
      'stickman.hitAnimation': 0,
      effects: []
    });
  },

  // 返回上一页
  onBackTap() {
    wx.navigateBack();
  },

  onUnload() {
    // 清理动画
    if (this.data.animationId) {
      this.data.canvas.cancelAnimationFrame(this.data.animationId);
    }
  }
}); 