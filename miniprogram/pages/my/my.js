// miniprogram/pages/my/my.js
Page({
  data: {
    myUploaded: [],
    myRated: []
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  async loadMyData() {
    const db = wx.cloud.database();
    const openid = await this.getOpenid();

    // 加载我上传的零食
    const uploadedRes = await db.collection('snacks')
      .where({ _openid: openid })
      .get();
    
    // 加载我评分的记录
    const ratedRes = await db.collection('ratings')
      .where({ userId: openid })
      .get();

    // 为评分记录补充零食名称（可选优化：用云函数聚合）
    const snackIds = ratedRes.data.map(r => r.snackId);
    let snackMap = {};
    if (snackIds.length > 0) {
      const snacks = await db.collection('snacks')
        .where({ _id: db.command.in(snackIds) })
        .field({ name: true })
        .get();
      snackMap = snacks.data.reduce((acc, s) => ({ ...acc, [s._id]: s.name }), {});
    }

    const myRated = ratedRes.data.map(r => ({
      ...r,
      snackName: snackMap[r.snackId] || '未知零食'
    }));

    this.setData({
      myUploaded: uploadedRes.data,
      myRated
    });
  },

  async getOpenid() {
    // 使用微信云开发内置方法获取 openid
    const res = await wx.cloud.getOpenId();
    return res.openid;
  },

  onShow() {
    this.loadMyData();
  }
});