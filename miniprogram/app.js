App({
  globalData: {
    // Leave empty to use current default cloud env in WeChat DevTools.
    envId: "",
    user: null,
  },
  onLaunch() {
    if (!wx.cloud) {
      // eslint-disable-next-line no-console
      console.error("wx.cloud is not available. Upgrade base library.");
      return;
    }
    wx.cloud.init({
      env: this.globalData.envId || undefined,
      traceUser: true,
    });
  },
});
