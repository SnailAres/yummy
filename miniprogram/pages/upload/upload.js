Page({
  data: {
    imageUrl: '',
    cloudImageUrl: '',
    initialScore: 6,
    tasteTypes: [
      { key: 'sour', label: '酸' },
      { key: 'sweet', label: '甜' },
      { key: 'spicy', label: '辣' },
      { key: 'salty', label: '咸' }
    ],
    formTastes: { sour: 3, sweet: 3, spicy: 3, salty: 3 }
  },

  onScoreChange(e) {
    this.setData({ initialScore: e.detail.value });
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: res => {
        const tempPath = res.tempFiles[0].tempFilePath;
        this.setData({ imageUrl: tempPath });
        this.uploadFile(tempPath);
      }
    });
  },

  uploadFile(tempPath) {
    wx.cloud.uploadFile({
      cloudPath: 'snacks/' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '.jpg',
      filePath: tempPath,
      success: res => {
        this.setData({ cloudImageUrl: res.fileID });
      },
      fail: err => {
        wx.showToast({ title: '图片上传失败', icon: 'none' });
      }
    });
  },

  onSubmit(e) {
    const { name, brand } = e.detail.value;
    const { cloudImageUrl, initialScore } = this.data;
    let tastes = {};
    this.data.tasteTypes.forEach(t => {
      tastes[t.key] = parseInt(e.detail.value[`taste_${t.key}`]) || 3;
    });

    if (!name || !brand || !cloudImageUrl) {
      return wx.showToast({ title: '请填写完整信息', icon: 'none' });
    }

    wx.cloud.callFunction({
      name: 'submitSnack',
      data: { name, brand, imageUrl: cloudImageUrl, initialScore, tastes }
    }).then(() => {
      wx.showToast({ title: '提交成功！等待审核' });
      setTimeout(() => wx.switchTab({ url: '/pages/index/index' }), 1500);
    }).catch(err => {
      wx.showToast({ title: '提交失败', icon: 'none' });
    });
  }
});