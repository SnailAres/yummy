const api = require("../../services/api");

Page({
  data: {
    keyword: "",
    categoryId: "",
    sort: "recommend",
    list: [],
    total: 0,
    loading: false,
  },
  onLoad(query) {
    this.setData({
      keyword: query.keyword || "",
      categoryId: query.categoryId || "",
    });
    this.search();
  },
  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },
  onSortChange(e) {
    const value = e.currentTarget.dataset.sort;
    this.setData({ sort: value });
    this.search();
  },
  onConfirmSearch() {
    this.search();
  },
  async search() {
    this.setData({ loading: true });
    try {
      const data = await api.searchSnacks({
        keyword: this.data.keyword,
        categoryId: this.data.categoryId,
        sort: this.data.sort,
        page: 1,
        pageSize: 30,
      });
      this.setData({
        list: data.list || [],
        total: data.total || 0,
      });
    } catch (error) {
      wx.showToast({ title: "搜索失败", icon: "none" });
    } finally {
      this.setData({ loading: false });
    }
  },
  onCardTap(e) {
    wx.navigateTo({
      url: `/pages/snack-detail/index?snackId=${e.detail.snackId}`,
    });
  },
});
