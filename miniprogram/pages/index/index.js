// miniprogram/pages/index/index.js
Page({
  data: {
    keyword: '',
    snackList: []
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  // ✅ 新增：跳转到评分页（复用 detail）
  goRate(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  // ✅ 新增：跳转到“我的”
  goMy() {
    wx.switchTab({ url: '/pages/my/my' }); // 注意：如果是 tabbar 页面，用 switchTab
  },

  // ✅ 新增：跳转到上传
  goUpload() {
    wx.navigateTo({ url: '/pages/upload/upload' });
  },

  loadSnacks() {
    const db = wx.cloud.database();
    let query = db.collection('snacks').where({ status: 'approved' });

    if (this.data.keyword.trim()) {
      query = query.where({
        name: db.RegExp({ regexp: this.data.keyword.trim(), options: 'i' })
      });
    }

    query.get().then(res => {
      const snacks = res.data.map(snack => {
        const ratio = snack.totalRatings > 0 ? snack.recommendCount / snack.totalRatings : 0;
        let recLevel = '';
        if (ratio <= 0.4) recLevel = '多半不推荐';
        else if (ratio <= 0.6) recLevel = '褒贬不一';
        else if (ratio <= 0.8) recLevel = '多半推荐';
        else recLevel = '好评如潮';

        const tasteDisplay = Object.entries(snack.tastes || {}).map(([key, val]) => {
          const labels = { sour: '酸', sweet: '甜', spicy: '辣', salty: '咸' };
          return `${labels[key]}: ${'⭐'.repeat(val || 0)}`;
        });

        return { ...snack, recLevel, tasteDisplay };
      });
      this.setData({ snackList: snacks });
    }).catch(err => {
      console.error('加载列表失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value }, this.loadSnacks);
  },

  onLoad() {
    this.loadSnacks();
  }
});