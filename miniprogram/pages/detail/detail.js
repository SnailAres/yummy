// miniprogram/pages/detail/detail.js
Page({
  data: {
    snack: null,
    userScore: 6,
    snackId: '',
    tasteDisplay: [],
    recommendPercent: 0
  },

  // ✅ 新增：返回上一页
  goBack() {
    wx.navigateBack();
  },

  onScoreChange(e) {
    this.setData({ userScore: e.detail.value });
  },

  submitRating() {
    if (!this.data.snackId) {
      wx.showToast({ title: '无效零食', icon: 'none' });
      return;
    }

    wx.cloud.callFunction({
      name: 'rateSnack',
      data: { snackId: this.data.snackId, score: this.data.userScore }
    }).then(res => {
      wx.showToast({ title: '评分成功' });
      // 重新加载详情以更新推荐数据
      this.loadSnackDetail(this.data.snackId);
    }).catch(err => {
      console.error('评分失败:', err);
      wx.showToast({ title: err.message || '评分失败', icon: 'none' });
    });
  },

  formatTasteDisplay(tastes) {
    const labels = { sour: '酸', sweet: '甜', spicy: '辣', salty: '咸' };
    return Object.entries(tastes || {}).map(([key, val]) =>
      `${labels[key]}: ${'⭐'.repeat(val || 0)}`
    );
  },

  loadSnackDetail(id) {
    const db = wx.cloud.database();
    db.collection('snacks').doc(id).get().then(res => {
      const snack = res.data;
      if (!snack || snack.status !== 'approved') {
        wx.showToast({ title: '零食不存在或未审核', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      const ratio = snack.totalRatings > 0 ? snack.recommendCount / snack.totalRatings : 0;
      let recLevel = '';
      if (ratio <= 0.4) recLevel = '多半不推荐';
      else if (ratio <= 0.6) recLevel = '褒贬不一';
      else if (ratio <= 0.8) recLevel = '多半推荐';
      else recLevel = '好评如潮';

      const recommendPercent = Math.round(ratio * 100); // 整数百分比，如 85
      const tasteDisplay = this.formatTasteDisplay(snack.tastes);

      this.setData({
        snack: { ...snack, recLevel },
        tasteDisplay,
        recommendPercent,
        snackId: id
      });
    }).catch(err => {
      console.error('加载详情失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    });
  },

  onLoad(options) {
    const id = options.id;
    if (!id) {
      wx.showToast({ title: '缺少参数', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1000);
      return;
    }
    this.loadSnackDetail(id);
  }
});