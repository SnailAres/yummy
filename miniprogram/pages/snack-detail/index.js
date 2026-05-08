const api = require("../../services/api");

Page({
  data: {
    snackId: "",
    snack: null,
    reviews: [],
    isFavorite: false,
    loading: false,
  },
  onLoad(query) {
    if (!query.snackId) {
      wx.showToast({ title: "缺少零食ID", icon: "none" });
      return;
    }
    this.setData({ snackId: query.snackId });
    this.loadDetail();
  },
  async loadDetail() {
    this.setData({ loading: true });
    try {
      const data = await api.getSnackDetail(this.data.snackId);
      this.setData({
        snack: data.snack || null,
        reviews: data.reviews || [],
        isFavorite: !!data.isFavorite,
      });
    } catch (error) {
      wx.showToast({ title: error.message || "加载失败", icon: "none" });
    } finally {
      this.setData({ loading: false });
    }
  },
  async toggleFavorite() {
    try {
      const data = await api.toggleFavorite(this.data.snackId);
      this.setData({ isFavorite: !!data.isFavorite });
      wx.showToast({
        title: data.isFavorite ? "已收藏" : "已取消收藏",
        icon: "none",
      });
    } catch (error) {
      wx.showToast({ title: error.message || "操作失败", icon: "none" });
    }
  },
  buyNow() {
    const link = this.data.snack && this.data.snack.cpsInfo && this.data.snack.cpsInfo.buyLink;
    if (!link) {
      wx.showToast({ title: "暂无购买链接", icon: "none" });
      return;
    }
    wx.setClipboardData({
      data: link,
      success: () => {
        wx.showModal({
          title: "复制成功",
          content: "购买链接已复制到剪贴板。",
          showCancel: false,
        });
      },
    });
  },
});
