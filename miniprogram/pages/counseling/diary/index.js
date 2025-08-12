Page({
  data: {
    // 日记主题分类
    categories: [
      {
        id: 'mindfulness',
        title: '培养正念思考',
        description: '通过感恩、接纳与自信，更好地处理内心情绪。',
        emoji: '🧘',
        color: 'linear-gradient(135deg, #a8e063, #56ab2f)',
        topics: [
          { id: 'gratitude', title: '感恩日记', prompt: '写下今天让你心存感激的三件事。' },
          { id: 'acceptance', title: '培养自我接纳', prompt: '记录一个你最近接纳自己不完美之处的瞬间。' },
          { id: 'confidence', title: '增强自信心', prompt: '回忆一件你做得很好的事，描述当时的情景和你的感受。' },
          { id: 'anxiety', title: '处理焦虑和沮丧', prompt: '当感到焦虑或沮丧时，是什么触发了你的情绪？你是如何应对的？' },
          { id: 'uncertainty', title: '面对不确定性', prompt: '对于未来的一件不确定的事，写下你最坏的担心和最好的期待。' }
        ]
      },
      {
        id: 'exploration',
        title: '回望探索实践',
        description: '发现你的热爱与优势，感受自然与当下的美好。',
        emoji: '🧭',
        color: 'linear-gradient(135deg, #f6d365, #fda085)',
        topics: [
          { id: 'hobby', title: '探索你的爱好', prompt: '描述一件让你完全投入、忘记时间的事情。' },
          { id: 'strength', title: '看见个人优势', prompt: '在最近的一次挑战中，你运用了自己什么优点？' },
          { id: 'nature', title: '拥抱自然', prompt: '今天你注意到了哪些自然界的细节？比如一片云，一朵花。' },
          { id: 'present', title: '活在当下', prompt: '记录一个让你感到全然活在当下的时刻。' }
        ]
      },
      {
        id: 'relationships',
        title: '创造健康关系',
        description: '学习化解冲突，拥抱原谅，让爱与智慧在关系中流动。',
        emoji: '💞',
        color: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
        topics: [
          { id: 'love', title: '让爱涌现', prompt: '今天你向谁表达了爱意？或者从谁那里感受到了爱？' },
          { id: 'conflict', title: '化解冲突', prompt: '描述一次你与他人之间的小摩擦，以及你是如何处理的。' },
          { id: 'forgiveness', title: '拥抱原谅', prompt: '有没有一件小事，你可以选择原谅自己或他人？' },
          { id: 'create', title: '创造美好的关系', prompt: '你希望与某人的关系变成什么样？可以为此做些什么？' }
        ]
      }
    ]
  },

  onCategoryTap(e) {
    const { category } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/counseling/diary/topics/index?category=${encodeURIComponent(JSON.stringify(category))}`
    });
  },

  onLoad(options) {
  }
}); 