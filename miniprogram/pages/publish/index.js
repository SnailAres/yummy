const api = require("../../services/api");

Page({
  data: {
    name: "",
    brand: "",
    barcode: "",
    content: "",
    priceMin: "",
    priceMax: "",
    imagePaths: [],
    submitting: false,
  },
  onInputName(e) {
    this.setData({ name: e.detail.value });
  },
  onInputBrand(e) {
    this.setData({ brand: e.detail.value });
  },
  onInputBarcode(e) {
    this.setData({ barcode: e.detail.value });
  },
  onInputContent(e) {
    this.setData({ content: e.detail.value });
  },
  onInputPriceMin(e) {
    this.setData({ priceMin: e.detail.value });
  },
  onInputPriceMax(e) {
    this.setData({ priceMax: e.detail.value });
  },
  onImagesChange(e) {
    this.setData({ imagePaths: e.detail || [] });
  },
  scanBarcode() {
    wx.scanCode({
      success: (res) => {
        this.setData({ barcode: res.result || "" });
      },
      fail: () => {
        wx.showToast({ title: "扫码失败", icon: "none" });
      },
    });
  },
  async submit() {
    if (!this.data.name.trim()) {
      wx.showToast({ title: "请填写零食名称", icon: "none" });
      return;
    }
    this.setData({ submitting: true });
    try {
      const payload = {
        name: this.data.name.trim(),
        brand: this.data.brand.trim(),
        barcode: this.data.barcode.trim(),
        coverImage: this.data.imagePaths[0] || "",
        gallery: this.data.imagePaths,
        priceRange: {
          min: Number(this.data.priceMin || 0),
          max: Number(this.data.priceMax || 0),
        },
        aiSummary: this.data.content.trim(),
        topKeywords: [],
      };
      await api.createSubmission({
        submissionType: "new_snack",
        payload,
      });
      wx.showToast({ title: "提交成功", icon: "success" });
      this.setData({
        name: "",
        brand: "",
        barcode: "",
        content: "",
        priceMin: "",
        priceMax: "",
        imagePaths: [],
      });
    } catch (error) {
      wx.showToast({ title: "提交失败", icon: "none" });
    } finally {
      this.setData({ submitting: false });
    }
  },
});
