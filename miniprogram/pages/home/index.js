const api = require("../../services/api");
const { track } = require("../../utils/track");

Page({
  data: {
    keyword: "",
    banners: [],
    featured: [],
    ranking: [],
    categories: [],
    loading: false,
    error: "",
  },
  onLoad() {
    this.loadFeed();
  },
  onPullDownRefresh() {
    this.loadFeed().finally(() => wx.stopPullDownRefresh());
  },
  async loadFeed() {
    this.setData({ loading: true, error: "" });
    try {
      const data = await api.getHomeFeed();
      this.setData({
        banners: data.banners || [],
        featured: data.featured || [],
        ranking: data.ranking || [],
        categories: data.categories || [],
      });
      track("home_feed_loaded", { featuredCount: (data.featured || []).length });
    } catch (error) {
      this.setData({ error: "加载失败，请稍后重试" });
    } finally {
      this.setData({ loading: false });
    }
  },
  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },
  goSearch() {
    const value = this.data.keyword.trim();
    wx.navigateTo({
      url: `/pages/search/index?keyword=${encodeURIComponent(value)}`,
    });
  },
  onCardTap(e) {
    const snackId = e.detail.snackId;
    wx.navigateTo({
      url: `/pages/snack-detail/index?snackId=${snackId}`,
    });
  },
  quickCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/search/index?categoryId=${categoryId}`,
    });
  },
});
