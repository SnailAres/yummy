Component({
  properties: {
    maxCount: {
      type: Number,
      value: 3,
    },
  },
  data: {
    files: [],
  },
  methods: {
    chooseImages() {
      const current = this.data.files;
      if (current.length >= this.properties.maxCount) {
        wx.showToast({ title: "已达到最大上传数量", icon: "none" });
        return;
      }
      wx.chooseMedia({
        count: this.properties.maxCount - current.length,
        mediaType: ["image"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const next = current.concat(
            res.tempFiles.map((item) => ({
              path: item.tempFilePath,
            }))
          );
          this.setData({ files: next });
          this.triggerEvent(
            "change",
            next.map((item) => item.path)
          );
        },
      });
    },
    removeImage(e) {
      const index = e.currentTarget.dataset.index;
      const next = this.data.files.slice();
      next.splice(index, 1);
      this.setData({ files: next });
      this.triggerEvent(
        "change",
        next.map((item) => item.path)
      );
    },
  },
});
