const api = require("../../services/api");

Page({
  data: {
    categories: [],
    topics: [],
    ranking: [],
  },
  onShow() {
    this.loadData();
  },
  async loadData() {
    try {
      const data = await api.getHomeFeed();
      this.setData({
        categories: data.categories || [],
        topics: data.topics || [],
        ranking: data.ranking || [],
      });
    } catch (error) {
      wx.showToast({ title: "加载失败", icon: "none" });
    }
  },
  openCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/search/index?categoryId=${categoryId}`,
    });
  },
  openSnack(e) {
    const snackId = e.currentTarget.dataset.snackId;
    wx.navigateTo({
      url: `/pages/snack-detail/index?snackId=${snackId}`,
    });
  },
});
