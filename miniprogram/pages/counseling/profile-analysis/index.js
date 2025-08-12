Page({
  data: {
    radarChartSvg: '', // 存储生成的SVG数据
    // 大五人格维度解释
    dimensions: [
      { key: 'O', name: '开放性(Openness)', description: '指个人对新鲜、未知事物的接受和探索程度。高分者富有想象力、充满好奇心；低分者则更为务实、偏爱常规。' },
      { key: 'C', name: '尽责性(Conscientiousness)', description: '衡量了个人的责任感、条理性及自律能力。高分者通常严谨、可靠；低分者则更随性、灵活。' },
      { key: 'E', name: '外向性(Extraversion)', description: '反映了个体从社交活动中获取能量的倾向。高分者热情、善于交际；低分者则安静、内省。' },
      { key: 'A', name: '宜人性(Agreeableness)', description: '描述了个体在多大程度上是合作的、有同情心的。高分者通常乐于助人、值得信赖；低分者则更具批判性、倾向竞争。' },
      { key: 'N', name: '神经质(Neuroticism)', description: '也称情绪不稳定性，衡量个体体验负面情绪的倾向。高分者易感到焦虑、敏感；低分者则情绪稳定、沉着冷静。' }
    ],
    // 心理画像综合建议
    suggestion: '从画像来看，您是一个乐于接受新事物、对世界充满好奇的人（高开放性），同时在社交中充满活力（高外向性）。这让您能快速适应环境并建立广泛的人脉。在尽责性上，适当的规划能帮助您更好地实现目标。请继续保持您的独特优势，并留意情绪的波动，尝试通过正念日记等方式关照内心。'
  },

  onLoad(options) {
    // 模拟的用户数据 [O, C, E, A, N]
    const userData = [85, 60, 75, 55, 40];
    const svgDataUri = this.generateRadarChartSVG(userData);
    this.setData({
      radarChartSvg: svgDataUri
    });
  },

  /**
   * 生成雷达图的SVG数据URI
   * @param {number[]} data - 五个维度的得分，范围0-100
   */
  generateRadarChartSVG(data) {
    const size = 300; // SVG画布大小
    const center = size / 2;
    const numLevels = 5; // 网格层数
    const radius = center * 0.8; // 雷达图半径
    const numAxes = 5; // 5个维度
    const angleSlice = (Math.PI * 2) / numAxes;

    let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;

    // --- 绘制网格 ---
    for (let i = 1; i <= numLevels; i++) {
      let levelRadius = (radius / numLevels) * i;
      let points = '';
      for (let j = 0; j < numAxes; j++) {
        const x = center + levelRadius * Math.cos(angleSlice * j - Math.PI / 2);
        const y = center + levelRadius * Math.sin(angleSlice * j - Math.PI / 2);
        points += `${x},${y} `;
      }
      svg += `<polygon points="${points}" fill="none" stroke="#e0e0e0" stroke-width="1"/>`;
    }

    // --- 绘制坐标轴和标签 ---
    const labels = ['开放性', '尽责性', '外向性', '宜人性', '神经质'];
    for (let i = 0; i < numAxes; i++) {
      const x1 = center;
      const y1 = center;
      const x2 = center + radius * Math.cos(angleSlice * i - Math.PI / 2);
      const y2 = center + radius * Math.sin(angleSlice * i - Math.PI / 2);
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e0e0e0" stroke-width="1"/>`;
      
      const labelX = center + (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2);
      const labelY = center + (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2);
      svg += `<text x="${labelX}" y="${labelY}" font-size="14" fill="#666" text-anchor="middle" dominant-baseline="middle">${labels[i]}</text>`;
    }

    // --- 绘制数据多边形 ---
    let dataPoints = '';
    for (let i = 0; i < numAxes; i++) {
      const dataRadius = (data[i] / 100) * radius;
      const x = center + dataRadius * Math.cos(angleSlice * i - Math.PI / 2);
      const y = center + dataRadius * Math.sin(angleSlice * i - Math.PI / 2);
      dataPoints += `${x},${y} `;
    }
    svg += `<polygon points="${dataPoints}" fill="rgba(138, 50, 232, 0.5)" stroke="#8A32E8" stroke-width="2"/>`;

    svg += '</svg>';
    
    // 返回可以直接在image src中使用的数据URI
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
}); 