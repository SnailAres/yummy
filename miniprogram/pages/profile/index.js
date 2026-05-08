const api = require("../../services/api");

Page({
  data: {
    user: null,
    rewards: [
      { id: "reward_01", name: "试吃券", beanCost: 20 },
      { id: "reward_02", name: "大额优惠券", beanCost: 50 },
    ],
    loading: false,
  },
  onShow() {
    this.initUser();
  },
  async initUser() {
    this.setData({ loading: true });
    try {
      const data = await api.loginInit();
      this.setData({ user: data.user || null });
      getApp().globalData.user = data.user || null;
    } catch (error) {
      wx.showToast({ title: "加载失败", icon: "none" });
    } finally {
      this.setData({ loading: false });
    }
  },
  async redeem(e) {
    const rewardId = e.currentTarget.dataset.id;
    try {
      const data = await api.redeemBeans(rewardId);
      wx.showToast({ title: "兑换成功", icon: "success" });
      this.setData({
        "user.beansBalance": data.beansBalance,
      });
    } catch (error) {
      wx.showToast({ title: "兑换失败", icon: "none" });
    }
  },
});
